require("dotenv").config();

const required = ["DATABASE_URL", "CLIENT_ORIGIN"];

for (const name of required) {
  if (!process.env[name]) {
    throw new Error(
      `Missing required environment variable: ${name}. Check your .env file.`
    );
  }
}

const env = {
  port: Number(process.env.PORT) || 4000,
  nodeEnv: process.env.NODE_ENV || "development",
  clientOrigin: process.env.CLIENT_ORIGIN,
};

module.exports = env;