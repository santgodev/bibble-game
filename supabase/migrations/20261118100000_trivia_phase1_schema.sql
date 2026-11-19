-- ============================================================================
-- Fase 1 · Esquema versionado para Trivia bíblica (preparado para Fase 2)
--
-- Tablas:
--   1. public.trivia_user_progress      (progreso personal por usuario/tema/nivel)
--   2. public.trivia_rooms              (salas multijugador por código)
--   3. public.trivia_room_participants  (participantes inscritos en cada sala)
--
-- Seguridad:
--   - RLS habilitado en todas las tablas.
--   - La lectura directa de `trivia_rooms` está restringida al anfitrión y
--     a los participantes ya inscritos.
--   - El ingreso futuro mediante código se canaliza por la función RPC
--     `public.join_trivia_room_by_code(...)`, separada de la lectura directa.
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Helper genérico de updated_at para las tablas de Trivia
CREATE OR REPLACE FUNCTION public.set_trivia_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$;

-- ============================================================================
-- 1. Progreso personal de Trivia
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.trivia_user_progress (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    theme_id text NOT NULL CHECK (char_length(btrim(theme_id)) > 0),
    difficulty smallint NOT NULL CHECK (difficulty IN (1, 2, 3)),
    status text NOT NULL DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed')),
    best_score integer NOT NULL DEFAULT 0 CHECK (best_score >= 0),
    last_score integer NOT NULL DEFAULT 0 CHECK (last_score >= 0),
    total_questions integer NOT NULL DEFAULT 15 CHECK (total_questions > 0),
    attempts integer NOT NULL DEFAULT 0 CHECK (attempts >= 0),
    completed_at timestamptz,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    CONSTRAINT trivia_user_progress_unique_level UNIQUE (user_id, theme_id, difficulty)
);

CREATE INDEX IF NOT EXISTS idx_trivia_user_progress_user_updated
    ON public.trivia_user_progress (user_id, updated_at DESC);

CREATE INDEX IF NOT EXISTS idx_trivia_user_progress_theme_diff
    ON public.trivia_user_progress (theme_id, difficulty);

DROP TRIGGER IF EXISTS trg_trivia_user_progress_updated_at ON public.trivia_user_progress;
CREATE TRIGGER trg_trivia_user_progress_updated_at
    BEFORE UPDATE ON public.trivia_user_progress
    FOR EACH ROW
    EXECUTE FUNCTION public.set_trivia_updated_at();

ALTER TABLE public.trivia_user_progress ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own trivia progress" ON public.trivia_user_progress;
CREATE POLICY "Users can view own trivia progress"
    ON public.trivia_user_progress
    FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own trivia progress" ON public.trivia_user_progress;
CREATE POLICY "Users can insert own trivia progress"
    ON public.trivia_user_progress
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own trivia progress" ON public.trivia_user_progress;
CREATE POLICY "Users can update own trivia progress"
    ON public.trivia_user_progress
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own trivia progress" ON public.trivia_user_progress;
CREATE POLICY "Users can delete own trivia progress"
    ON public.trivia_user_progress
    FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);

-- ============================================================================
-- 2. Salas de Trivia
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.trivia_rooms (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    host_user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    room_code varchar(12) NOT NULL UNIQUE CHECK (room_code ~ '^[A-Z0-9]{4,12}$'),
    status text NOT NULL DEFAULT 'waiting' CHECK (status IN ('waiting', 'in_progress', 'finished', 'cancelled')),
    match_type text NOT NULL DEFAULT 'mezcla' CHECK (match_type IN ('mezcla', 'tema')),
    theme_id text NOT NULL CHECK (char_length(btrim(theme_id)) > 0),
    difficulty smallint NOT NULL CHECK (difficulty IN (1, 2, 3)),
    questions_per_team smallint NOT NULL DEFAULT 5 CHECK (questions_per_team BETWEEN 1 AND 30),
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    started_at timestamptz,
    finished_at timestamptz,
    expires_at timestamptz NOT NULL DEFAULT (now() + interval '6 hours')
);

