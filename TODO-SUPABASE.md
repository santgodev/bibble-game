# ⚠️ PENDIENTE IMPORTANTE: reconectar Supabase

> **Estado actual:** la app corre 100 % offline. `src/lib/supabase.ts` es un cliente "falso" (`SUPABASE_ENABLED = false`):
> no hay cuentas, ni ranking, ni sincronización, ni salas remotas. Todo lo que parece "online" hoy es local.
> Esto es **temporal** y hay que cerrarlo. Cada vez que corras la app en desarrollo verás un aviso en la consola que apunta a este archivo.

## Checklist (marca con [x] al terminar)

### A. Proyecto y credenciales
- [ ] Crear/confirmar el proyecto en Supabase (o recuperar el anterior).
- [ ] Rotar las llaves si estuvieron expuestas: el archivo `.env` está versionado en git (`git ls-files` lo lista). Sacarlo del repo (`git rm --cached .env`) y confirmar que `.gitignore` lo cubre.
- [ ] Completar `.env`: `EXPO_PUBLIC_SUPABASE_URL`, `EXPO_PUBLIC_SUPABASE_ANON_KEY` (la `SERVICE_ROLE_KEY` solo para scripts, **nunca** en la app).

### B. Base de datos
- [ ] Ejecutar `SETUP.sql` (el README lo menciona, pero **ese archivo no está en el repo**: recuperarlo del historial de git o reconstruirlo: tablas `users`, `events`, `churches`, `categories`, `words`, `trivia_questions`, `devotionals`, vista `church_global_ranking`, RPC `increment_user_rewards`).
- [ ] Aplicar la migración de Trivia: `supabase/migrations/20261118100000_trivia_phase1_schema.sql` (con `supabase db push` o pegándola en el SQL Editor). Instalar el CLI de Supabase si se quiere probar en local (`supabase start`).
- [ ] Probar RLS: un usuario no debe ver progreso ni salas ajenas.

### C. Reactivar el cliente
- [ ] Restaurar `createClient` en `src/lib/supabase.ts` (ver historial de git: commit `2ac85c6` y anteriores) y poner `SUPABASE_ENABLED = true`.
- [ ] Verificar login/registro (`AuthScreen`), perfil, iglesias y ranking.

### D. Trivia bíblica (Fase 2 del módulo)
- [ ] Sincronizar `trivia_user_progress` con `@trivia_personal_progress_v1` (fusionar: mayor `best_score`, `completed` si alguno lo tiene). Hacer `upsert` en `src/trivia/storage/progressStorage.ts` al terminar partida.
- [ ] Salas remotas: crear sala (`trivia_rooms` + fila `host`), unirse con la RPC `join_trivia_room_by_code` (nunca leyendo `trivia_rooms` directo). Detalle en `supabase/README.md`.
- [ ] Emparejamiento público (fase posterior).
- [ ] Decidir si las preguntas se sirven desde Supabase o siguen locales (hoy son locales en `src/data`).

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
