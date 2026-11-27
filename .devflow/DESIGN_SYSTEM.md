# DESIGN_SYSTEM — Berea Games

> Fuente compartida de normas visuales. Mantener breve, no duplicar código. VERIFICADO / ACORDADO / PENDIENTE.

## Principios universales — ACORDADO
1. Minimalismo (`- es +`): una pantalla, un objetivo principal; mucho blanco (`#FFFFFF`), sin textos de relleno ni ruido visual.
2. **Máximo 3 acciones principales visibles por sección** (barra inferior, juegos principales, acciones de resultado).
3. Menos clics, sin eliminar confirmaciones necesarias para operaciones delicadas.
4. Reutilizar componentes antes de crear nuevos; un solo sistema visual.
5. Consistencia en colores, tipografía, espaciado, botones, formularios, tarjetas y diálogos.
6. Responsive y accesible: contraste, legibilidad y tamaños táctiles adecuados.
7. Estados visibles: carga, vacío, éxito y error.
8. No rediseñar pantallas o módulos fuera del alcance de la tarea.
9. Priorizar experiencia real del usuario sobre efectos decorativos.
10. Excepciones permitidas si mejoran usabilidad y se registran aquí.

## Identidad visual existente — VERIFICADO / ACORDADO
- Guía oficial del proyecto: `DESIGN_GUIDE.md` y `.agents/rules/berea-design-system.md` — ACORDADO
- Paleta oficial (ACORDADO en `DESIGN_GUIDE.md`):
  - Lienzo `#FFFFFF`, superficie neutra `#F6F8FA` / `#F7F9FB`, texto `#1B1E23` / `#5B6573`
  - Zafiro `#1E3A5F`, Eucalipto `#2E6F65` / `#DCECE8` (Semilla y respuesta correcta), Azul acuarela `#68AEEB` / `#D6E8F8` (Discípulo), Oro champán `#8A6408` / `#F5DA7C` / `#FBF2D0` (Maestro y nota bíblica), Error suave `#C25454` / `#F7E6E6`
  - Prohibido: emojis en UI, tonos naranja/coral, bordes (`borderWidth`) en botones u opciones de respuesta, íconos de `play` en listados
- Tokens en código (VERIFICADO): `src/theme/index.ts` (nota: aún conserva tokens legacy Liquid Glass como `#EAE5E0` / `#68A877`; al crear o tocar pantallas seguir `DESIGN_GUIDE.md` sin introducir un tercer sistema)
- Tipografías (VERIFICADO): escalas `display`, `header`, `subheader`, `body`, `button`, `caption` en `src/theme/index.ts` y `src/components/AppText.tsx`
- Componentes reutilizables (VERIFICADO): `src/components/` (`AppText.tsx`, `Button.tsx`, `Card.tsx`, `Container.tsx`, `Glass.tsx`, `StudyVisualBlocks.tsx`) y `src/trivia/components/EditorialDoodle.tsx`
- Iconografía (VERIFICADO): exclusivamente `Ionicons` (`@expo/vector-icons`) y `EditorialDoodle`

## Patrones de interacción — ACORDADO / PENDIENTE
- Acción principal y secundarias: ACORDADO — máximo 3 botones en un mismo grupo; flecha discreta (`chevron-forward`) en listados en lugar de `play`.
- Trivia (ACORDADO en `DESIGN_GUIDE.md`): todos los niveles abiertos (`Semilla`, `Discípulo`, `Maestro`); durante la partida el nivel se comunica por color predominante sin texto del nivel; feedback sin bordes (`#2E6F65` correcta, `#F7E6E6` incorrecta, `#FBF2D0` explicación con cita en píldora blanca).
- Formularios, navegación, diálogos y estados generales: PENDIENTE (documentar lo que ya existe al tocar esos módulos).
- Revisión visual de cambios UI: PENDIENTE (confirmar responsable y dispositivo/plataforma de validación).

## Módulo Estudio — Biblia Visual (Marcos caps. 1–4) — VERIFICADO / ACORDADO

### Tipo y estándar de ilustraciones (`assets/study/`)
- **Organización obligatoria de carpetas (ACORDADO):**
  - Portadas: `assets/study/covers/gospel_<libro>.jpg`
  - Escenas por libro y capítulo: `assets/study/<libro>/cap-XX/<libro>_<cap>_<escena>.jpg` (`cap-01` .. `cap-16`).
