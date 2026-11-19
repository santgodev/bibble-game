# Esquema de Supabase para Trivia bíblica (Fase 1 → Fase 2)

En la Fase 1 el cliente funciona **100 % con datos locales** (`AsyncStorage` y `src/data/*`, mientras `src/lib/supabase.ts` permanece con `SUPABASE_ENABLED = false`).  
La migración versionada en [20261118100000_trivia_phase1_schema.sql](./migrations/20261118100000_trivia_phase1_schema.sql) deja listo el modelo relacional, índices y políticas RLS para la Fase 2.

---

## Tablas preparadas

### 1. `public.trivia_user_progress`
- Clave única por `(user_id, theme_id, difficulty)` para evitar duplicados de nivel.
- Relaciona `user_id` con `auth.users(id)` (`ON DELETE CASCADE`).
- Registra `status` (`'in_progress'` | `'completed'`), `best_score`, `last_score`, `total_questions`, `attempts`, `completed_at`, `created_at` y `updated_at`.
- **RLS**: cada usuario autenticado solo puede leer y modificar sus propios registros (`auth.uid() = user_id`).

### 2. `public.trivia_rooms`
- Representa una sala remota con `host_user_id`, `room_code` único (`^[A-Z0-9]{4,12}$`), `status` (`'waiting'` | `'in_progress'` | `'finished'` | `'cancelled'`), `match_type` (`'mezcla'` | `'tema'`), `theme_id`, `difficulty` (`1..3`), `questions_per_team` y fechas (`created_at`, `updated_at`, `started_at`, `finished_at`, `expires_at`).
- **RLS**: la lectura directa (`SELECT`) está bloqueada salvo para el anfitrión o los participantes ya inscritos en la sala (evaluado con `public.is_trivia_room_member`). Esto evita que un cliente liste o adivine salas ajenas por lectura directa de tabla.

### 3. `public.trivia_room_participants`
- Relaciona cada sala (`room_id`) con `user_id`, su `display_name`, `team_name`, `role` (`'host'` | `'player'`), `status` (`'joined'` | `'ready'` | `'left'`) y `score`.
- Restricción `UNIQUE (room_id, user_id)` para impedir inscripciones duplicadas en la misma sala.
- **RLS**: solo los miembros o anfitrión de la sala pueden consultar la lista de participantes; el anfitrión inserta directamente al crear la sala y los demás jugadores ingresan por RPC.

---

## Flujo de conexión previsto para la Fase 2

1. **Sincronización de «Mi progreso» (`progressStorage.ts`)**:
   - Cuando `SUPABASE_ENABLED` se reactive y exista sesión (`supabase.auth.getUser()`):
     - Al abrir `TriviaProgressScreen`, leer `trivia_user_progress` del usuario y fusionar con `@trivia_personal_progress_v1` manteniendo el mayor `best_score` y el estado `'completed'` si alguno de los dos ya completó ese `(theme_id, difficulty)`.
     - Al finalizar una partida en `TriviaSoloGameScreen`, hacer `upsert` sobre `(user_id, theme_id, difficulty)` usando exactamente `evaluateLevelCompletion(...)` para determinar si `status = 'completed'`.
2. **Creación y unión a salas por código**:
   - **Anfitrión**: genera un `room_code` alfanumérico de 6 caracteres, inserta la fila en `public.trivia_rooms` y su propia fila con `role = 'host'` en `public.trivia_room_participants`.
   - **Invitado que ingresa con código**: en lugar de consultar `trivia_rooms` directamente (bloqueado por RLS para no miembros), llama a:
     ```ts
     const { data, error } = await supabase.rpc('join_trivia_room_by_code', {
       p_room_code: code,
       p_display_name: displayName,
       p_team_name: teamName ?? null,
     });
     ```
   - La función `SECURITY DEFINER` valida sesión, código y vigencia (`status = 'waiting' AND expires_at > now()`), realiza un `INSERT ... ON CONFLICT (room_id, user_id) DO UPDATE` en `trivia_room_participants` y habilita al cliente para leer la sala y suscribirse por Realtime.
