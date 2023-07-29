import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, useOutletContext } from 'react-router-dom'
import Form, { Field, Row, Cell } from '../../wrappers/Form.js'
import MD5 from 'crypto-js/md5.js'

export default function Editor() {

    const [user, setUser] = useState({
        title: '', description: '', phone: '', email: '',
        password: '', password2: '', role: '', slug: '', status: false
    })
    const [roles, setRoles] = useState()
    const context = useOutletContext()
    const navigate = useNavigate()
    const params = useParams()

    const handleSubmit = async () => {
        const userNew = { ...user }
        if (userNew?.password) {
            if (!userNew?.password2) {
                return context.setAlert('Відсутній повторний пароль')
            }
            if (userNew.password !== userNew.password2) {
                return context.setAlert('Пароль відрізняється від повторного пароля')
            }
            userNew.password = MD5(userNew.password).toString()
        } else {
            delete userNew.password
        }
        delete userNew.password2
        userNew?._id
            ? await context.api.panel.put('/користувачі/' + params.id, userNew)
            : await context.api.panel.post('/користувачі', userNew)
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
        if (params?.id) {
            const user = await context.api.panel.get('/користувачі/' + params.id)
            setUser(user)
        } else {
            setUser(user => ({ ...user, role: roles.at(-1)._id }))
        }
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
                    <Field type="password" name="password" value={user.password}
                        label="Пароль" pattern="[a-zA-Z0-9$_\-]{8,32}" autoComplete="off"
                        title="Латиниця, цифри, підкреслення (від 8 до 32 символів)" />
                </Cell>
                <Cell sm="4">
                    <Field type="password" name="password2"  value={user.password2}
                        label="Пароль (повторно)" pattern="[a-zA-Z0-9$_\-]{8,32}" autoComplete="off"
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