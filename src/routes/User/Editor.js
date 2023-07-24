import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, useOutletContext } from 'react-router-dom'
import Form, { Image, Switch } from '../../Form.js'
import MD5 from 'crypto-js/md5.js'

export default function Editor() {

    const [user, setUser] = useState({
        title: '', description: '', phone: '', skype: '', email: '',
        image: null, status: false
    })
    const [roles, setRoles] = useState()
    const context = useOutletContext()
    const navigate = useNavigate()
    const params = useParams()

    const handleSave = async () => {
        const userExport = { ...user }
        if (userExport?.password) {
            if (!userExport?.password2) {
                return context.setMessage('Відсутній повторний пароль')
            }
            if (userExport.password !== userExport.password2) {
                return context.setMessage('Пароль відрізняється від повторного пароля')
            }
            userExport.password = MD5(userExport.password).toString()
        }
        if (userExport?._id) {
            await context.api.put(['користувачі', params.id], userExport)
        } else {
            await context.api.post('/користувачі', userExport)
        }
        setUser(user => { 
            delete user.password
            delete user.password2
            return user
        })
        navigate('/користувачі/список')
    }

    const handleDelete = async () => {
        if (user?.image) {
            return alert('Спершу видаліть фото')
        }
        await context.api.delete(['користувачі', params.id])
        navigate('/користувачі/список')
    }

    useEffect(async () => {
        context.setParams({
            title: 'Користувачі / Редактор',
            router: ['user', 'editor'],
            submenu: [
                { title: 'Закрити', url: '/користувачі/список' }
            ]
        })
        const roles = await context.api.get('/ролі')
        setRoles(roles)
        if (params?.id) {
            const user = await context.api.get(['користувачі', params.id])
            if (!user) {
                return context.setMessage('Користувач не знайдений')
            }
            setUser(userPrev => ({ ...userPrev, ...user }))
        } else {
            setUser(userPrev => ({ ...userPrev, ...{ role: roles[4]._id } }))
        }
    }, [])

    return (
        <Form setData={setUser} onSave={handleSave} onDelete={handleDelete} id={user?._id}>
            <input type='text' name='title' value={user.title} pattern='.*'
                title='Заголовок' placeholder='Заголовок ...' required />
            <textarea name='description' value={user.description} pattern='.*' rows='3'
                title='Опис' placeholder='Опис ...' />
            <input type='text' name='phone' value={user.phone} pattern='.*'
                title='Телефон' placeholder='+380 67 123-45-67' />
            <input type='text' name='skype' value={user.skype} pattern='.*'
                title='Skype' placeholder='skype ...' />
            <input type='email' name='email' value={user.email} pattern='.*'
                title='Пошта' placeholder='example@domain.com' required />
            <input type='password' name='password' pattern='.*{8,32}' title='Пароль' autoComplete='off' />
            <input type='password' name='password2' pattern='.*{8,32}' title='Пароль (повторно)' autoComplete='off' />
            <Image name='image' value={user.image} title='Зображення' />
            <select name='role' value={user?.role} title='Роль'>
                {roles?.map(role => (
                    <option value={role._id} key={role._id}>{role.title}</option>
                ))}
            </select>
            <Switch name='status' value={user.status} title='Статус' description='Видимість користувача' />
        </Form>
     )
}