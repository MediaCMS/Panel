export default {
    brand: 'MediaCMS',
    title: 'Панель керування',
    api: {
        url: 'https://panel.example.com/api',
        timeout: 5_000 
    },
    main: {
        url: 'https://example.com/',
        key: '',
        timeout: 3_000 
    },
    images: {
        url: 'https://image.example.com/',
        widths: [320, 480, 640, 960, 1280, 1600, 1920, 2560, 3840],
        key: '',
        timeout: 7_000
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
    months: [
        'січня', 'лютого', 'березня', 'квітня', 'травня', 'червня',
        'липня', 'серпня', 'вересня', 'жовтня', 'листопада', 'грудня'
    ],
    copyright: '2023',
    debug: true,
    limit: 100
}