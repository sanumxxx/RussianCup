import React, { useState, useEffect } from 'react'
import Header from '../components/Header'
import { motion } from 'framer-motion'
import RatingCard from '../components/RatingCard'

const Rating = () => {
    const [isLoading, setIsLoading] = useState(true)
    const [activeTab, setActiveTab] = useState('all')
    const [searchTerm, setSearchTerm] = useState('')

    // Расширенные тестовые данные
    const RatingList = [
        { id: 1, name: 'Егор Сидоров', score: 300, trend: 0, region: 'Москва', lastActive: '2 часа назад' },
        { id: 2, name: 'Павел Морозов', score: 275, trend: 2, region: 'Санкт-Петербург', lastActive: '1 день назад' },
        { id: 3, name: 'Андрей Смирнов', score: 230, trend: -1, region: 'Екатеринбург', lastActive: '3 часа назад' },
        { id: 4, name: 'Елена Волкова', score: 210, trend: 3, region: 'Казань', lastActive: '5 часов назад' },
        { id: 5, name: 'Мария Козлова', score: 180, trend: 1, region: 'Новосибирск', lastActive: 'сейчас' },
        { id: 6, name: 'Алексей Новиков', score: 155, trend: -2, region: 'Москва', lastActive: '1 час назад' },
        { id: 7, name: 'Иван Иванов', score: 120, trend: 0, region: 'Ростов-на-Дону', lastActive: '4 дня назад' },
        { id: 8, name: 'Ольга Петрова', score: 90, trend: -3, region: 'Самара', lastActive: '2 дня назад' },
    ]

    // Получение списка регионов для фильтра
    const regions = [...new Set(RatingList.map(item => item.region))].sort()

    // Текущий пользователь для подсветки
    const currentUserId = 5 // Например, пусть Мария Козлова будет текущим пользователем

    useEffect(() => {
        setTimeout(() => {
            setIsLoading(false)
        }, 500)
    }, [])

    // Фильтр данных по активному табу и поиску
    const getFilteredList = () => {
        let filtered = [...RatingList]

        // Фильтр по поиску
        if (searchTerm.trim() !== '') {
            filtered = filtered.filter(user =>
                user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.region.toLowerCase().includes(searchTerm.toLowerCase())
            )
        }

        // Сортировка по очкам
        filtered = filtered.sort((a, b) => b.score - a.score)

        return filtered
    }

    const filteredList = getFilteredList()

    // Вычисление статистики
    const stats = {
        totalUsers: RatingList.length,
        averageScore: Math.round(RatingList.reduce((acc, user) => acc + user.score, 0) / RatingList.length),
        topRegion: regions.map(region => {
            const count = RatingList.filter(user => user.region === region).length
            return { region, count }
        }).sort((a, b) => b.count - a.count)[0].region
    }

    // Получаем пользователя с самым большим ростом рейтинга
    const topRiser = [...RatingList].sort((a, b) => b.trend - a.trend)[0]

    return (
        <>
            <Header />

            <div className='relative w-full'>
                {/* Нижняя карточка */}
                <div className='flex flex-col w-4/5 mx-auto mt-10 bg-[#22222E] border border-[#D559FD] z-0'>
                    <div className='flex justify-between items-center w-full text-[#D559FD] px-3 py-2 font-thin'>
                        <p>russian_cup_rating_2025</p>
                        <svg
                            className='h-5 w-5 rotate-45'
                            width='800px'
                            height='800px'
                            viewBox='0 0 16 16'
                            fill='none'
                            xmlns='http://www.w3.org/2000/svg'
                        >
                            <path
                                d='M10 1H6V6L1 6V10H6V15H10V10H15V6L10 6V1Z'
                                fill='#D559FD'
                            />
                        </svg>
                    </div>
                    <div className='flex h-64 p-4 border-t border-[#D559FD] bg-[#22222E]'>
                        <p className='text-center w-full pixelify text-[#D559FD] text-4xl'>
                            Рейтинг
                        </p>
                    </div>
                </div>

                {/* Статистика - дополнительный блок над таблицей */}
                <div className='absolute top-28 left-1/2 transform -translate-x-1/2 w-5/6 z-10'>
                    <div className='flex flex-col overflow-hidden shadow-xl mb-4'>
                        <div className='flex justify-between items-center bg-[#D559FD] w-full text-white px-3 py-2 font-thin'>
                            <p>russian_cup_stats_2025</p>
                            <img
                                src='/assets/icons/plus.svg'
                                alt=''
                                className='rotate-45 h-5'
                            />
                        </div>
                        <div className='flex justify-between items-center p-4 border border-[#D559FD] bg-[#22222E] text-white'>
                            <div className='text-center'>
                                <p className='text-sm text-[#B0B5C1]'>Всего участников</p>
                                <p className='text-2xl font-bold text-[#D559FD]'>{stats.totalUsers}</p>
                            </div>
                            <div className='text-center'>
                                <p className='text-sm text-[#B0B5C1]'>Средний рейтинг</p>
                                <p className='text-2xl font-bold text-[#D559FD]'>{stats.averageScore} pts</p>
                            </div>
                            <div className='text-center'>
                                <p className='text-sm text-[#B0B5C1]'>Самый активный регион</p>
                                <p className='text-2xl font-bold text-[#D559FD]'>{stats.topRegion}</p>
                            </div>
                            <div className='text-center'>
                                <p className='text-sm text-[#B0B5C1]'>Быстрый рост</p>
                                <p className='text-2xl font-bold text-[#D559FD]'>{topRiser.name} ▲{topRiser.trend}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Основная таблица рейтинга */}
                <div className='absolute top-80 left-1/2 transform -translate-x-1/2 w-4/6 z-10'>
                    <div className='flex flex-col overflow-hidden shadow-xl'>
                        <div className='flex justify-between items-center bg-[#FC3000] w-full text-white px-3 py-2 font-thin'>
                            <p>russian_cup_rating_2025</p>
                            <img
                                src='/assets/icons/plus.svg'
                                alt=''
                                className='rotate-45 h-5'
                            />
                        </div>
                        <div className='flex flex-col p-4 border border-[#FC3000] bg-[#22222E]'>
                            <div className='flex justify-between items-center mb-4'>
                                <div className='text-white'>
                                    <p className='text-xl'>Таблица лидеров</p>
                                </div>

                                {/* Поиск */}
                                <div className='relative'>
                                    <input
                                        type='text'
                                        placeholder='Поиск участников...'
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className='px-3 py-1 rounded-lg bg-[#444A58] text-white border-1 border-[#555C69] placeholder-[#B0B5C1] w-64'
                                    />
                                </div>
                            </div>

                            {/* Табы */}
                            <div className='flex space-x-2 mb-4'>
                                <button
                                    className={`px-3 py-1 rounded-md ${activeTab === 'all' ? 'bg-[#FC3000] text-white' : 'bg-[#444A58] text-[#B0B5C1]'}`}
                                    onClick={() => setActiveTab('all')}
                                >
                                    Все время
                                </button>
                                <button
                                    className={`px-3 py-1 rounded-md ${activeTab === 'month' ? 'bg-[#FC3000] text-white' : 'bg-[#444A58] text-[#B0B5C1]'}`}
                                    onClick={() => setActiveTab('month')}
                                >
                                    Этот месяц
                                </button>
                                <button
                                    className={`px-3 py-1 rounded-md ${activeTab === 'week' ? 'bg-[#FC3000] text-white' : 'bg-[#444A58] text-[#B0B5C1]'}`}
                                    onClick={() => setActiveTab('week')}
                                >
                                    Эта неделя
                                </button>
                            </div>

                            {/* Заголовок таблицы */}
                            <div className='grid grid-cols-12 text-[#FC3000] font-bold border-b border-[#444A58] pb-2'>
                                <div className='col-span-1 text-center'>#</div>
                                <div className='col-span-1 text-center'>Δ</div>
                                <div className='col-span-1'></div>
                                <div className='col-span-4'>Участник</div>
                                <div className='col-span-2'>Активность</div>
                                <div className='col-span-3 text-right'>Очки</div>
                            </div>

                            {/* Содержимое таблицы */}
                            {isLoading ? (
                                <div className="text-white text-center py-10">Загрузка рейтинга...</div>
                            ) : filteredList.length === 0 ? (
                                <div className="text-white text-center py-10">Нет результатов по запросу</div>
                            ) : (
                                <div>
                                    {filteredList.map((user, index) => (
                                        <motion.div
                                            key={user.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.3, delay: index * 0.1 }}
                                        >
                                            <RatingCard
                                                place={index + 1}
                                                username={user.name}
                                                score={user.score}
                                                trend={user.trend}
                                                isCurrentUser={user.id === currentUserId}
                                            />
                                        </motion.div>
                                    ))}
                                </div>
                            )}

                            {/* Подвал таблицы */}
                            <div className='flex justify-between items-center mt-4 text-[#B0B5C1] text-sm'>
                                <div>
                                    Отображено: {filteredList.length} из {RatingList.length}
                                </div>
                                <div className='flex space-x-2'>
                                    <button className='px-2 py-1 rounded bg-[#444A58] hover:bg-[#FC3000] hover:text-white'>
                                        &laquo; Назад
                                    </button>
                                    <button className='px-2 py-1 rounded bg-[#444A58] hover:bg-[#FC3000] hover:text-white'>
                                        Вперед &raquo;
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Дополнительное пространство для правильного отображения контента */}
            <div className='h-[800px]'></div>
        </>
    )
}

export default Rating