- **Fuente normativa:** `.agents/rules/berea-bible-illustrations.md` (ACORDADO).
- **Estilo editorial de autor (VERIFICADO en caps. 1–4):** ilustración narrativa *ligne-claire* con trazo fino uniforme en tinta carbón (`#1B1E23`) sobre fondo blanco sólido puro (`#FFFFFF`), sin marcos, sin bordes, sin sombras 3D y sin texto ni letras. Piel y zonas sin acento permanecen en blanco limpio.
- **Paleta de acuarela (máximo 2 lavados planos por lámina):**
  - Azul acuarela (`#68AEEB` / `#D6E8F8`) + Oro champán (`#F5DA7C` / `#FBF2D0`), o
  - Eucalipto (`#2E6F65` / `#DCECE8`) + Oro champán (`#F5DA7C` / `#FBF2D0`).
- **Narrativa obligatoria:** cada lámina representa la **acción bíblica concreta** del pasaje (personajes y momento reconocible; prohibido objetos aislados o paisajes vacíos).
- **Tamaño fijo oficial y normalización (ACORDADO):**
  - Lienzo exacto **`900 × 600 px` (`3:2`)**, fondo `#FFFFFF`, margen interno uniforme **`24 px`** (área útil `852 × 552 px`), formato **JPEG calidad `80`**, objetivo `<= 90 KB`, para renderizar en `scale: 1` con `resizeMode="contain"`.
  - Script estándar: `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/normalize-study-images.ps1 -TargetPath assets/study/<libro>/cap-XX`.

### Patrones de diseño e interacción (VERIFICADO en caps. 1–4)
- **Entrada (`src/screens/StudyPathsScreen.tsx`):** tarjetas por evangelio con `EditorialDoodle`, bloque de color suave (`#D6E8F8` en Marcos), conteo de capítulos y estado `Próximamente` en libros no habilitados (`available: false`), más tarjeta resumen de versículos subrayados.
- **Lector dividido (`src/screens/BibleReaderScreen.tsx`):**
  - **Barra superior (`topBar`):** volver circular (`38×38`, `#F6F8FA`), navegación de capítulo (`<` · `Marcos N ⌄` · `>` con modal selector) y botón `Aa` (tamaños `15 / 17 / 19 / 21 px`).
  - **Panel visual superior colapsable (`topVisualPane`):** contenedor con color del evangelio (`book.accentBg`, `borderRadius: 24`, `padding: 6`), lienzo blanco `imageSurface` (`height: 236`, `borderRadius: 18`) y pie con píldora de escena (`label · ref`) + botón colapsar (`chevron-up`). Colapsado muestra barra compacta (`collapsedBar`).
  - **Lector NTV inferior (`readerPane`):** columna centrada (`maxWidth: 700`), etiqueta `NUEVA TRADUCCIÓN VIVIENTE`, encabezados de sección en Zafiro (`#1E3A5F`), versículos numerados en Eucalipto (`#2E6F65`, `lineHeight = fontSize * 1.62`) y navegación de capítulo al pie.
  - **Paginación horizontal nativa (`FlatList horizontal pagingEnabled`, `windowSize={3}`):** deslizar lateralmente arrastra el capítulo actual y revela el siguiente 1:1 con física nativa (sin saltos ni desmontaje; `gestureEnabled: false` en stack iOS).
  - **Subrayado y compartir:** tocar un versículo abre barra flotante (`highlightBar`) con 3 tonos suaves (`#DCECE8`, `#D6E8F8`, `#FBF2D0`), quitar subrayado y compartir; persistido en `AsyncStorage` (`@berea_bible_highlights_v1`, `@berea_bible_last_read_v1`).
- **Mapeo scroll → escena (`src/data/gospelsNtv.ts`):** arreglo `MARCOS_CH<N>_SCENES: ChapterSceneVisual[]` (`startVerse`, `label`, `ref`, `image`). Cobertura verificada: Marcos completo (Caps. 1–16 · 112 escenas: Cap. 1 (7), Cap. 2 (4), Cap. 3 (5), Cap. 4 (3), Cap. 5 (3), Cap. 6 (6), Cap. 7 (4), Cap. 8 (6), Cap. 9 (6), Cap. 10 (6), Cap. 11 (4), Cap. 12 (6), Cap. 13 (4), Cap. 14 (15), Cap. 15 (16), Cap. 16 (17)). El scroll activa la escena cuyo `startVerse` cruza `focusY = scrollY + viewportHeight * 0.38` (o la última al llegar al final).
- **Rendimiento de imágenes (ACORDADO):** mantener todas las escenas del capítulo actual montadas en capas superpuestas dentro de `imageSurface` (transición por opacidad, `fadeDuration={0}`, sin desmontar `<Image>` al cambiar de escena), precargar escenas de capítulos adyacentes con `Image.prefetch` y mostrar indicador discreto solo mientras decodifica la primera lámina.

## Excepciones particulares — PENDIENTE
- Ninguna registrada aún.
