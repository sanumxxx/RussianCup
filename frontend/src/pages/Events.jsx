import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import Header from '../components/Header'
import EventCard from '../components/EventCard'
import ModalWindow from '../components/ModalWindow'
import CreateEventForm from '../components/events/CreateEventForm'
import EventsService from '../services/EventsService'
import { getUserRole } from '../utils/auth'
import Components from '../components'

const Events = () => {
    const navigate = useNavigate()
    const { CustomButton } = Components

    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
    const [events, setEvents] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)
    const [userRole, setUserRole] = useState(null)
    const [filters, setFilters] = useState({
        status: 'all',
        type: 'all',
        search: ''
    })

    // Загрузка мероприятий при монтировании компонента
    useEffect(() => {
        fetchEvents()
        // Определяем роль пользователя для отображения доп. возможностей
        setUserRole(getUserRole())
    }, [])

    // Загрузка мероприятий
    const fetchEvents = async () => {
        setIsLoading(true)
        setError(null)
        try {
            const data = await EventsService.getEvents()
            setEvents(data)
        } catch (error) {
            console.error('Failed to fetch events:', error)
            setError('Не удалось загрузить мероприятия. Пожалуйста, попробуйте позже.')
        } finally {
            setIsLoading(false)
        }
    }

    // Создание нового мероприятия
    const handleCreateEvent = async (eventData) => {
        try {
            const newEvent = await EventsService.createEvent(eventData)
            setEvents(prev => [newEvent, ...prev])
            setIsCreateModalOpen(false)
        } catch (error) {
            console.error('Failed to create event:', error)
            // В реальном приложении здесь должна быть обработка ошибки
            alert('Ошибка при создании мероприятия. Пожалуйста, попробуйте позже.')
        }
    }

    // Фильтрация мероприятий
    const filteredEvents = events.filter(event => {
        // Фильтр по статусу
        if (filters.status !== 'all' && event.status !== filters.status) {
            return false
        }

        // Фильтр по типу (если был бы)
        if (filters.type !== 'all' && event.event_type !== filters.type) {
            return false
        }

        // Фильтр по поисковому запросу
        if (filters.search && !event.name.toLowerCase().includes(filters.search.toLowerCase())) {
            return false
        }

        return true
    })

    // Обработчик изменения фильтров
    const handleFilterChange = (filterName, value) => {
        setFilters(prev => ({
            ...prev,
            [filterName]: value
        }))
    }

    return (
        <>
            <Header />

            <div className='relative w-full'>
                {/* Нижняя карточка */}
                <div className='flex flex-col w-4/5 mx-auto mt-10 bg-[#22222E] border border-[#D559FD] z-0'>
                    <div className='flex justify-between items-center w-full text-[#D559FD] px-3 py-2 font-thin'>
                        <p>russian_cup_events_2025</p>
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
                            Мероприятия
                        </p>
                    </div>
                </div>

                {/* Верхняя карточка */}
                <div className='absolute top-28 left-1/2 transform -translate-x-1/2 w-4/6 z-10'>
                    <div className='flex flex-col overflow-hidden shadow-xl'>
                        <div className='flex justify-between items-center bg-[#FC3000] w-full text-white px-3 py-2 font-thin'>
                            <p>russian_cup_events_2025</p>
                            <img
                                src='/assets/icons/plus.svg'
                                alt=''
                                className='rotate-45 h-5'
                            />
                        </div>
                        <div className='flex flex-col p-4 border border-[#FC3000] bg-[#22222E]'>
                            <div className="flex justify-between items-center mb-4">
                                <div className="flex items-center">
                                    <input
                                        type="text"
                                        placeholder="Поиск мероприятий..."
                                        value={filters.search}
                                        onChange={(e) => handleFilterChange('search', e.target.value)}
                                        className="px-3 py-2 rounded-lg bg-[#444A58] text-white border border-[#555C69] placeholder-[#B0B5C1]"
                                    />
                                </div>

                                {userRole === 'sponsor' && (
                                    <CustomButton
                                        placeholder="Организовать мероприятие"
                                        handleClick={() => setIsCreateModalOpen(true)}
                                    />
                                )}
                            </div>

                            <div className="flex gap-2 mb-4">
                                <button
                                    onClick={() => handleFilterChange('status', 'all')}
                                    className={`px-3 py-1 rounded-lg text-sm ${
                                        filters.status === 'all'
                                            ? 'bg-[#FC3000] text-white'
                                            : 'bg-[#444A58] text-[#B0B5C1]'
                                    }`}
                                >
                                    Все
                                </button>
                                <button
                                    onClick={() => handleFilterChange('status', 'active')}
                                    className={`px-3 py-1 rounded-lg text-sm ${
                                        filters.status === 'active'
                                            ? 'bg-[#FC3000] text-white'
                                            : 'bg-[#444A58] text-[#B0B5C1]'
                                    }`}
                                >
                                    Активные
                                </button>
                                <button
                                    onClick={() => handleFilterChange('status', 'registration')}
                                    className={`px-3 py-1 rounded-lg text-sm ${
                                        filters.status === 'registration'
                                            ? 'bg-[#FC3000] text-white'
                                            : 'bg-[#444A58] text-[#B0B5C1]'
                                    }`}
                                >
                                    Регистрация
                                </button>
                                <button
                                    onClick={() => handleFilterChange('status', 'completed')}
                                    className={`px-3 py-1 rounded-lg text-sm ${
                                        filters.status === 'completed'
                                            ? 'bg-[#FC3000] text-white'
                                            : 'bg-[#444A58] text-[#B0B5C1]'
                                    }`}
                                >
                                    Завершенные
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Карточки мероприятий */}
            <div className='w-4/5 mx-auto mt-60'>
                {isLoading ? (
                    <div className="text-white text-center py-10">
                        <svg className="animate-spin h-10 w-10 text-[#FC3000] mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <p>Загрузка мероприятий...</p>
                    </div>
                ) : error ? (
                    <div className="text-red-500 text-center py-10">
                        <p className="mb-4">{error}</p>
                        <CustomButton
                            placeholder="Попробовать снова"
                            handleClick={fetchEvents}
                        />
                    </div>
                ) : filteredEvents.length === 0 ? (
                    <div className="text-white text-center py-10">
                        <p className="mb-4">Мероприятия не найдены</p>
                        {filters.search || filters.status !== 'all' ? (
                            <CustomButton
                                placeholder="Сбросить фильтры"
                                handleClick={() => setFilters({ status: 'all', type: 'all', search: '' })}
                            />
                        ) : (
                            <p>Скоро здесь появятся новые мероприятия!</p>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredEvents.map((event, index) => (
                            <motion.div
                                key={event.id}
                                initial={{ opacity: 0, y: 50 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: index * 0.1 }}
                                className="h-full"
                            >
                                <EventCard
                                    id={event.id}
                                    name={event.name}
                                    description={event.description}
                                    date={event.date}
                                    location={event.location}
                                    status={event.status}
                                    difficulty={event.difficulty_level}
                                    isOnline={event.is_online}
                                    participants={event.current_participants}
                                    maxParticipants={event.max_participants}
                                    tags={event.tags}
                                    imageUrl={event.image_url}
                                    isPurple={index % 2 === 1}
                                />
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>

            {/* Модальное окно создания мероприятия */}
            <ModalWindow
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
            >
                <CreateEventForm
                    onSubmit={handleCreateEvent}
                    onCancel={() => setIsCreateModalOpen(false)}
                />
            </ModalWindow>
        </>
    )
}

export default Events