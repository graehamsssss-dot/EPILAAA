import mysql from 'mysql2/promise';
import { env } from './env.js';

export const pool = mysql.createPool({
  host: env.dbHost,
  port: Number(env.dbPort),
  user: env.dbUser,
  password: env.dbPassword,
  database: env.dbName,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export const testDatabaseConnection = async () => {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query('SELECT 1 AS ok');
    return rows;
  } finally {
    connection.release();
  }
};