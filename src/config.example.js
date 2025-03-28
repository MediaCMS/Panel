export default {
    brand: 'MediaCMS',
    title: 'Панель керування',
    api: {
        url: 'https://panel.example.com/api',
        timeout: 5_000 
    },
    main: {
        url: 'https://example.com/',
        timeout: 3_000 
    },
    images: {
        url: 'https://image.example.com/',
        types: { 
            'image/jpeg': 'jpg',
            'image/png': 'png',
            'image/gif': 'gif'
        },
        size: 8 * 1024 ** 2,
        timeout: 10_000
    },
    google: {
        recaptcha: {
            key: ''
        },
    },
    tinymce: '/tinymce/tinymce.min.js',
    highlight: {
        languages: {
            count: 5,
            list: {
                txt: 'Text', xml: 'XML', css: 'CSS', html: 'HTML', json: 'JSON',
                yaml: 'YAML', cpp: 'C++', java: 'Java', python: 'Python',
                javascript: 'JavaScript', typescript: 'TypeScript',
                perl: 'Perl', php: 'PHP'
            }
        }
    },
    copyright: '2025',
    mode: 'development',
    debug: true,
    limit: 100
}