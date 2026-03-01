# 🛡️ BIBLE-GAMES - Reglas de Seguridad y DevSecOps

## 📌 Autenticación y Autorización
- **Proveedor:** Supabase Auth (JWT).
- **Control de Acceso (RLS - Row Level Security):** TODAS las tablas públicas de Supabase deben tener RLS activado.
- **Roles:** El modelo asume roles que van en los claims de JWT o validaciones adicionales en vistas para `USER`, `LEADER`, y `ADMIN`. Los permisos de panel (modificar puntajes libremente) requieren validación rigurosa de líder.

## 📌 Validaciones de Datos (OWASP)
- **Prevención de Inyecciones (SQLi):** No usar strings concatenados para construir sentencias de BD. Utilizar SIEMPRE el ORM oficial `@supabase/supabase-js`, que parametriza los inputs. No dar acceso directo de "update-drop" libre a los clientes.
- **Race Conditions (Condición de carrera):** Las escrituras de contadores compartidos (ej: `total_xp`, `total_trophies`) NUNCA deben hacerse mediante Patrones "Read-Modify-Write" (leer en el cliente `total_xp = 100`, sumar y enviar `update total_xp = 110`). **SIEMPRE** usar operaciones atómicas con llamadas RPC (`increment_user_rewards`).

## 📌 Prevención de Fraude (Gamificación)
- **Idempotencia Estratégica:** Toda la lógica de "Fin de Juego" debe enviar un identificador `session_id` único por partida. El DB/Servicio debe usar esto en `events` para ignorar peticiones de fraude repetitivas (Doble Submission/Replays Peticiones HTTP).
- **Caps Diarios (Anti-Grinding):** Limitadores estáticos definidos en la lógica central para restringir a un límite humano, cortando farmeos bot (Max trofeos/Max nivel).
- **Identidad Fuerte:** Antes de otorgar los beneficios a arrays de jugadores (ej. partidas multi-jugador de Charadas/Impostor), verificar la membresía válida de cada `user_id` en la BD base.
