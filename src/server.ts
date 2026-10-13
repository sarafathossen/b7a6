import app from './app';
import dotenv from 'dotenv';
import redis from './app/lib/redis';
import { seedDefaultUsers } from './app/DB/seed';

dotenv.config();

const port = process.env.PORT || 5000;

async function main() {
  try {
    
    const pong = await redis.ping();
    console.log('⚡ Redis Ping Status:', pong);


    await seedDefaultUsers();

    app.listen(port, () => {
      console.log(`🚀 Server running on http://localhost:${port}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
  }
}

main();