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

3. **Proporción estándar y calibración:**
   - Tomar como estándar de tamaño visual `assets/study/marcos_1_bautista.jpg` (referencia `Marcos 1:1`, `scale: 1.72` en `220px` de alto).
   - Calibrar siempre el campo `scale` en `ChapterSceneVisual` (`src/data/gospelsNtv.ts`) para que todas las escenas del capítulo mantengan una presencia uniforme sin recortarse ni verse diminutas.

4. **Cobertura completa por capítulo:**
   - Cada sección temática (`heading`) relevante del capítulo debe tener su propia escena en `ChapterSceneVisual[]` con `startVerse`, `label` y `ref` (ej. `v.1–12`).
