# 📂 BIBLE-GAMES - Contexto de Proyecto

## 📌 Información Global
- **Nombre:** BIBLE-GAMES (Ecosistema ADN Impact)
- **Tipo:** Monorepo (Turborepo) con aplicaciones cliente y lógica compartida
- **Stack Frontend:** React Native (Expo) para App Móvil (`berea-mobile`), React (Vite) para Panel Web (`adn-admin-web`)
- **Stack Backend:** Serverless / BaaS (Supabase)
- **Base de Datos:** PostgreSQL (alojado en Supabase)
- **Arquitectura:** Modular basada en paquetes (`packages/`) compartidos y aplicaciones contenedoras (`apps/`). Lógica de negocio atómica delegada a la base de datos mediante RPCs (Remote Procedure Calls).

## 📌 Convenciones de Desarrollo
- **Naming:** 
  - Archivos React (Componentes/Pantallas): `PascalCase.tsx`
  - Utilidades/Servicios: `camelCase.ts`
  - Base de datos (Tablas/Columnas): `snake_case`
- **Estructura de Carpetas (Monorepo):**
  - `/apps/berea-mobile`: Aplicación móvil contenedora (Módulos: Charadas, Impostor, Devocional)
  - `/apps/adn-admin-web`: Dashboard administrativo web para líderes
  - `/packages/shared-gamification`: Lógica centralizada de puntos y recompensas
- **Manejo de Errores:** Bloques `try/catch` con logs descriptivos en consola. Las funciones de servicio retornan objetos `{ success: boolean, error?: string }` en lugar de lanzar excepciones no controladas.
- **Formato de Respuestas API (RPCs):** En Supabase se usan tipos de Postgres nativos, y los clientes mapean sus respuestas usando la lib `@supabase/supabase-js`.

## 📌 Reglas de Negocio Clave
- **¿Qué hace el sistema?** Un ecosistema gamificado para el crecimiento espiritual, que recompensa integraciones iterativas (Devocionales) y fomenta comunidad mediante minijuegos (Charadas, El Impostor).
- **Entidades Principales:**
  - `users`: Jugadores de la plataforma.
  - `events`: Tabla central de "Audit Log" donde se registra toda la actividad de obtención de puntaje.
  - `churches`: Entidades para el Ranking Multi-Iglesia.
- **Flujo de Puntos:** App Cliente -> Validación idempotente local por `session_id` -> Ejecución de RPC en Supabase u optimística en TS -> Inserción inmutable de Audit Log en `events`.

## 🧠 Instrucciones para la IA (Memoria Persistente)
1. **SIEMPRE** lee este archivo antes de realizar cambios estructurales y consultar arquitecturas de seguridad en `SECURITY_RULES.md`.
2. **NO** infieras reglas de arquitectura o dependencias desde cero, básate en el monorepo. Si no sabes algo, revisa el archivo o pregunta.
3. **Mantenimiento del Monorepo:** Cualquier lógica compartida entre Mobile y Web DEBE ir a `packages/` para evitar reescribir funciones.
4. Documenta **CADA CAMBIO** exitoso de características importantes dentro de `CHANGELOG.md`.
