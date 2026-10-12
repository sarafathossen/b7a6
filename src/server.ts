import app from './app';
import dotenv from 'dotenv';
import redis from './app/lib/redis';

dotenv.config();

const port = process.env.PORT || 5000;

async function main() {
  try {
    // Redis কানেকশন ও পিং টেস্ট
    const pong = await redis.ping();
    console.log('⚡ Redis Ping Status:', pong);

    app.listen(port, () => {
      console.log(`🚀 Server running on http://localhost:${port}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
  }
}

main();