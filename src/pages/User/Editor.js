import React, { useState, useEffect } from 'react'
import { useOutletContext } from 'react-router-dom'
import Form, { Field, Row, Cell } from '../../components/Form.js'
import MD5 from 'crypto-js/md5.js'

export default props => {

    const [user, setUser] = useState({})
    const [roles, setRoles] = useState()
    const context = useOutletContext()

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
            ? await context.api.panel.put('/users/' + props.id, userNew)
            : await context.api.panel.post('/users', userNew)
        props.onChange()
    }

    const handleDelete = async () => {
        await context.api.panel.delete('/users/' + props.id)
        props.onChange()
    }

    useEffect(async () => {
        const roles = await context.api.panel.get('/roles')
        setRoles(roles)
        props?.id
            ? setUser(await context.api.panel.get('/users/' + props.id))
            : setUser(user => ({ ...user, role: roles.at(-1)._id }))
   }, [])

    return (
        <Form data={user} show={props.show} onHide={props.onHide}
            onChange={setUser} onSubmit={handleSubmit} onDelete={handleDelete}
            title="Редагування користувача">
            <Row>
                <Cell sm="6">
                    <Field.Title placeholder="Леся Українка" required />
                </Cell>
                <Cell sm="6">
                    <Field.Slug source={user.title} placeholder="lesia-ukrainka" required />
                </Cell>
            </Row>
            <Row>
                <Cell sm="6">
                    <Field type="text" name="phone" label='Телефон'
                        placeholder="+38 098 765-43-21" />
                </Cell>
                <Cell sm="6">
                    <Field type="email" name="email" label='Пошта'
                        placeholder="lesya.ukrainka@gmail.com" required />
                </Cell>
            </Row>
            <Row>
                <Cell sm="4">
                    <Field type="password" name="password"
                        label="Пароль" pattern="[a-zA-Z0-9$_\-]{8,32}"
                        title="Латиниця, цифри, підкреслення (від 8 до 32 символів)" />
                </Cell>
                <Cell sm="4">
                    <Field type="password" name="password2"
                        label="Пароль (повторно)" pattern="[a-zA-Z0-9$_\-]{8,32}"
                        title="Латиниця, цифри, підкреслення (від 8 до 32 символів)" />
                </Cell>
                <Cell sm="4">
                    <Field type="select" name="role" label='Роль'>
                        {roles?.map(role => (
                            <option value={role._id} key={role._id}>{role.title}</option>
                        ))}
                    </Field>
                </Cell>
            </Row>
            <Row>
                <Field.Description label="Нотатки"
                    placeholder="Короткий опис ..." />
            </Row>
            <Row><Field.Image /></Row>
            <Row>
                <Cell sm="6">
                    <Field.Status label='Видимість користувача' />
                </Cell>
            </Row>
        </Form>
    )
}