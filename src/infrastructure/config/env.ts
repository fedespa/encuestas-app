export const envConfig = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: process.env.PORT || 3000,
  mongoUri: process.env.MONGO_URI!,
  accessTokenSecret: process.env.ACCESS_TOKEN_SECRET!,
  refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET!,
  accessTokenExpiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN!,
  refreshTokenExpiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN!,
  corsOrigin: process.env.CORS_ORIGIN,
};

export function validateEnv() {
  const required = [
    "MONGO_URI",
    "ACCESS_TOKEN_SECRET",
    "REFRESH_TOKEN_SECRET",
    "ACCESS_TOKEN_EXPIRES_IN",
    "REFRESH_TOKEN_EXPIRES_IN",
    "CORS_ORIGIN",
  ];

  const productionRequired = [
    "MONGO_APP_USER",
    "MONGO_APP_PASSWORD",
  ];

  const allRequired =
    process.env.NODE_ENV === "production"
      ? [...required, ...productionRequired]
      : required;

  for (const key of allRequired) {
    if (!process.env[key]) {
      throw new Error(
        `Error de Configuración: Falta la variable de entorno obligatoria: ${key}`
      );
    }
  }
}
