-- ============================================================================
-- Trivia Online por código de sala (soporta usuarios autenticados e invitados)
-- ============================================================================

CREATE SCHEMA IF NOT EXISTS private;
REVOKE ALL ON SCHEMA private FROM PUBLIC, anon, authenticated;

CREATE OR REPLACE FUNCTION public.set_trivia_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$;

-- ============================================================================
-- 1. Progreso personal de Trivia (usuarios autenticados)
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

CREATE TRIGGER trg_trivia_user_progress_updated_at
    BEFORE UPDATE ON public.trivia_user_progress
    FOR EACH ROW
    EXECUTE FUNCTION public.set_trivia_updated_at();

ALTER TABLE public.trivia_user_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own trivia progress"
    ON public.trivia_user_progress FOR SELECT TO authenticated
    USING ((select auth.uid()) = user_id);

CREATE POLICY "Users can insert own trivia progress"
    ON public.trivia_user_progress FOR INSERT TO authenticated
    WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Users can update own trivia progress"
    ON public.trivia_user_progress FOR UPDATE TO authenticated
    USING ((select auth.uid()) = user_id)
    WITH CHECK ((select auth.uid()) = user_id);

GRANT SELECT, INSERT, UPDATE ON public.trivia_user_progress TO authenticated;

-- ============================================================================
-- 2. Salas de Trivia online
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.trivia_rooms (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    room_code varchar(12) NOT NULL UNIQUE CHECK (room_code ~ '^[A-Z0-9]{4,12}$'),
    host_user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
    status text NOT NULL DEFAULT 'waiting' CHECK (status IN ('waiting', 'in_progress', 'finished', 'cancelled')),
    match_type text NOT NULL DEFAULT 'mezcla' CHECK (match_type IN ('mezcla', 'tema')),
    theme_id text NOT NULL CHECK (char_length(btrim(theme_id)) > 0),
    difficulty smallint NOT NULL CHECK (difficulty IN (1, 2, 3)),
    question_count smallint NOT NULL DEFAULT 10 CHECK (question_count BETWEEN 3 AND 30),
    seconds_per_question smallint NOT NULL DEFAULT 20 CHECK (seconds_per_question BETWEEN 10 AND 60),
    question_ids text[] NOT NULL DEFAULT '{}',
    round_number smallint NOT NULL DEFAULT 1 CHECK (round_number >= 1),
    current_question_index smallint NOT NULL DEFAULT 0 CHECK (current_question_index >= 0),
    question_started_at timestamptz,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    started_at timestamptz,
    finished_at timestamptz,
    expires_at timestamptz NOT NULL DEFAULT (now() + interval '6 hours')
);

