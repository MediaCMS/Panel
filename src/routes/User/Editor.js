import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, useOutletContext } from 'react-router-dom'
import Form, { Field, Row, Cell } from '../../wrappers/Form.js'
import MD5 from 'crypto-js/md5.js'

export default function Editor() {

    const [user, setUser] = useState({
        title: '', description: '', phone: '', email: '',
        role: '', slug: '', status: false
    })
    const [roles, setRoles] = useState()
    const context = useOutletContext()
    const navigate = useNavigate()
    const params = useParams()

    const handleSubmit = async () => {
        if (user?.password) {
            if (!user?.password2) {
                return context.setAlert('Відсутній повторний пароль')
            }
            if (user.password !== user.password2) {
                return context.setAlert('Пароль відрізняється від повторного пароля')
            }
            user.password = MD5(user.password).toString()
        }
        user?._id
            ? await context.api.panel.put('/користувачі/' + params.id, user)
            : await context.api.panel.post('/користувачі', user)
        setUser(user => {
            delete user.password
            delete user.password2
            return user
        })
        navigate('/користувачі/список')
    }

    const handleDelete = async () => {
        await context.api.panel.delete('/користувачі/' + params.id)
        navigate('/користувачі/список')
    }

    useEffect(async () => {
        context.init({
            title: 'Користувачі / Редактор',
            submenu: [
                { title: 'Закрити', path: '/користувачі/список' }
            ]
        })
        const roles = await context.api.panel.get('/ролі')
        setRoles(roles)
        if (!params?.id) return
        const user = await context.api.panel.get('/користувачі/' + params.id)
        setUser(user)
    }, [])

    return (
        <Form id={user._id} onChange={setUser} onSubmit={handleSubmit} onDelete={handleDelete}>
            <Row>
                <Cell sm="6">
                    <Field.Title value={user.title} placeholder="Леся Українка" required />
                </Cell>
                <Cell sm="6">
                    <Field.Slug value={user.slug} placeholder="леся-українка" required />
                </Cell>
            </Row>
            <Row>
                <Cell sm="6">
                    <Field type="tel" name="phone" value={user.phone} label='Телефон'
                        placeholder="+38 098 765-43-21" />
                </Cell>
                <Cell sm="6">
                    <Field type="email" name="email" value={user.email} label='Пошта'
                        placeholder="lesya.ukrainka@gmail.com" required />
                </Cell>
            </Row>
            <Row>
                <Cell sm="4">
                    <Field type="password" name="password"
                        label="Пароль" pattern="[a-zA-Z0-9_/-]{8,32}" autoComplete="off"
                        title="Латиниця, цифри, підкреслення (від 8 до 32 символів)" />
                </Cell>
                <Cell sm="4">
                    <Field type="password" name="password2" autoComplete="off"
                        label="Пароль (повторно)" pattern="[a-zA-Z0-9_/-].*{8,32}"
                        title="Латиниця, цифри, підкреслення (від 8 до 32 символів)" />
                </Cell>
                <Cell sm="4">
                    <Field type="select" name="role" value={user.role} label='Роль'>
                        {roles?.map(role => (
                            <option value={role._id} key={role._id}>{role.title}</option>
                        ))}
                    </Field>
                </Cell>
            </Row>
            <Row>
                <Field.Description value={user.description} label="Нотатки"
                    placeholder="Заміжня, має двох дітей та собаку" />
            </Row>
            <Row>
                <Cell sm="6">
                    <Field.Status value={user.status} label='Видимість користувача' />
                </Cell>
            </Row>
        </Form>
    )
}