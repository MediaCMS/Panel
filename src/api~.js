import axios from 'axios'
import config from './config.js'

export default {

    createMain: (setLoading, setAlert) => {

        const api = axios.create({
            baseURL: config.images.url,
            timeout: config.images.timeout,
            headers: {
                common: { 'X-API-Key': config.images.key }
            }
        })

        api.interceptors.request.use(function (conf) {
            //console.log('api.image.request.config', conf)
            setLoading(true)
            return conf
        }, function (error) {
            console.log('api.image.request.error', error)
            setLoading(false)
            return Promise.reject(error)
        })

        api.interceptors.response.use(function (response) {
            setLoading(false)
            return response.data
        }, function (error) {
            console.log('api.image.response.error', error)
            console.log('api.image.response.error.message', error.message)
            setLoading(false)
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
            }
            return Promise.reject(error)
        })
        return api
    },

    createPanel: (setLoading, setAlert, navigate) => {

        const api = axios.create({
            baseURL: config.api.main.url,
            timeout: config.api.main.timeout
        })

        api.interceptors.request.use(function (conf) {
            setLoading(true)
            return conf
        }, function (error) {
            console.log('api.request.error.message', error.message)
            if (error?.request) {
                console.log('api.response.error.request', error.request)
            }
            setLoading(false)
            return Promise.reject(error)
        })

        api.interceptors.response.use(function (response) {
            setLoading(false)
            return response.data
        }, function (error) {
            console.dir(error)
            setLoading(false)
            if ('response' in error) {
                console.log('api.response.error.response', error.response)
                if (error.response?.status) {
                    switch(error.response.status) {
                        case 401: setAlert('В авторизації відмовлено'); break;
                        case 403: {
                            setAlert('Доступ заборонено')
                            navigate(config.login)
                            break;
                        }
                        case 404: setAlert('Невідомий запит REST API'); break;
                        case 500: {
                            if (error.response?.data?.message) {
                                setAlert(
                                    error.response.data.name
                                    + ': ' + 
                                    error.response.data.message
                                )
                            }
                            break;
                        }
                        default: setAlert(error.message)
                    }
                } else {
                    setAlert('Перевищенно час очікування відповіді сервера')
                }
            }
            return Promise.reject(error)
        })
        return api
    },

    createImage: (setLoading, setAlert, key) => {

        const api = axios.create({
            baseURL: config.images.url,
            timeout: config.images.timeout,
            headers: {
                common: { 'X-API-Key': config.images.key }
            }
        })

        api.interceptors.request.use(function (conf) {
            //console.log('api.image.request.config', conf)
            setLoading(true)
            return conf
        }, function (error) {
            console.log('api.image.request.error', error)
            setLoading(false)
            return Promise.reject(error)
        })

        api.interceptors.response.use(function (response) {
            setLoading(false)
            return response.data
        }, function (error) {
            console.log('api.image.response.error', error)
            console.log('api.image.response.error.message', error.message)
            setLoading(false)
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
            }
            return Promise.reject(error)
        })
        return api
    }
}