import Redis from 'ioredis';

const redisUrl = process.env.REDIS_URL;

const redis = redisUrl
  ? new Redis(redisUrl, { maxRetriesPerRequest: null })
  : new Redis({
      host: process.env.REDIS_HOST || '127.0.0.1',
      port: Number(process.env.REDIS_PORT) || 6379,
      password: process.env.REDIS_PASSWORD,
      username: process.env.REDIS_USER || 'default',
      maxRetriesPerRequest: null,
    });

redis.on('connect', () => {
  console.log('⚡ Redis cloud successfully connected!');
});

redis.on('error', (err) => {
  console.error('❌ Redis Connection Error:', err);
});

export default redis;