CREATE INDEX IF NOT EXISTS idx_trivia_rooms_status_created
    ON public.trivia_rooms (status, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_trivia_rooms_expires_at
    ON public.trivia_rooms (expires_at);

CREATE TRIGGER trg_trivia_rooms_updated_at
    BEFORE UPDATE ON public.trivia_rooms FOR EACH ROW
    EXECUTE FUNCTION public.set_trivia_updated_at();

-- ============================================================================
-- 3. Participantes de sala
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.trivia_room_participants (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    room_id uuid NOT NULL REFERENCES public.trivia_rooms(id) ON DELETE CASCADE,
    user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
    display_name text NOT NULL CHECK (char_length(btrim(display_name)) BETWEEN 1 AND 28),
    role text NOT NULL DEFAULT 'player' CHECK (role IN ('host', 'player')),
    status text NOT NULL DEFAULT 'joined' CHECK (status IN ('joined', 'ready', 'left')),
    score integer NOT NULL DEFAULT 0 CHECK (score >= 0),
    correct_count integer NOT NULL DEFAULT 0 CHECK (correct_count >= 0),
    joined_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_trivia_room_participants_room
    ON public.trivia_room_participants (room_id);

CREATE INDEX IF NOT EXISTS idx_trivia_room_participants_room_score
    ON public.trivia_room_participants (room_id, score DESC);

CREATE TRIGGER trg_trivia_room_participants_updated_at
    BEFORE UPDATE ON public.trivia_room_participants FOR EACH ROW
    EXECUTE FUNCTION public.set_trivia_updated_at();

-- ============================================================================
-- 4. Tokens privados de participantes
-- ============================================================================
CREATE TABLE IF NOT EXISTS private.trivia_participant_tokens (
    participant_id uuid PRIMARY KEY REFERENCES public.trivia_room_participants(id) ON DELETE CASCADE,
    token_hash text NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE private.trivia_participant_tokens ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- 5. Respuestas por ronda y pregunta
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.trivia_room_answers (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    room_id uuid NOT NULL REFERENCES public.trivia_rooms(id) ON DELETE CASCADE,
    participant_id uuid NOT NULL REFERENCES public.trivia_room_participants(id) ON DELETE CASCADE,
    round_number smallint NOT NULL DEFAULT 1 CHECK (round_number >= 1),
    question_index smallint NOT NULL CHECK (question_index >= 0),
    question_id text NOT NULL CHECK (char_length(btrim(question_id)) > 0),
    selected_option smallint NOT NULL CHECK (selected_option BETWEEN 0 AND 3),
    is_correct boolean NOT NULL,
    points_awarded integer NOT NULL DEFAULT 0 CHECK (points_awarded BETWEEN 0 AND 1500),
    answered_at timestamptz NOT NULL DEFAULT now(),
    CONSTRAINT trivia_room_answers_unique UNIQUE (room_id, round_number, question_index, participant_id)
);

CREATE INDEX IF NOT EXISTS idx_trivia_room_answers_room_round_q
    ON public.trivia_room_answers (room_id, round_number, question_index);

-- ============================================================================
-- 6. RLS de lectura para Realtime (escritura solo vía RPC)
-- ============================================================================
ALTER TABLE public.trivia_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trivia_room_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trivia_room_answers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Active trivia rooms are readable"
    ON public.trivia_rooms FOR SELECT TO anon, authenticated
    USING (expires_at > now() - interval '1 hour');

CREATE POLICY "Active trivia participants are readable"
    ON public.trivia_room_participants FOR SELECT TO anon, authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.trivia_rooms r
            WHERE r.id = room_id AND r.expires_at > now() - interval '1 hour'
        )
    );

CREATE POLICY "Active trivia answers are readable"
    ON public.trivia_room_answers FOR SELECT TO anon, authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.trivia_rooms r
            WHERE r.id = room_id AND r.expires_at > now() - interval '1 hour'
        )
    );

GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT ON public.trivia_rooms, public.trivia_room_participants, public.trivia_room_answers TO anon, authenticated;

-- ============================================================================
-- 7. Helper privado + 7 RPCs
-- ============================================================================
CREATE OR REPLACE FUNCTION private.verify_trivia_token(
    p_room_id uuid, p_participant_id uuid, p_player_token text, p_require_host boolean DEFAULT false
)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public, extensions, private
AS $$
    SELECT EXISTS (
        SELECT 1
        FROM public.trivia_room_participants p
        JOIN private.trivia_participant_tokens t ON t.participant_id = p.id
        WHERE p.id = p_participant_id
          AND p.room_id = p_room_id
          AND p.status <> 'left'
          AND (NOT p_require_host OR p.role = 'host')
          AND t.token_hash = encode(extensions.digest(convert_to(coalesce(p_player_token, ''), 'UTF8'), 'sha256'), 'hex')
    );
$$;

REVOKE ALL ON FUNCTION private.verify_trivia_token(uuid, uuid, text, boolean) FROM PUBLIC;

CREATE OR REPLACE FUNCTION public.create_trivia_room(
    p_display_name text, p_match_type text, p_theme_id text, p_difficulty smallint,
    p_question_count smallint DEFAULT 10, p_seconds_per_question smallint DEFAULT 20
)
RETURNS TABLE (room_id uuid, room_code varchar(12), participant_id uuid, player_token text)
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, extensions, private
AS $$
DECLARE
    v_clean_name text := left(btrim(coalesce(p_display_name, '')), 28);
    v_alphabet constant text := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    v_code varchar(12);
    v_room_id uuid;
    v_participant_id uuid;
    v_token text;
    v_attempts int := 0;
