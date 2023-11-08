import axios from 'axios'
import config from '../../config.js'

export default (setSpinner, setAlert) => {

    const api = axios.create({
        baseURL: config.images.url,
        timeout: config.images.timeout,
        headers: {
            common: { 'x-api-key': config.images.key }
        }
    })

    api.interceptors.request.use(function (conf) {
        setSpinner(true)
        if (config.debug) {
            console.debug('api.image.request', conf)
        }
        return conf
    }, function (error) {
        console.error(error)
        setSpinner(false)
        return Promise.reject(error)
    })

    api.interceptors.response.use(function (response) {
        setSpinner(false)
        if (config.debug) {
            console.debug('api.image.response', response)
        }
        return response.data
    }, function (error) {
        console.error(error)
        setSpinner(false)
        if (error?.response) {
            if (error.response?.status) {
                if (error.response.status === 403) {
                    setAlert('Доступ заборонено')
                }
                if (error.response.status === 500) {
                    if (error.response?.data?.message) {
                        setAlert(
                            error.response.data.name
                            + ': ' +
                            error.response.data.message
                        )
                    }
                }
            } else {
                setAlert('Перевищенно час очікування відповіді сервера')
            }
        } else {
            setAlert('Під час виконання запиту виникла помилка')
        }
        return Promise.reject(error)
    })
    return api
}