// ─────────────────────────────────────────────────────────────────────────────
// Configuración centralizada de la aplicación.
// NO contiene valores sensibles — solo lee variables de proceso.
// Fuente única de verdad: /.env en la raíz del proyecto (nunca commitear ese archivo).
// Las variables EXPO_PUBLIC_* son inyectadas por Metro en tiempo de compilación.
// Las variables sin ese prefijo (ej. WOMPI_INTEGRITY_SECRET) solo se leen
// en el servidor / scripts backend y nunca se exponen al bundle del cliente.
// ─────────────────────────────────────────────────────────────────────────────

const _wompiKey = process.env.EXPO_PUBLIC_WOMPI_PUBLIC_KEY || "";

// El ambiente se infiere automáticamente del prefijo de la llave pública:
// pub_test_  →  sandbox   (pagos de prueba)
// pub_prod_  →  production (pagos reales)
const _wompiEnv = _wompiKey.startsWith("pub_prod_") ? "production" : "sandbox";

// URL de producción usada como fallback cuando no hay variable de entorno definida.
const DEFAULT_API_BASE_URL = "https://agroapp-efmg.duckdns.org";

export const ENV = {
  // ── App ──────────────────────────────────────────────────────────────────
  APP_NAME:     process.env.EXPO_PUBLIC_APP_NAME     || "AgroApp",
  CURRENCY:     process.env.EXPO_PUBLIC_CURRENCY     || "COP",
  DELIVERY_FEE: Number(process.env.EXPO_PUBLIC_DELIVERY_FEE || 8000),

  // ── API ──────────────────────────────────────────────────────────────────
  // Prioridad: EXPO_PUBLIC_API_BASE_URL → EXPO_PUBLIC_LOCAL_API_BASE_URL → producción
  API_BASE_URL:
    process.env.EXPO_PUBLIC_API_BASE_URL ||
    process.env.EXPO_PUBLIC_LOCAL_API_BASE_URL ||
    DEFAULT_API_BASE_URL,

  // ── MongoDB ───────────────────────────────────────────────────────────────
  MONGODB_DATA_API_URL:       process.env.EXPO_PUBLIC_MONGODB_DATA_API_URL       || "",
  MONGODB_API_KEY:            process.env.EXPO_PUBLIC_MONGODB_API_KEY            || "",
  MONGODB_DATA_SOURCE:        process.env.EXPO_PUBLIC_MONGODB_DATA_SOURCE        || "Cluster0",
  MONGODB_DATABASE:           process.env.EXPO_PUBLIC_MONGODB_DATABASE           || "agroapp",
  MONGODB_ORDERS_COLLECTION:  process.env.EXPO_PUBLIC_MONGODB_ORDERS_COLLECTION  || "ordenes",

  // ── Wompi ─────────────────────────────────────────────────────────────────
  WOMPI_PUBLIC_KEY: _wompiKey,
  WOMPI_ENV:        _wompiEnv,
  WOMPI_API_BASE_URL:
    _wompiEnv === "production"
      ? "https://production.wompi.co/v1"
      : "https://sandbox.wompi.co/v1",
};
