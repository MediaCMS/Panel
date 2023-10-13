import React from 'react'
import { useNavigate } from 'react-router-dom'
import Images from '../../blocks/Images.js'
//import Moment from 'moment'
//import Images from './Index/Images.js'
//import Filter from './Index/Filter.js'

export default function () {

    const context = useOutletContext()
    const navigate = useNavigate()

    const handleClick = image => {
        console.log('Index.handleClick', image)
        navigate('/images/editor/' + image._id)
    }

    const handleLoad = init => {
        console.log('Index.handleLoad', init)
        init.submenu[0].path = '/images/editor'
        context.init(init)
    }

    return <Images onClick={handleClick} onLoad={handleLoad} />
}
/*
export default function () {

    const [images, setImages] = useState([])
    const [filter, setFilter] = useState(false)
    const [params, setParams] = useState({
        date: {
            start: Moment().add(-10, 'years').format('YYYY-MM-DD'),
            end: Moment().format('YYYY-MM-DD'),
        },
        status: true,
        _sort: { field: 'date', order: -1 }
    })
    const context = useOutletContext()
    const navigate = useNavigate()

    const handleClick = id => {
        navigate('/images/editor/' + id)
    }

    const handleLoad = async () => {
        const images = await context.api.panel.get('/images', { params })
        setImages(images)
    }

    useEffect(() => {
        context.init({
            title: 'Зображення / Список',
            submenu: [
                { title: 'Завантажити', path: '/images/editor' },
                { title: 'Фільтр', onClick: () => setFilter(true) }
            ]
        })
    }, [])

    useEffect(async () => handleLoad(), [])

    return <>
        <Images list={images} onClick={handleClick} />
        {filter &&
            <Filter data={params} onChange={setParams}
                show={filter} onChangeShow={setFilter}
                onSubmit={handleLoad} />
        }
    </>
}
*/