BEGIN
    IF char_length(v_clean_name) = 0 THEN RAISE EXCEPTION 'Escribe tu nombre para crear la sala'; END IF;
    IF p_match_type NOT IN ('mezcla', 'tema') THEN RAISE EXCEPTION 'Tipo de partida inválido'; END IF;
    IF p_difficulty NOT IN (1, 2, 3) THEN RAISE EXCEPTION 'Nivel inválido'; END IF;
    IF p_question_count < 3 OR p_question_count > 30 THEN RAISE EXCEPTION 'Cantidad de preguntas fuera de rango'; END IF;
    IF p_seconds_per_question < 10 OR p_seconds_per_question > 60 THEN RAISE EXCEPTION 'Tiempo por pregunta inválido'; END IF;

    LOOP
        v_attempts := v_attempts + 1;
        v_code := '';
        FOR i IN 1..6 LOOP
            v_code := v_code || substr(v_alphabet, floor(random() * length(v_alphabet) + 1)::int, 1);
        END LOOP;
        BEGIN
            INSERT INTO public.trivia_rooms (room_code, host_user_id, status, match_type, theme_id, difficulty, question_count, seconds_per_question)
            VALUES (v_code, auth.uid(), 'waiting', p_match_type, btrim(p_theme_id), p_difficulty, p_question_count, p_seconds_per_question)
            RETURNING id INTO v_room_id;
            EXIT;
        EXCEPTION WHEN unique_violation THEN
            IF v_attempts >= 8 THEN RAISE EXCEPTION 'No se pudo generar un código único, intenta de nuevo'; END IF;
        END;
    END LOOP;

    INSERT INTO public.trivia_room_participants (room_id, user_id, display_name, role, status)
    VALUES (v_room_id, auth.uid(), v_clean_name, 'host', 'joined')
    RETURNING id INTO v_participant_id;

    v_token := encode(extensions.gen_random_bytes(24), 'hex');
    INSERT INTO private.trivia_participant_tokens (participant_id, token_hash)
    VALUES (v_participant_id, encode(extensions.digest(convert_to(v_token, 'UTF8'), 'sha256'), 'hex'));

    RETURN QUERY SELECT v_room_id, v_code, v_participant_id, v_token;
END;
$$;

CREATE OR REPLACE FUNCTION public.join_trivia_room_by_code(p_room_code text, p_display_name text)
RETURNS TABLE (
    room_id uuid, room_code varchar(12), participant_id uuid, player_token text,
    status text, match_type text, theme_id text, difficulty smallint,
    question_count smallint, seconds_per_question smallint
)
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, extensions, private
AS $$
DECLARE
    v_clean_code text := upper(btrim(coalesce(p_room_code, '')));
    v_clean_name text := left(btrim(coalesce(p_display_name, '')), 28);
    v_room public.trivia_rooms%ROWTYPE;
    v_active_count int;
    v_participant_id uuid;
    v_token text;
BEGIN
    IF v_clean_code !~ '^[A-Z0-9]{4,12}$' THEN RAISE EXCEPTION 'Código de sala inválido'; END IF;
    IF char_length(v_clean_name) = 0 THEN RAISE EXCEPTION 'Escribe tu nombre para entrar a la sala'; END IF;

    SELECT * INTO v_room FROM public.trivia_rooms r
    WHERE r.room_code = v_clean_code AND r.status = 'waiting' AND r.expires_at > now() LIMIT 1;
    IF NOT FOUND THEN RAISE EXCEPTION 'Sala no encontrada, ya iniciada o expirada'; END IF;

    SELECT count(*) INTO v_active_count FROM public.trivia_room_participants p
    WHERE p.room_id = v_room.id AND p.status <> 'left';
    IF v_active_count >= 20 THEN RAISE EXCEPTION 'La sala alcanzó el límite de 20 jugadores'; END IF;

    INSERT INTO public.trivia_room_participants (room_id, user_id, display_name, role, status)
    VALUES (v_room.id, auth.uid(), v_clean_name, 'player', 'joined')
    RETURNING id INTO v_participant_id;

    v_token := encode(extensions.gen_random_bytes(24), 'hex');
    INSERT INTO private.trivia_participant_tokens (participant_id, token_hash)
    VALUES (v_participant_id, encode(extensions.digest(convert_to(v_token, 'UTF8'), 'sha256'), 'hex'));

    RETURN QUERY SELECT v_room.id, v_room.room_code, v_participant_id, v_token,
        v_room.status, v_room.match_type, v_room.theme_id, v_room.difficulty,
        v_room.question_count, v_room.seconds_per_question;
END;
$$;

