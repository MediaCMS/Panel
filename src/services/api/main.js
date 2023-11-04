import axios from 'axios'
import config from '../../config.js'

export default (setSpinner, setAlert) => {

    const api = axios.create({
        baseURL: config.main.url,
        timeout: config.main.timeout,
        headers: {
            common: { 'X-API-Key': config.main.key }
        }
    })

    api.interceptors.request.use(function (conf) {
        setSpinner(true)
        if (config.debug) {
            console.debug('api.main.request', conf)
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
            console.debug('api.main.response', response)
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