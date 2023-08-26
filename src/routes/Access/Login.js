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
        if (!form.get('g-recaptcha-response')) {
            return context.setAlert('Підтвердіть, що ви не робот')
        }
        const string = form.get('email') + ':' + MD5(form.get('password'))
        const authorization = Buffer.from(string, 'utf8').toString('base64')
        const user = await context.api.panel.post(
            '/users/login',
            { recaptcha: form.get('g-recaptcha-response') },
            { headers: { Authorization: `Basic ${authorization}}` } }
        )
        context.setUser(user)
        localStorage.setItem('user', JSON.stringify(user))
        navigate('/posts/list')
    }

    return (
        <main className="vh-100 d-flex">
            <div className="text-center m-auto">
                <Form className="border p-3" onSubmit={handleSubmit}>
                    <FloatingLabel label="Логін" className="mt-1">
                        <Form.Control type="email" name="email"
                            autoComplete="false" required />
                    </FloatingLabel>
                    <FloatingLabel label="Пароль" className="mt-2">
                        <Form.Control type="password" name="password"
                            autoComplete="false" required />
                    </FloatingLabel>
                    <div className="mt-2">
                        <ReCAPTCHA sitekey={config.google.recaptcha.key} />
                    </div>
                    <Button variant="primary" type="submit" className="mt-4">
                        Авторизуватись
                    </Button>
                </Form>
                <p className='mt-3 small text-muted'>© {config.copyright}</p>
            </div>
        </main>
    )
}