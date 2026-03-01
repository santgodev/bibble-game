# 🔌 BIBLE-GAMES - Documentación API & Contratos (Supabase)

Pese a que no gestionamos Servidores REST como Node Express/NestJS (actualmente somos BaaS sobre Supabase), nuestras interfaces de conexión (`API_CONTRACT`) se componen de llamadas **Directas desde Clientes y RPCs Postgres**.

## 📌 RPC (Remote Procedure Calls) 

### `increment_user_rewards`
**Propósito:** Proteger la suma de Trophies y XP evitando colisiones o Race-Conditions, bloqueando sobre-escrituras erróneas.
- **Tipo Seguridad:** `SECURITY DEFINER` (Corre en DB con privilegios elevados del owner).
- **Parámetros de Entrada:**
  - `p_user_id` (uuid): UID final del usuario que obtendrá el aumento.
  - `p_xp` (int): XP total calculada y pre-sanitizada (Toped por cliente).
  - `p_trophies` (int): Trofeos totales validados (Toped por cliente mensual/diario).
- **Return Type:** `void` o Null.

## 📌 Modelos Críticos de Base de Datos (Edge Points)

### `events` (Audit log maestro)
El contrato dicta que toda peticion exitosa de gamificación inserte primero su evento *obligatoriamente*.
```json
{
  "user_id": "uuid() - referencia a 'users.id'",
  "event_type": "'CHARADAS' | 'IMPOSTOR_WIN' | 'DEVOTIONAL' | 'LEADER_AWARD'",
  "session_id": "'uuid()' - OBLIGATORIO: previene inserciones dobles por delays de red",
  "points_awarded": "int",
  "trophies_awarded": "int",
  "description": "'String descriptivo del logro'"
}
```

### `users`
Contrato base del jugador. En él residen contadores directos que usa la Interfaz para desplegar.
- `total_xp`: Puntos Globales que dictan tu "Nivel". Nunca bajan, persisten siempre.
- `total_trophies`: La moneda de intercambio mensual/competición global de iglesias.
- `church_id`: Entidad foranea (Iglesia Local).
