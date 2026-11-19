---
trigger: always_on
description: Estándar visual editorial minimalista y formato de preguntas bíblicas para Berea Games.
---

# Berea Games — Reglas de Diseño y Contenido

Al crear o modificar pantallas, componentes o bancos de preguntas en `berea-games`, sigue siempre la guía definida en `DESIGN_GUIDE.md`:

1. **Estilo 100% minimalista (`- es +`):**
   - **Menos es más (`- es +`)** y **máximo 3 botones en un mismo lugar** (ej. máx. 3 en barra inferior, máx. 3 juegos/acciones principales).
   - Fondo `#FFFFFF`, mucho espacio en blanco y tarjetas con bloques de color suave (`#DCECE8`, `#D6E8F8`, `#F5DA7C`, `#FBF2D0`, `#F6F8FA`).
   - **No usar emojis** en la interfaz; usar solo `Ionicons` o `EditorialDoodle` (`src/trivia/components/EditorialDoodle.tsx`).
   - **No usar naranja**; usar la paleta Zafiro (`#1E3A5F`), Eucalipto (`#2E6F65` / `#DCECE8`), Azul acuarela (`#68AEEB` / `#D6E8F8`) y Oro champán (`#F5DA7C` / `#FBF2D0`).
   - **No poner bordes** (`borderWidth`) en botones ni opciones de respuesta.
   - **No sobrecargar con textos pequeños:** evitar subtítulos descriptivos en botones de categorías/temas y no usar íconos de `play` en listados.

2. **Trivia — Niveles y feedback:**
   - Mantener **todos los niveles abiertos** (`Semilla`, `Discípulo`, `Maestro`) sin candados.
   - Dentro de la partida no mostrar el texto del nivel: el nivel se identifica por su **color predominante** (Eucalipto = Semilla, Zafiro/Acuarela = Discípulo, Oro champán = Maestro).
   - Respuesta correcta en `#2E6F65` sin bordes; incorrecta en `#F7E6E6` sin bordes; explicación en bloque cálido `#FBF2D0` con la cita en píldora blanca arriba.

3. **Preguntas bíblicas (`TriviaQuestion`):**
   - 4 opciones plausibles en español claro, **PROHIBIDO que la respuesta correcta sea la más larga** (longitud equilibrada en las 4 opciones y `correctIndex` rotado `0..3`), `difficulty` (`1 | 2 | 3`), `verseSupport` exacto y `explanation` breve de 1 oración.
