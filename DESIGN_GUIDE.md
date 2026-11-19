# Berea Games — Guía de Diseño y Contenido

Esta guía condensa el estilo visual, las preferencias de interfaz y el estándar de preguntas bíblicas para **Berea Games** (Trivia, Charadas e Impostor).

---

## 1. Filosofía visual: Editorial Minimalista (`- es +`)
- **Menos es más (`- es +`):** quitar textos innecesarios, descripciones de relleno, etiquetas redundantes o conteos en botones y tarjetas.
- **Máximo 3 botones por sección o grupo:** no saturar una misma zona (ej. máximo 3 juegos principales, máximo 3 botones en barra inferior, máximo 2-3 acciones en resultados).
- **100% minimalista y limpio:** mucho aire en blanco (`#FFFFFF`), jerarquía tipográfica clara y cero ruido visual.
- **Sin botones de `play` en listados:** usar únicamente una flecha discreta (`chevron-forward`) o nada en tarjetas cuadradas.
- **Sin bordes en botones ni opciones:** nada de `borderWidth` o contornos duros en botones, tarjetas u opciones de respuesta. Usar bloques de color suave (`#F6F8FA`, `#DCECE8`, `#D6E8F8`, `#F5DA7C`, `#FBF2D0`).
- **Cero emojis en la UI:** usar únicamente íconos vectoriales (`Ionicons`) y las figuritas `EditorialDoodle`.
- **Sin naranja:** evitar tonos naranja o coral.

---

## 2. Paleta de colores oficial

| Rol | Color | Uso principal |
| :--- | :--- | :--- |
| **Lienzo principal** | `#FFFFFF` | Fondo de pantallas y modales |
| **Superficie neutra** | `#F6F8FA` / `#F7F9FB` | Opciones sin responder, tarjetas secundarias |
| **Texto principal** | `#1B1E23` | Títulos, preguntas, texto editorial |
| **Texto secundario** | `#5B6573` / `#6E7785` | Meta discreta (temporizador) |
| **Zafiro (Primario)** | `#1E3A5F` | Botones principales, acentos oscuros |
| **Eucalipto (Salvia)** | `#2E6F65` / `#DCECE8` | Nivel **Semilla**, respuesta correcta |
| **Azul acuarela** | `#1E3A5F` / `#D6E8F8` / `#68AEEB` | Nivel **Discípulo**, acentos de agua/cielo |
| **Oro champán** | `#8A6408` / `#F5DA7C` / `#FBF2D0` | Nivel **Maestro**, tarjetas destacadas y nota bíblica |
| **Error suave** | `#C25454` / `#F7E6E6` | Opción incorrecta (sin bordes) |

---

## 3. Identidad por color en los niveles de Trivia
Dentro de la partida **no se muestra el texto del nivel** (`Semilla`, `Discípulo`, `Maestro`); el usuario lo identifica directamente por el color predominante de la interfaz (barra de progreso, contador, reloj, figurita `EditorialDoodle`, insignias `A/B/C/D` y botón **Continuar**):

- **Semilla (1 · Básico):** Eucalipto (`#2E6F65`, suave `#DCECE8`, doodle `#8CC4B8`).
- **Discípulo (2 · Intermedio):** Zafiro / Azul acuarela (`#1E3A5F`, suave `#D6E8F8`, doodle `#68AEEB`).
- **Maestro (3 · Avanzado):** Oro champán (`#8A6408`, suave `#F5DA7C`, pista `#FBF0C9`).

En el selector de nivel (`DifficultySelectorModal`):
- Cada nivel usa su tarjeta de bloque de color (`#DCECE8`, `#D6E8F8`, `#F5DA7C`), solo con nombre y etiqueta corta (`Básico`, `Intermedio`, `Avanzado` o mejor puntaje si está completado).

---

## 4. Figuritas `EditorialDoodle`
- Estilo **trazo lineal fino + mancha de color suave** (`src/trivia/components/EditorialDoodle.tsx`), renderizadas con `View` nativos (sin dependencias externas).
- Cada tema lleva una figura relacionada (`sage`, `dove`, `crown`, `scroll`, `tablet`, `olive`, `temple`, `mountain`, `star`, `trophy`) mapeada en `getDoodleForThemeId(id)`.

---

## 5. Pantalla de juego y feedback
- **Barra superior:** botón atrás circular suave, título centrado del tema y contador (`1/15`), más barra de progreso delgada debajo.
- **Pregunta:** texto directo y amplio (`22px`, `fontWeight: '800'`) junto a la figurita del tema.
- **Respuesta correcta:** tarjeta sin bordes en eucalipto sólido `#2E6F65` con texto `#FFFFFF`, insignia circular blanca y `checkmark-circle`.
- **Respuesta incorrecta:** tarjeta sin bordes en rosa apagado `#F7E6E6` con texto `#9E3A3A` y `close-circle`.
- **Explicación / Cita bíblica:** bloque editorial cálido sin bordes (`#FBF2D0`), con la cita en píldora blanca arriba y la explicación concisa debajo (sin cajas grises ni barras laterales tipo Markdown/IA).

---

## 6. Estándar de preguntas de Trivia bíblica
- **Todos los temas y niveles abiertos:** ningún nivel (`Semilla`, `Discípulo`, `Maestro`) debe aparecer bloqueado si el tema tiene preguntas.
- **Estructura de cada `TriviaQuestion`:**
  - `id`: único y con prefijo claro del tema (ej. `com_1`, `lug_1`, `ani_1`).
  - `difficulty`: `1` (Semilla), `2` (Discípulo) o `3` (Maestro), equilibrado por nivel.
  - `question`: pregunta clara, directa y bíblicamente fiel en español natural.
  - `options`: exactamente **4 opciones** plausibles y del mismo registro. **PROHIBIDO que la respuesta correcta sea la más larga:** equilibrar la longitud de las 4 opciones para no dar pistas visuales.
  - `correctIndex`: índice `0..3` correcto, rotado de forma uniforme (no concentrado en `0`).
  - `verseSupport`: cita bíblica exacta (ej. `'2 Reyes 9:6-10'`).
  - `explanation`: 1 oración breve, clara y edificante que confirme el contexto bíblico.