CREATE INDEX IF NOT EXISTS idx_trivia_rooms_host_status
    ON public.trivia_rooms (host_user_id, status);

CREATE INDEX IF NOT EXISTS idx_trivia_rooms_status_created
    ON public.trivia_rooms (status, created_at DESC);

DROP TRIGGER IF EXISTS trg_trivia_rooms_updated_at ON public.trivia_rooms;
CREATE TRIGGER trg_trivia_rooms_updated_at
    BEFORE UPDATE ON public.trivia_rooms
    FOR EACH ROW
    EXECUTE FUNCTION public.set_trivia_updated_at();

-- ============================================================================
-- 3. Participantes de sala
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.trivia_room_participants (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    room_id uuid NOT NULL REFERENCES public.trivia_rooms(id) ON DELETE CASCADE,
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    display_name text NOT NULL CHECK (char_length(btrim(display_name)) > 0),
    team_name text,
    role text NOT NULL DEFAULT 'player' CHECK (role IN ('host', 'player')),
    status text NOT NULL DEFAULT 'joined' CHECK (status IN ('joined', 'ready', 'left')),
    score integer NOT NULL DEFAULT 0 CHECK (score >= 0),
    joined_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    CONSTRAINT trivia_room_participants_unique_user UNIQUE (room_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_trivia_room_participants_room
    ON public.trivia_room_participants (room_id);

CREATE INDEX IF NOT EXISTS idx_trivia_room_participants_user
    ON public.trivia_room_participants (user_id);

DROP TRIGGER IF EXISTS trg_trivia_room_participants_updated_at ON public.trivia_room_participants;
CREATE TRIGGER trg_trivia_room_participants_updated_at
    BEFORE UPDATE ON public.trivia_room_participants
    FOR EACH ROW
    EXECUTE FUNCTION public.set_trivia_updated_at();

-- Helper SECURITY DEFINER para evaluar pertenencia sin recursión en políticas RLS
CREATE OR REPLACE FUNCTION public.is_trivia_room_member(p_room_id uuid, p_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1
        FROM public.trivia_rooms r
        WHERE r.id = p_room_id
          AND r.host_user_id = p_user_id
    )
    OR EXISTS (
        SELECT 1
        FROM public.trivia_room_participants p
        WHERE p.room_id = p_room_id
          AND p.user_id = p_user_id
          AND p.status <> 'left'
    );
$$;

REVOKE ALL ON FUNCTION public.is_trivia_room_member(uuid, uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_trivia_room_member(uuid, uuid) TO authenticated;

ALTER TABLE public.trivia_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trivia_room_participants ENABLE ROW LEVEL SECURITY;

-- Políticas de trivia_rooms:
-- Solo el anfitrión o participantes ya inscritos pueden leer la sala directamente.
DROP POLICY IF EXISTS "Room host or members can view trivia rooms" ON public.trivia_rooms;
CREATE POLICY "Room host or members can view trivia rooms"
    ON public.trivia_rooms
    FOR SELECT
    TO authenticated
    USING (
        auth.uid() = host_user_id
        OR public.is_trivia_room_member(id, auth.uid())
    );

DROP POLICY IF EXISTS "Hosts can create trivia rooms" ON public.trivia_rooms;
CREATE POLICY "Hosts can create trivia rooms"
    ON public.trivia_rooms
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = host_user_id);

DROP POLICY IF EXISTS "Hosts can update own trivia rooms" ON public.trivia_rooms;
CREATE POLICY "Hosts can update own trivia rooms"
    ON public.trivia_rooms
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = host_user_id)
    WITH CHECK (auth.uid() = host_user_id);

DROP POLICY IF EXISTS "Hosts can delete own trivia rooms" ON public.trivia_rooms;
CREATE POLICY "Hosts can delete own trivia rooms"
    ON public.trivia_rooms
    FOR DELETE
    TO authenticated
    USING (auth.uid() = host_user_id);

-- Políticas de trivia_room_participants:
-- Solo miembros/anfitrión de la sala pueden consultar la lista de participantes.
DROP POLICY IF EXISTS "Room members can view participants" ON public.trivia_room_participants;
CREATE POLICY "Room members can view participants"
    ON public.trivia_room_participants
    FOR SELECT
    TO authenticated
    USING (public.is_trivia_room_member(room_id, auth.uid()));

-- El anfitrión puede inscribirse o añadir participantes directamente; los demás usuarios
-- ingresan exclusivamente mediante la RPC join_trivia_room_by_code.
DROP POLICY IF EXISTS "Hosts can insert room participants" ON public.trivia_room_participants;
CREATE POLICY "Hosts can insert room participants"
    ON public.trivia_room_participants
    FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1
            FROM public.trivia_rooms r
            WHERE r.id = room_id
              AND r.host_user_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Participants or host can update participant row" ON public.trivia_room_participants;
CREATE POLICY "Participants or host can update participant row"
    ON public.trivia_room_participants
    FOR UPDATE
    TO authenticated
    USING (
        auth.uid() = user_id
        OR EXISTS (
            SELECT 1
            FROM public.trivia_rooms r
            WHERE r.id = room_id
              AND r.host_user_id = auth.uid()
        )
    )
    WITH CHECK (
        auth.uid() = user_id
        OR EXISTS (
            SELECT 1
            FROM public.trivia_rooms r
            WHERE r.id = room_id
              AND r.host_user_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Participants or host can remove participant row" ON public.trivia_room_participants;
CREATE POLICY "Participants or host can remove participant row"
    ON public.trivia_room_participants
    FOR DELETE
    TO authenticated
    USING (
        auth.uid() = user_id
        OR EXISTS (
            SELECT 1
            FROM public.trivia_rooms r
            WHERE r.id = room_id
              AND r.host_user_id = auth.uid()
        )
    );

-- ============================================================================
-- 4. RPC separada para unión futura por código
-- ============================================================================
CREATE OR REPLACE FUNCTION public.join_trivia_room_by_code(
    p_room_code text,
    p_display_name text,
    p_team_name text DEFAULT NULL
)
RETURNS TABLE (
    room_id uuid,
    room_code varchar(12),
    status text,
    match_type text,
    theme_id text,
    difficulty smallint,
    questions_per_team smallint
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_user_id uuid := auth.uid();
    v_clean_code text := upper(btrim(coalesce(p_room_code, '')));
    v_clean_name text := btrim(coalesce(p_display_name, ''));
    v_room public.trivia_rooms%ROWTYPE;
BEGIN
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'Autenticación requerida para unirse a una sala';
    END IF;

    IF v_clean_code !~ '^[A-Z0-9]{4,12}$' THEN
        RAISE EXCEPTION 'Código de sala inválido';
    END IF;

    IF char_length(v_clean_name) = 0 THEN
        RAISE EXCEPTION 'El nombre visible no puede estar vacío';
    END IF;

    SELECT *
    INTO v_room
    FROM public.trivia_rooms r
    WHERE r.room_code = v_clean_code
      AND r.status = 'waiting'
      AND r.expires_at > now()
    LIMIT 1;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Sala no encontrada, ya iniciada o expirada';
    END IF;

    INSERT INTO public.trivia_room_participants (
        room_id,
        user_id,
        display_name,
        team_name,
        role,
        status
    )
    VALUES (
        v_room.id,
        v_user_id,
        v_clean_name,
        nullif(btrim(coalesce(p_team_name, '')), ''),
        CASE WHEN v_room.host_user_id = v_user_id THEN 'host' ELSE 'player' END,
        'joined'
    )
    ON CONFLICT (room_id, user_id)
    DO UPDATE SET
        display_name = EXCLUDED.display_name,
        team_name = coalesce(EXCLUDED.team_name, public.trivia_room_participants.team_name),
        status = 'joined',
        updated_at = now();

    RETURN QUERY
    SELECT
        v_room.id,
        v_room.room_code,
        v_room.status,
        v_room.match_type,
        v_room.theme_id,
        v_room.difficulty,
        v_room.questions_per_team;
END;
$$;

REVOKE ALL ON FUNCTION public.join_trivia_room_by_code(text, text, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.join_trivia_room_by_code(text, text, text) TO authenticated;
