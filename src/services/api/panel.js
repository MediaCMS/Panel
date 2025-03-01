import axios from 'axios'
import config from '../../config.js'

export default (setWait, setAlert, navigate) => {

    const api = axios.create({
        baseURL: config.api.url,
        timeout: config.api.timeout
    })

    api.interceptors.request.use(
        conf => {
            setWait(true)
            if (config.debug) {
                console.debug(
                    'api.panel.request',
                    conf.url,
                    conf
                )
            }
            return conf
        },
        error => {
            console.error(error)
            setWait(false)
            return Promise.reject(error)
        }
    )

    api.interceptors.response.use(
        response => {
            setWait(false)
            if (config.debug) {
                console.debug(
                    'api.panel.response',
                    response.config.url,
                    response
                )
            }
            return response.data
        }, 
        error => {
            setWait(false)
            if ('response' in error) {
                if (error.response?.status) {
                    switch(error.response.status) {
                        case 401: {
                            setAlert('Доступ заборонено')
                            navigate('/access/login')
                            break
                        } 
                        case 403: setAlert('В авторизації відмовлено'); break;
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
                    setAlert(
                        'Перевищенно час очікування відповіді сервера'
                    )
                }
            } else {
                setAlert(
                    'Під час виконання запиту виникла помилка'
                )
            }
            return Promise.reject(error)
        }
    )
    return api
}