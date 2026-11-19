/**
 * Supabase DESCONECTADO temporalmente.
 *
 * Este módulo expone un cliente "offline" con la misma forma que el cliente real,
 * pero sin ninguna petición de red: nunca hay usuario y toda consulta devuelve vacío.
 * Así la app funciona 100% con datos locales (src/data).
 *
 * Para reconectar: restaurar el createClient (ver historial de git) y poner
 * SUPABASE_ENABLED = true con un proyecto válido.
 */
export const SUPABASE_ENABLED = false;

// ⚠️ PENDIENTE IMPORTANTE: reconectar Supabase. Checklist completo en TODO-SUPABASE.md (raíz del proyecto).
// Este aviso aparece en la consola de desarrollo mientras SUPABASE_ENABLED sea false.
declare const __DEV__: boolean;
if (!SUPABASE_ENABLED && typeof __DEV__ !== 'undefined' && __DEV__) {
    console.warn('[PENDIENTE IMPORTANTE] Supabase está DESCONECTADO (modo offline). Ver TODO-SUPABASE.md');
}

const OFFLINE_ERROR = null;

// Query builder encadenable (from().select().eq()...) que al hacer await devuelve vacío.
const createQuery = (): any => {
    const result = { data: null, error: OFFLINE_ERROR, count: null };
    const proxy: any = new Proxy(function () {}, {
        get: (_t, prop) => {
            if (prop === 'then') {
                return (resolve: any, reject: any) => Promise.resolve(result).then(resolve, reject);
            }
            return () => proxy;
        },
        apply: () => proxy,
    });
    return proxy;
};

const offlineAuth = {
    getUser: async () => ({ data: { user: null }, error: OFFLINE_ERROR }),
    getSession: async () => ({ data: { session: null }, error: OFFLINE_ERROR }),
    signOut: async () => ({ error: OFFLINE_ERROR }),
    signInWithPassword: async () => ({ data: { user: null, session: null }, error: { message: 'Modo sin conexión: cuentas desactivadas por ahora.' } }),
    signUp: async () => ({ data: { user: null, session: null }, error: { message: 'Modo sin conexión: cuentas desactivadas por ahora.' } }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
};

export const supabase: any = {
    auth: offlineAuth,
    from: () => createQuery(),
    rpc: () => createQuery(),
};
