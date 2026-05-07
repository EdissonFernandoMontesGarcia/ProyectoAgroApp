const _wompiKey = process.env.EXPO_PUBLIC_WOMPI_PUBLIC_KEY || "";
// El ambiente se infiere del prefijo de la llave publica:
// pub_test_ → sandbox  |  pub_prod_ → production
const _wompiEnv = _wompiKey.startsWith("pub_prod_") ? "production" : "sandbox";

export const ENV = {
  APP_NAME: process.env.EXPO_PUBLIC_APP_NAME || "AgroApp",
  CURRENCY: process.env.EXPO_PUBLIC_CURRENCY || "COP",
  DELIVERY_FEE: Number(process.env.EXPO_PUBLIC_DELIVERY_FEE || 8000),
  LOCAL_API_BASE_URL: process.env.EXPO_PUBLIC_LOCAL_API_BASE_URL || "",
  WOMPI_PUBLIC_KEY: _wompiKey,
  WOMPI_ENV: _wompiEnv,
  WOMPI_API_BASE_URL:
    _wompiEnv === "production"
      ? "https://production.wompi.co/v1"
      : "https://sandbox.wompi.co/v1",
  MONGO: {
    DATA_API_URL: process.env.EXPO_PUBLIC_MONGODB_DATA_API_URL || "",
    API_KEY: process.env.EXPO_PUBLIC_MONGODB_API_KEY || "",
    DATA_SOURCE: process.env.EXPO_PUBLIC_MONGODB_DATA_SOURCE || "Cluster0",
    DATABASE: process.env.EXPO_PUBLIC_MONGODB_DATABASE || "agroapp",
    USERS_COLLECTION:
      process.env.EXPO_PUBLIC_MONGODB_USERS_COLLECTION || "usuarios",
    ORDERS_COLLECTION:
      process.env.EXPO_PUBLIC_MONGODB_ORDERS_COLLECTION || "ordenes",
  },
};
