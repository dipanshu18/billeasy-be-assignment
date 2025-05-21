import "dotenv/config";

function getEnvVars(envVarName: string) {
  if (!process.env[envVarName]) {
    throw new Error(`${envVarName} env variable is not present in .env file`);
  }

  return process.env[envVarName];
}

export const NODE_ENV = getEnvVars("NODE_ENV");
export const PORT = getEnvVars("PORT");
export const JWT_SECRET = getEnvVars("JWT_SECRET");
export const APP_ORIGIN = getEnvVars("APP_ORIGIN");
