const redis = require('redis')
const client = redis.createClient(process.env.REDIS_HOST || 'redis://localhost:6379')

client.on("error", function (error) {
    console.log('Error con REDIS')
    console.error(error);
});

module.exports = client;