import redis from 'redis'

const redisClient = redis.createClient({
    host: 'localhost',
    port: 6379
})

redisClient.connect().catch((err) => {
    console.error('Falha ao conectar ao Redis:', err);
});

redisClient.on('error', (err) => {
    console.error('Redis error:', err);
})

export const setCache = async (key, data, expiration = 300) => {
    redisClient.setEx(key, expiration, JSON.stringify(data));
}

export const getCache = async (key) => {
    return new Promise((resolve, reject) => {
        redisClient.get(key, (err, data) => {
            if (err) return reject(err); 
            resolve(data ? JSON.parse(data) : null); 
        });
    });
};


export const clearCache =  async (key) => {
    redisClient.del(key);
}

export default redisClient;
