# Regla de Ilustraciones Bíblicas — Módulo Estudio (Berea Games)

Al crear o actualizar ilustraciones para las escenas de la Biblia visual (`src/data/gospelsNtv.ts` + `src/screens/BibleReaderScreen.tsx`), sigue estrictamente estas reglas:

1. **Que la imagen cuente la historia (PROHIBIDO lo genérico o solo decorativo):**
   - Nunca generar objetos aislados o paisajes vacíos sin acción (ej. una barca sola en el agua para "Primeros discípulos", o una puerta sola para "Sanidad").
   - Cada lámina debe mostrar **la acción bíblica concreta y reconocible** del pasaje (ej. Jesús llamando a Pedro y Andrés mientras dejan sus redes en la orilla; cuatro amigos abriendo el techo y bajando la camilla del paralítico; Jesús comiendo a la mesa con Leví/Mateo).

2. **Lenguaje visual único de autor:**
   - **Fondo:** blanco sólido puro (`#FFFFFF`), sin marcos, sin bordes y sin sombras 3D.
   - **Trazo:** línea fina editorial en tinta carbón (`#1B1E23`).
   - **Color:** máximo **2 lavados planos de acuarela** de la paleta oficial:
     - Eucalipto (`#2E6F65` / `#DCECE8`)
     - Azul acuarela (`#68AEEB` / `#D6E8F8`)
     - Oro champán (`#F5DA7C` / `#FBF2D0`)
   - **Cero texto o letras** dentro de la ilustración.

3. **Tamaño fijo oficial y uso del cuadro:**
   - Generar cada lámina en formato panorámico horizontal (`3:2` / `16:10`), componiendo la escena de borde a borde para aprovechar todo el espacio del cuadro sin miniaturas centradas.
   - Tamaño estándar único en la app: **`900 × 600 px` (`3:2` exacto)**, fondo `#FFFFFF`, margen interno uniforme de **`24 px`** (área útil `852 × 552 px`), formato **JPEG calidad `80`** (`<= 90 KB` objetivo), para mostrar en `scale: 1`.
   - Normalizar siempre nuevas imágenes con:
     `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/normalize-study-images.ps1 -TargetPath assets/study/<libro>/cap-XX`

4. **Cobertura completa por capítulo:**
   - Cada sección temática (`heading`) relevante del capítulo debe tener su propia escena en `ChapterSceneVisual[]` con `startVerse`, `label` y `ref` (ej. `v.1–12`).

5. **Organización obligatoria de carpetas:**
   - Portadas: `assets/study/covers/gospel_<libro>.jpg`
   - Escenas por libro y capítulo: `assets/study/<libro>/cap-XX/<libro>_<cap>_<escena>.jpg` (`cap-01`, `cap-02`, ..., `cap-16`).
