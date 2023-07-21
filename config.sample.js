export default {
    host: 'cp.example.com',
    protocol: 'https',
    ip: '127.0.1.2',
    port: 8888,
    path: '/api',
    root: '/var/www/media/panel',
    db: { 
        url: 'mongodb://media:0123456789@127.0.0.1:27017/media',
        options: {
            connectTimeoutMS: 5_000,
            socketTimeoutMS: 5_000,
            serverSelectionTimeoutMS: 5_000,
            useUnifiedTopology: true
        }
    },
    jwt: {
        key: ''        
    },
    cookie: {
        maxAge: 1_000 * 60 * 60 * 24
    },
    google: {
        recaptcha: {
            url: 'https://www.google.com/recaptcha/api/siteverify',
            key: ''
        }
    },
    limit: 100,
    log: '/log'
}