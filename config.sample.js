export default {
    host: 'cp.example.com',
    protocol: 'https',
    ip: '127.0.1.2',
    port: 8888,
    path: '/api',
    root: '/var/www/media/panel',
    db: 'mongodb://media:0123456789@localhost:27017/media',
    cookie: {
        maxAge: 1_000 * 60 * 60 * 24
    },
    limit: 100,
    log: '/log'
}