import translit from 'ua-en-translit';

const transliterate = text => {
    return translit(text.toLowerCase())
    .replace(/[^ a-z0-9.-]/g, '').replace(/\s+/g, '-')
}

export default transliterate;