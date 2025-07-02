import Redis from 'ioredis';

const redisPub = new Redis(process.env.REDIS_URL);
const redisSub = new Redis(process.env.REDIS_URL);

redisPub.on('connect', () => console.log('✅ Redis Publisher connected'));
redisSub.on('connect', () => console.log('✅ Redis Subscriber connected'));

export { redisPub, redisSub };
