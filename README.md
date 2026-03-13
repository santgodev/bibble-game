# Berea Games - ADN Impact System 🕊️🔥

Bienvenido al ecosistema de juegos bíblicos **Berea Games**. Este proyecto incluye juegos como **Charadas**, **El Impostor** y **Trivia**, integrados con un sistema de gamificación (rachas, XP, niveles) y soporte para iglesias.

## 🚀 Guía de Inicio Rápido

Si acabas de descargar este repositorio, sigue estos pasos para que el proyecto funcione correctamente:

### 1. Instalación de Dependencias
```bash
npm install
```

### 2. Configuración de Supabase
Este proyecto depende de una base de datos **Supabase**.
1. Crea un proyecto en [Supabase](https://supabase.com/).
2. Copia el contenido de el archivo `SETUP.sql` y ejecútalo en el **SQL Editor** de tu dashboard de Supabase. Esto creará todas las tablas y funciones necesarias.

### 3. Variables de Entorno
Crea un archivo `.env` en la raíz (puedes basarte en `.env.example`) con tus credenciales:
```env
EXPO_PUBLIC_SUPABASE_URL=tu_url_de_supabase
EXPO_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key_publica
SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key (solo para scripts de seed)
```
> **⚠️ IMPORTANTE:** Nunca subas tu archivo `.env` real a un repositorio público. Asegúrate de que esté en tu `.gitignore`.

### 4. Poblar la Base de Datos (Seed)
Para que el juego tenga contenido (categorías, palabras, preguntas), ejecuta los scripts de carga:
```bash
node src/scripts/seedSupabase.js
node src/scripts/seedMassiveJSON.js
```

### 5. Iniciar la App
```bash
npm start
```

## 📱 Características Principales
- **Racha Activa (Streaks):** Sistema visual de compromiso diario.
- **Modo Impostor:** Juego social de roles con palabras bíblicas.
- **Trivia Avanzada:** Preguntas con explicación y soporte de versículos.
- **Gestión de Iglesias:** Los usuarios pueden fundar o unirse a iglesias para competir en rankings.

## 🛠️ Tecnologías
- **Expo / React Native**
- **Supabase** (Auth, Database, RPC)
- **Lucide Icons / Ionicons**
- **TypeScript**

---
Desarrollado con ❤️ para la edificación y diversión del cuerpo de Cristo.
