import app from './app.js';
import { env } from './config/env.js';
import { testDatabaseConnection } from './config/db.js';

const startServer = async () => {
  try {
    try {
      const result = await testDatabaseConnection();
      console.log('Database connected:', result);
    } catch (dbError) {
      console.error('Database connection failed:', dbError.message);
      console.log('Starting backend without database connection for now...');
    }

    app.listen(env.port, () => {
      console.log(`Server running on http://localhost:${env.port}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();