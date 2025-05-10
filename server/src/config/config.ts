// server/src/config/config.ts

// Interface for environment variables
interface EnvConfig {
  NODE_ENV: string;
  PORT: number;
  MONGO_URI: string;
  JWT_SECRET?: string;
  JWT_EXPIRE?: string;
  CLIENT_URL: string;
}

// Default values and environment variables
const config: EnvConfig = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT || '5000', 10),
  MONGO_URI: process.env.MONGO_URI || 'mongodb://localhost:27017/loan-manager',
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRE: process.env.JWT_EXPIRE || '30d',
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:3000'
};

export default config;