CREATE OR REPLACE FUNCTION public.start_trivia_room(
    p_room_id uuid, p_participant_id uuid, p_player_token text, p_question_ids text[]
)
RETURNS void
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, extensions, private
AS $$
DECLARE v_q_len int := coalesce(array_length(p_question_ids, 1), 0);
BEGIN
    IF NOT private.verify_trivia_token(p_room_id, p_participant_id, p_player_token, true) THEN
        RAISE EXCEPTION 'Solo el anfitrión puede iniciar la sala';
    END IF;
    IF v_q_len < 1 OR v_q_len > 30 THEN RAISE EXCEPTION 'Lista de preguntas inválida'; END IF;

    UPDATE public.trivia_rooms
    SET status = 'in_progress', question_ids = p_question_ids, question_count = v_q_len::smallint,
        current_question_index = 0, started_at = now(), question_started_at = now()
    WHERE id = p_room_id AND status = 'waiting';
    IF NOT FOUND THEN RAISE EXCEPTION 'La sala no está disponible para iniciar'; END IF;
END;
$$;

CREATE OR REPLACE FUNCTION public.submit_trivia_answer(
    p_room_id uuid, p_participant_id uuid, p_player_token text,
    p_question_index smallint, p_question_id text, p_selected_option smallint,
    p_is_correct boolean, p_points_awarded integer
)
RETURNS TABLE (accepted boolean, total_answered integer, total_active_players integer)
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, extensions, private
AS $$
DECLARE
    v_room public.trivia_rooms%ROWTYPE;
    v_points integer;
    v_inserted_id uuid;
    v_answered int;
    v_active int;
BEGIN
    IF NOT private.verify_trivia_token(p_room_id, p_participant_id, p_player_token, false) THEN
        RAISE EXCEPTION 'Sesión de jugador inválida';
    END IF;

    SELECT * INTO v_room FROM public.trivia_rooms r WHERE r.id = p_room_id LIMIT 1;
    IF NOT FOUND OR v_room.status <> 'in_progress' OR v_room.current_question_index <> p_question_index THEN
        RETURN QUERY SELECT false, 0, 0;
        RETURN;
    END IF;

    v_points := CASE WHEN p_is_correct THEN LEAST(GREATEST(coalesce(p_points_awarded, 0), 0), 1500) ELSE 0 END;

    INSERT INTO public.trivia_room_answers (room_id, participant_id, round_number, question_index, question_id, selected_option, is_correct, points_awarded)
    VALUES (p_room_id, p_participant_id, v_room.round_number, p_question_index, coalesce(p_question_id, ''), p_selected_option, coalesce(p_is_correct, false), v_points)
    ON CONFLICT (room_id, round_number, question_index, participant_id) DO NOTHING
    RETURNING id INTO v_inserted_id;

    IF v_inserted_id IS NOT NULL AND p_is_correct THEN
        UPDATE public.trivia_room_participants SET score = score + v_points, correct_count = correct_count + 1
        WHERE id = p_participant_id AND room_id = p_room_id;
    END IF;

    SELECT count(*)::int INTO v_answered FROM public.trivia_room_answers a
    WHERE a.room_id = p_room_id AND a.round_number = v_room.round_number AND a.question_index = p_question_index;

    SELECT count(*)::int INTO v_active FROM public.trivia_room_participants p
    WHERE p.room_id = p_room_id AND p.status <> 'left';

    RETURN QUERY SELECT (v_inserted_id IS NOT NULL), v_answered, v_active;
END;
$$;

CREATE OR REPLACE FUNCTION public.advance_trivia_room(
    p_room_id uuid, p_participant_id uuid, p_player_token text
)
RETURNS TABLE (status text, current_question_index smallint)
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, extensions, private
AS $$
DECLARE
    v_room public.trivia_rooms%ROWTYPE;
    v_total int;
