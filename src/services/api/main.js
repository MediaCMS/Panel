import axios from 'axios'
import config from '../../config.js'

export default (setWait, setAlert) => {

    const api = axios.create({
        baseURL: config.main.url,
        timeout: config.main.timeout,
        withCredentials: true
    })

    api.interceptors.request.use(
        conf => {
            setWait(true)
            if (config.debug) {
                console.debug(
                    'api.main.request',
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
        response =>{
            setWait(false)
            if (config.debug) {
                console.debug(
                    'api.main.response',
                    response.config.url,
                    response
                )
            }
            return response.data
        }, 
        error => {
            setWait(false)
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