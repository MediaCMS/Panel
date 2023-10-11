import axios from 'axios'
import config from '../../config.js'

export default (setSpinner, setAlert) => {

    const api = axios.create({
        baseURL: config.images.url + '/api',
        timeout: config.images.timeout,
        headers: {
            common: { 'x-api-key': config.images.key }
        }
    })

    api.interceptors.request.use(function (conf) {
        //console.log('api.image.request.config', conf)
        setSpinner(true)
        return conf
    }, function (error) {
        console.log('api.image.request.error', error)
        setSpinner(false)
        return Promise.reject(error)
    })

    api.interceptors.response.use(function (response) {
        setSpinner(false)
        return response.data
    }, function (error) {
        console.log('api.image.response.error', error)
        console.log('api.image.response.error.message', error.message)
        setSpinner(false)
        if (error?.response) {
            console.log('api.image.response.error.response', error.response)
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