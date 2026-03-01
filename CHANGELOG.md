# 📜 BIBLE-GAMES - Historial de Cambios del Monorepo

Este archivo registra modificaciones importantes en el proyecto BIBLE-GAMES, adhiriéndose a guías de Semantica (SemVer). Todo cambio mayor o de arquitectura DEBE listarse aquí bajo cada fecha correspondiente.

## [Unreleased]
### Added
- Instanciación oficial del sistema de proyecto `PROJECT_CONTEXT.md` y `SECURITY_RULES.md` para inteligencia asistida y directrices OWASP y arquitectura compartida.
- Refactorización de la base a Monorepo central con paquete único (Dry-Run logic) local de dependencias `shared-gamification` implementando cálculo de puntos global para la app móvil y dashboard backend. 
- Implementacion `increment_user_rewards` en Supabase para proteger atómicamente contra Race-Conditions.
- Interceptores para `Events` table que usan `session_id` que actuan como sistema idempotente base.

### Changed
- Naming global consolidado para clientes (ahora `berea-mobile` y `adn-admin-web` agrupados bajo `apps/`).

### Fixed
- Duplicación errónea de submission points en la pantalla móvil `ResultsScreen`, por la carrera de renders de React y la validacion de "sessiones repetitivas".

