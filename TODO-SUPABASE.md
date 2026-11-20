# ⚠️ PENDIENTE IMPORTANTE: reconectar Supabase

> **Estado actual:** la app corre 100 % offline. `src/lib/supabase.ts` es un cliente "falso" (`SUPABASE_ENABLED = false`):
> no hay cuentas, ni ranking, ni sincronización, ni salas remotas. Todo lo que parece "online" hoy es local.
> Esto es **temporal** y hay que cerrarlo. Cada vez que corras la app en desarrollo verás un aviso en la consola que apunta a este archivo.

## Checklist (marca con [x] al terminar)

### A. Proyecto y credenciales
- [x] Crear/confirmar el proyecto en Supabase (`kadgcnqvsrqfkojhfltp` · `Bibble-game`).
- [ ] Rotar las llaves si estuvieron expuestas: el archivo `.env` está versionado en git (`git ls-files` lo lista). Sacarlo del repo (`git rm --cached .env`) y confirmar que `.gitignore` lo cubre.
- [x] Completar `.env`: `EXPO_PUBLIC_SUPABASE_URL`, `EXPO_PUBLIC_SUPABASE_ANON_KEY` (la `SERVICE_ROLE_KEY` solo para scripts, **nunca** en la app).

### B. Base de datos
- [x] Esquema base (`users`, `events`, `churches`, `categories`, `words`, `trivia_questions`, `devotionals`, vista `church_global_ranking`, RPC `increment_user_rewards`) activo en Supabase.
- [x] Aplicar la migración de Trivia online: `supabase/migrations/20261120163000_trivia_online_rooms.sql` (con tablas, RLS, token privado de participante, 7 RPCs y Realtime).
- [ ] Activar RLS y políticas en las 9 tablas legacy (`users`, `churches`, `events`, etc.).

### C. Reactivar el cliente
- [x] Restaurar `createClient` en `src/lib/supabase.ts` y poner `SUPABASE_ENABLED = true`.
- [ ] Verificar login/registro (`AuthScreen`), perfil, iglesias y ranking.

### D. Trivia bíblica (Fase 2 del módulo)
- [ ] Sincronizar `trivia_user_progress` con `@trivia_personal_progress_v1` (fusionar: mayor `best_score`, `completed` si alguno lo tiene). Hacer `upsert` en `src/trivia/storage/progressStorage.ts` al terminar partida.
- [x] Salas remotas por código + Realtime (`create_trivia_room`, `join_trivia_room_by_code`, `start_trivia_room`, `submit_trivia_answer`, `advance_trivia_room`, `reset_trivia_room_for_rematch`, `leave_trivia_room`).
- [ ] Emparejamiento público (fase posterior).
- [x] Preguntas locales en `src/data` resueltas por ID (`getQuestionById`) durante salas online.

### E. Recompensas y ranking
- [ ] `src/lib/gamification/rewardService.ts` ya existe pero Trivia nueva **no** lo llama todavía: conectar `submitGameResult({ gameType: 'TRIVIA', ... })` al terminar partida individual.
- [ ] Revisar que las pantallas viejas (`CategorySelectionScreen`, `TriviaGameScreen`) siguen vivas y decidir si se eliminan: hoy ya no se llega a ellas desde Trivia.

## Dónde está cada cosa
| Qué | Dónde |
|---|---|
| Cliente offline | `src/lib/supabase.ts` |
| Migración de Trivia | `supabase/migrations/20261118100000_trivia_phase1_schema.sql` |
| Explicación del flujo remoto | `supabase/README.md` |
| Servicio de recompensas | `src/lib/gamification/rewardService.ts` |
| Progreso local de Trivia | `src/trivia/storage/progressStorage.ts` |

> Consejo: pídele a Antigravity «avanza el checklist de TODO-SUPABASE.md» y trabajará punto por punto.
