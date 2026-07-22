const _wompiKey = process.env.EXPO_PUBLIC_WOMPI_PUBLIC_KEY || "";
// El ambiente se infiere del prefijo de la llave publica:
// pub_test_ → sandbox  |  pub_prod_ → production
const _wompiEnv = _wompiKey.startsWith("pub_prod_") ? "production" : "sandbox";

export const ENV = {
  APP_NAME: process.env.EXPO_PUBLIC_APP_NAME || "AgroApp",
  CURRENCY: process.env.EXPO_PUBLIC_CURRENCY || "COP",
  DELIVERY_FEE: Number(process.env.EXPO_PUBLIC_DELIVERY_FEE || 8000),
  // EXPO_PUBLIC_LOCAL_API_BASE_URL se conserva temporalmente para instalaciones existentes.
  API_BASE_URL:
    process.env.EXPO_PUBLIC_API_BASE_URL ||
    process.env.EXPO_PUBLIC_LOCAL_API_BASE_URL ||
    "",
  WOMPI_PUBLIC_KEY: _wompiKey,
  WOMPI_ENV: _wompiEnv,
  WOMPI_API_BASE_URL:
    _wompiEnv === "production"
      ? "https://production.wompi.co/v1"
      : "https://sandbox.wompi.co/v1",
};
