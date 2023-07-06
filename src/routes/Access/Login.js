import React from 'react'
import { useOutletContext, useNavigate } from 'react-router-dom'
import { Form, FloatingLabel, Button } from 'react-bootstrap'
import ReCAPTCHA from 'react-google-recaptcha'
import MD5 from 'crypto-js/md5.js'
import { Buffer } from 'buffer'
import config from '../../config.js'

export default function () {

    const context = useOutletContext()
    const navigate = useNavigate()

    const handleSubmit = async event => {
        event.preventDefault()
        const form = new FormData(event.target)
        /*
        if (!form.get('g-recaptcha-response')) {
            return context.setAlert('Підтвердіть що ви не робот')
        }
        */
        const string = form.get('email') + ':' + MD5(form.get('password'))
        const authorization = Buffer.from(string, 'utf8').toString('base64')
        try {
            const user = await context.api.panel.get('/користувачі/вхід2', { 
                headers: {
                    'Authorization': `Basic ${authorization}}`,
                    //'g-recaptcha-response': form.get('g-recaptcha-response')
                }
            })
            context.setUser(user)
            localStorage.setItem('user', JSON.stringify(user))
            navigate('/публікації/список')
        } catch (error) {
            console.error(error)
            if (error?.response) {
                if (error.response.status === 401) {
                    context.setAlert('Неправильний логін чи пароль')
                }
            } else {
                context.setAlert('Під час авторизації виникла невідома помилка')
            }
        }
    }

    return (
        <main className="vh-100 d-flex">
            <div className="text-center m-auto">
                <Form className="border p-3" onSubmit={handleSubmit}>
                    <h2 className="mt-1">Авторизація</h2>
                    <FloatingLabel label="Скриня" className="mt-3">
                        <Form.Control type="email" name="email"
                            autoComplete="false" required />
                    </FloatingLabel>
                    <FloatingLabel label="Пароль" className="mt-2">
                        <Form.Control type="password" name="password"
                            autoComplete="false" required />
                    </FloatingLabel>
                    {/*
                    <div className="mt-2">
                        <ReCAPTCHA sitekey={config.google.recaptcha.key} />
                    </div>
                    */}
                    <Button variant="primary" type="submit" size="lg" className="mt-4">
                        Авторизуватись
                    </Button>
                </Form>
                <p className='mt-3 mb-3 text-muted'>© {config.copyright}</p>
            </div>
        </main>
    )
}