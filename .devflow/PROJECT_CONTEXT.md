# PROJECT_CONTEXT — Berea Games

> Índice ligero compartido en Git. Estados: VERIFICADO / ACORDADO / PENDIENTE. No agregar secretos.

## Proyecto
- Nombre: Berea Games (`app.json`: `Berea` / `slug: berea`; `package.json`: `charades-app`) — VERIFICADO
- Tipo: Mobile (Expo / React Native + TypeScript; Supabase desconectado temporalmente según `README.md`) — VERIFICADO
- Propósito y usuarios: App de juegos bíblicos (Trivia, Charadas, El Impostor) y lectura/estudio bíblico NTV en español — VERIFICADO

## Stack y estructura
- Tecnologías y versiones principales: Expo `^58.0.0`, React Native `0.88.1`, React `19.3.0`, TypeScript `~6.0.3` (`strict: true`), `@react-navigation/native` `^7.5.2`, `@supabase/supabase-js` `^2.99.1`, `@expo/vector-icons` `^15.0.3` — VERIFICADO
- Gestor de paquetes / monorepo: `npm` (`package-lock.json`), repositorio único (no monorepo) — VERIFICADO
- Raíz de aplicaciones y módulos (ruta → función) — VERIFICADO:
  - `App.tsx`, `index.ts` → punto de entrada
  - `src/screens/` → pantallas principales
  - `src/components/` → componentes UI compartidos (`AppText`, `Button`, `Card`, `Container`, `Glass`, `CameraManager`, `Confetti`, `StudyVisualBlocks`)
  - `src/trivia/` → módulo de Trivia (bancos, componentes como `EditorialDoodle`, salas online)
  - `src/navigation/` → navegación React Navigation
  - `src/context/`, `src/hooks/`, `src/services/`, `src/lib/`, `src/data/`, `src/i18n/`, `src/theme/`, `src/utils/` → estado, datos, utilidades y tema
  - `supabase/` → scripts/configuración de Supabase (offline por ahora; ver `TODO-SUPABASE.md`)
- Módulos sensibles / dependencias que conviene revisar: `app.json` (permisos y configuración Expo/EAS), `eas.json`, `src/trivia/`, `TODO-SUPABASE.md`, `.env` (no versionar ni incluir secretos en commits) — VERIFICADO

## Diseño
- Fuente de reglas: `.devflow/DESIGN_SYSTEM.md` (ACORDADO), alineado con `DESIGN_GUIDE.md` y `.agents/rules/berea-design-system.md` — VERIFICADO
- Rutas a componentes y tokens reales: `DESIGN_GUIDE.md`, `src/theme/index.ts`, `src/components/`, `src/trivia/components/EditorialDoodle.tsx` — VERIFICADO

## Git y publicación
- Rama / estrategia de integración: rama actual `main`, remoto `origin` (`https://github.com/santgodev/bibble-game.git`) — VERIFICADO; estrategia de ramas: PENDIENTE
- Comando o procedimiento seguro de sincronización: PENDIENTE
- Reglas de commit y push / aprobación: requerir aprobación explícita antes de commit y push — ACORDADO
- Destino de despliegue y rama de producción: EAS Build (`eas.json`: canales `development`, `preview`, `production`; submit iOS configurado) — VERIFICADO; despliegue automático por rama: PENDIENTE

## Trello
- Tablero: Berea games - desarrollo (https://trello.com/b/ZIecMJgQ/berea-games-desarrollo) — VERIFICADO
- Listas: Por hacer → En progreso → En revisión y pruebas → hecho — VERIFICADO
- Selección: pedir nombre primero y listar tareas asignadas a esa persona; máximo 3 a la vez (ACORDADO)
- Permisos DEV FLOW: consultar; mover `Por hacer → En progreso` al elegir tarea (1/4) y `En progreso → En revisión y pruebas` al pasar pruebas (3/4); mover a `hecho` es exclusivo de personas (ACORDADO)

## Validaciones acordadas
> Misma secuencia: consultar → ejecutar → comprobar → permitir o bloquear entrega.
> No agregar comandos imaginarios. Si no existen tests: «No configurados».

| Validación | Comando real | Directorio | Cuándo aplica | Obligatoria | Estado |
|---|---|---|---|---|---|
| Build | PENDIENTE (solo `npm start` / perfiles EAS en `eas.json`) | `.` | Cambios de código/nativo | PENDIENTE | PENDIENTE |
| Lint / tipos | `npx tsc --noEmit` (sin script `lint` en `package.json`) | `.` | Cambios TypeScript | PENDIENTE | VERIFICADO (herramienta disponible) |
| Tests existentes | No configurados | `.` | N/A | No | VERIFICADO |
| Revisión visual/manual | Sin comando (`npm start`) | `.` | Cambios UI | PENDIENTE | PENDIENTE |

- Fuente de scripts verificados (ruta a manifiestos / CI): `package.json`, `tsconfig.json`, `eas.json` — VERIFICADO
- Si cambia configuración de tests o scripts, volver a revisar esta tabla (ACORDADO)
- Entrega bloqueada ante validación obligatoria fallida/no ejecutada, salvo excepción humana explícita (ACORDADO)

## Reglas especiales del proyecto
- Reglas permanentes de diseño y contenido bíblico: `.agents/rules/berea-design-system.md` y `DESIGN_GUIDE.md` — VERIFICADO
- Excepciones justificadas a DEV FLOW: PENDIENTE

## Pendientes de confirmar
- Estrategia de ramas, sincronización Git y si `main` dispara publicación automática
- Obligatoriedad de `npx tsc --noEmit`, build EAS y criterio de revisión visual
