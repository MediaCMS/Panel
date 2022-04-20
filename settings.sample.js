'use strict'

export default {
    host: 'пк.медіа',
    uri: '/ппі',
    protocol: 'https',
    ip: '127.0.0.1',
    port: 8888,
    path: 'media/panel',
    db: 'mongodb://media:0123456789@localhost:27017/media',
    key: '',
    session: {
        name: 'mySecureSession',
        maxAge: (1_000 * 60 * 60 * 24),
        secret: 'my secure secret key',
        keys: ['key1', 'key2']
    },
}