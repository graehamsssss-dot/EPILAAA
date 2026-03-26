import dotenv from 'dotenv';

dotenv.config();

export const env = {
  port: process.env.PORT || 5000,
  dbHost: process.env.DB_HOST,
  dbPort: process.env.DB_PORT,
  dbUser: process.env.DB_USER,
  dbPassword: process.env.DB_PASSWORD,
  dbName: process.env.DB_NAME,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1d',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:4200'
};