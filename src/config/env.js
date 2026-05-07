export const ENV = {
  APP_NAME: process.env.EXPO_PUBLIC_APP_NAME || "AgroApp",
  CURRENCY: process.env.EXPO_PUBLIC_CURRENCY || "COP",
  DELIVERY_FEE: Number(process.env.EXPO_PUBLIC_DELIVERY_FEE || 8000),
  LOCAL_API_BASE_URL: process.env.EXPO_PUBLIC_LOCAL_API_BASE_URL || "",
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