BEGIN
    IF NOT private.verify_trivia_token(p_room_id, p_participant_id, p_player_token, true) THEN
        RAISE EXCEPTION 'Solo el anfitrión puede avanzar la partida';
    END IF;
    SELECT * INTO v_room FROM public.trivia_rooms r WHERE r.id = p_room_id FOR UPDATE;
    IF NOT FOUND OR v_room.status <> 'in_progress' THEN RAISE EXCEPTION 'La sala no está en curso'; END IF;

    v_total := coalesce(array_length(v_room.question_ids, 1), v_room.question_count);
    IF v_room.current_question_index + 1 >= v_total THEN
        UPDATE public.trivia_rooms SET status = 'finished', finished_at = now() WHERE id = p_room_id
        RETURNING public.trivia_rooms.status, public.trivia_rooms.current_question_index INTO status, current_question_index;
    ELSE
        UPDATE public.trivia_rooms SET current_question_index = v_room.current_question_index + 1, question_started_at = now() WHERE id = p_room_id
        RETURNING public.trivia_rooms.status, public.trivia_rooms.current_question_index INTO status, current_question_index;
    END IF;
    RETURN NEXT;
END;
$$;

CREATE OR REPLACE FUNCTION public.reset_trivia_room_for_rematch(
    p_room_id uuid, p_participant_id uuid, p_player_token text, p_question_ids text[]
)
RETURNS void
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, extensions, private
AS $$
DECLARE v_q_len int := coalesce(array_length(p_question_ids, 1), 0);
BEGIN
    IF NOT private.verify_trivia_token(p_room_id, p_participant_id, p_player_token, true) THEN
        RAISE EXCEPTION 'Solo el anfitrión puede iniciar la revancha';
    END IF;
    IF v_q_len < 1 OR v_q_len > 30 THEN RAISE EXCEPTION 'Lista de preguntas inválida'; END IF;

    UPDATE public.trivia_room_participants SET score = 0, correct_count = 0 WHERE room_id = p_room_id AND status <> 'left';
    UPDATE public.trivia_rooms
    SET status = 'in_progress',
        round_number = round_number + 1,
        question_ids = p_question_ids,
        question_count = v_q_len::smallint,
        current_question_index = 0,
        started_at = now(),
        question_started_at = now(),
        finished_at = NULL,
        expires_at = now() + interval '6 hours'
    WHERE id = p_room_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.leave_trivia_room(
    p_room_id uuid, p_participant_id uuid, p_player_token text
)
RETURNS void
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, extensions, private
AS $$
DECLARE v_role text;
BEGIN
    IF NOT private.verify_trivia_token(p_room_id, p_participant_id, p_player_token, false) THEN RETURN; END IF;
    UPDATE public.trivia_room_participants SET status = 'left' WHERE id = p_participant_id AND room_id = p_room_id RETURNING role INTO v_role;
    IF v_role = 'host' THEN
        UPDATE public.trivia_rooms SET status = 'cancelled' WHERE id = p_room_id AND status = 'waiting';
    END IF;
END;
$$;

REVOKE ALL ON FUNCTION public.create_trivia_room(text, text, text, smallint, smallint, smallint) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.create_trivia_room(text, text, text, smallint, smallint, smallint) TO anon, authenticated;

REVOKE ALL ON FUNCTION public.join_trivia_room_by_code(text, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.join_trivia_room_by_code(text, text) TO anon, authenticated;

REVOKE ALL ON FUNCTION public.start_trivia_room(uuid, uuid, text, text[]) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.start_trivia_room(uuid, uuid, text, text[]) TO anon, authenticated;

REVOKE ALL ON FUNCTION public.submit_trivia_answer(uuid, uuid, text, smallint, text, smallint, boolean, integer) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.submit_trivia_answer(uuid, uuid, text, smallint, text, smallint, boolean, integer) TO anon, authenticated;

REVOKE ALL ON FUNCTION public.advance_trivia_room(uuid, uuid, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.advance_trivia_room(uuid, uuid, text) TO anon, authenticated;

REVOKE ALL ON FUNCTION public.reset_trivia_room_for_rematch(uuid, uuid, text, text[]) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.reset_trivia_room_for_rematch(uuid, uuid, text, text[]) TO anon, authenticated;

REVOKE ALL ON FUNCTION public.leave_trivia_room(uuid, uuid, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.leave_trivia_room(uuid, uuid, text) TO anon, authenticated;

-- ============================================================================
-- 8. Realtime
-- ============================================================================
ALTER TABLE public.trivia_rooms REPLICA IDENTITY FULL;
ALTER TABLE public.trivia_room_participants REPLICA IDENTITY FULL;
ALTER TABLE public.trivia_room_answers REPLICA IDENTITY FULL;

DO $$ BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE public.trivia_rooms; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE public.trivia_room_participants; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE public.trivia_room_answers; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
