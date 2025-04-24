import React, { useState, useEffect } from 'react'
import { useProfile } from '../../context/ProfileContext'
import Components from '../../components'
import ModalWindow from '../ModalWindow'
import CreateEventForm from '../events/CreateEventForm'
import EventsService from '../../services/EventsService'

const SponsorProfile = () => {
    const { profile, updateProfile, isLoading } = useProfile()
    const { CustomButton, InputText } = Components

    const [isEditing, setIsEditing] = useState(false)
    const [formData, setFormData] = useState({
        organization_name: profile?.profile_data?.organization_name || '',
        organization_description: profile?.profile_data?.organization_description || '',
        contact_phone: profile?.profile_data?.contact_phone || '',
        contact_email: profile?.profile_data?.contact_email || '',
        website: profile?.profile_data?.website || ''
    })
    const [updateError, setUpdateError] = useState('')
    const [updateSuccess, setUpdateSuccess] = useState(false)
    const [showCreateEventModal, setShowCreateEventModal] = useState(false)
    
    // Состояние для мероприятий
    const [events, setEvents] = useState([])
    const [loadingEvents, setLoadingEvents] = useState(true)
    const [eventsError, setEventsError] = useState(null)

    // Загрузка мероприятий организатора
    useEffect(() => {
        const fetchOrganizerEvents = async () => {
            if (!profile) return;
            
            setLoadingEvents(true);
            setEventsError(null);
            
            try {
                const data = await EventsService.getEvents({ organizer_id: profile.user_id });
                console.log('Organizer events:', data);
                setEvents(data);
            } catch (error) {
                console.error('Failed to fetch organizer events:', error);
                setEventsError('Не удалось загрузить мероприятия. Пожалуйста, попробуйте позже.');
            } finally {
                setLoadingEvents(false);
            }
        };
        
        fetchOrganizerEvents();
    }, [profile]);

    const handleChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }))
        setUpdateError('')
        setUpdateSuccess(false)
    }

    const handleSubmit = async () => {
        try {
            setUpdateError('')
            await updateProfile('sponsor', formData)
            setUpdateSuccess(true)
            setTimeout(() => setUpdateSuccess(false), 3000)
            setIsEditing(false)
        } catch (error) {
            console.error('Failed to update profile:', error)
            setUpdateError('Не удалось обновить профиль. Пожалуйста, попробуйте снова.')
        }
    }
    
    const handleCreateEvent = async (eventData) => {
        try {
            setLoadingEvents(true);
            // Вызов API для создания мероприятия
            const newEvent = await EventsService.createEvent(eventData);
            console.log('Event created:', newEvent);
            
            // Обновляем список мероприятий
            const updatedEvents = await EventsService.getEvents({ organizer_id: profile.user_id });
            setEvents(updatedEvents);
            
            // Закрываем модальное окно
            setShowCreateEventModal(false);
            
            // Показываем уведомление об успехе
            setUpdateSuccess(true);
            setTimeout(() => setUpdateSuccess(false), 3000);
        } catch (error) {
            console.error('Failed to create event:', error);
            setEventsError('Не удалось создать мероприятие. Пожалуйста, попробуйте снова.');
        } finally {
            setLoadingEvents(false);
        }
    }

    // Reset form data when profile changes
    React.useEffect(() => {
        if (profile && profile.profile_data) {
            setFormData({
                organization_name: profile.profile_data.organization_name || '',
                organization_description: profile.profile_data.organization_description || '',
                contact_phone: profile.profile_data.contact_phone || '',
                contact_email: profile.profile_data.contact_email || '',
                website: profile.profile_data.website || ''
            })
        }
    }, [profile])

    if (!profile || !profile.profile_data) {
        return (
            <div className="text-white text-center p-6 bg-[#33333E] rounded-lg">
                <p>Информация профиля загружается или недоступна</p>
            </div>
        )
    }

    const { hosted_events_count } = profile.profile_data

    return (
        <div className="text-white">
            {updateSuccess && (
                <div className="mb-4 p-3 bg-green-600 text-white rounded">
                    Профиль успешно обновлен!
                </div>
            )}
            
            {updateError && (
                <div className="mb-4 p-3 bg-red-600 text-white rounded">
                    {updateError}
                </div>
            )}
            
            <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="p-4 bg-[#333] rounded-lg text-center">
                    <p className="text-sm text-[#B0B5C1]">Организовано мероприятий</p>
                    <p className="text-2xl font-bold text-[#FC3000]">{hosted_events_count || events.length}</p>
                </div>
                <div className="p-4 bg-[#333] rounded-lg text-center">
                    <p className="text-sm text-[#B0B5C1]">Участников привлечено</p>
                    <p className="text-2xl font-bold text-[#FC3000]">
                        {events.reduce((sum, event) => sum + (event.current_participants || event.participants || 0), 0)}
                    </p>
                </div>
                <div className="p-4 bg-[#333] rounded-lg text-center">
                    <p className="text-sm text-[#B0B5C1]">Рейтинг организатора</p>
                    <p className="text-2xl font-bold text-[#D559FD]">4.8/5</p>
                </div>
            </div>

            {!isEditing ? (
                <div className="mb-6">
                    <div className="mb-4">
                        <h3 className="text-lg font-semibold mb-2">Название организации</h3>
                        <p className="text-[#B0B5C1] p-3 bg-[#33333E] rounded-lg">
                            {formData.organization_name || 'Не указано'}
                        </p>
                    </div>
                    <div className="mb-4">
                        <h3 className="text-lg font-semibold mb-2">Описание организации</h3>
                        <p className="text-[#B0B5C1] p-3 bg-[#33333E] rounded-lg min-h-[100px]">
                            {formData.organization_description || 'Нет информации'}
                        </p>
                    </div>
                    <div className="mb-4">
                        <h3 className="text-lg font-semibold mb-2">Контактная информация</h3>
                        <div className="grid grid-cols-3 gap-4">
                            <div className="p-3 bg-[#33333E] rounded-lg">
                                <p className="text-sm text-[#B0B5C1]">Телефон</p>
                                <p className="text-[#B0B5C1]">{formData.contact_phone || 'Не указан'}</p>
                            </div>
                            <div className="p-3 bg-[#33333E] rounded-lg">
                                <p className="text-sm text-[#B0B5C1]">Email</p>
                                <p className="text-[#B0B5C1]">{formData.contact_email || 'Не указан'}</p>
                            </div>
                            <div className="p-3 bg-[#33333E] rounded-lg">
                                <p className="text-sm text-[#B0B5C1]">Сайт</p>
                                <p className="text-[#B0B5C1]">{formData.website || 'Не указан'}</p>
                            </div>
                        </div>
                    </div>
                    <CustomButton
                        placeholder="Редактировать профиль"
                        handleClick={() => setIsEditing(true)}
                    />
                </div>
            ) : (
                <div className="mb-6">
                    <div className="mb-4">
                        <h3 className="text-lg font-semibold mb-2">Название организации</h3>
                        <InputText
                            placeholder="Название вашей организации"
                            type="text"
                            value={formData.organization_name || ''}
                            onChange={(e) => handleChange('organization_name', e.target.value)}
                        />
                    </div>
                    <div className="mb-4">
                        <h3 className="text-lg font-semibold mb-2">Описание организации</h3>
                        <textarea
                            value={formData.organization_description || ''}
                            onChange={(e) => handleChange('organization_description', e.target.value)}
                            className="w-full px-3 py-2 rounded-lg bg-[#444A58] text-[#B0B5C1] border border-[#555C69] placeholder-[#B0B5C1]"
                            rows="4"
                            placeholder="Расскажите о вашей организации"
                        />
                    </div>
                    <div className="grid grid-cols-1 gap-4 mb-4">
                        <div>
                            <h3 className="text-lg font-semibold mb-2">Телефон</h3>
                            <InputText
                                placeholder="Контактный телефон"
                                type="tel"
                                value={formData.contact_phone || ''}
                                onChange={(e) => handleChange('contact_phone', e.target.value)}
                            />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold mb-2">Email</h3>
                            <InputText
                                placeholder="Контактный email"
                                type="email"
                                value={formData.contact_email || ''}
                                onChange={(e) => handleChange('contact_email', e.target.value)}
                            />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold mb-2">Сайт</h3>
                            <InputText
                                placeholder="Сайт организации"
                                type="url"
                                value={formData.website || ''}
                                onChange={(e) => handleChange('website', e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="flex space-x-4">
                        <CustomButton
                            placeholder={isLoading ? "Сохранение..." : "Сохранить"}
                            handleClick={handleSubmit}
                            disabled={isLoading}
                        />
                        <button
                            onClick={() => {
                                setIsEditing(false)
                                setUpdateError('')
                                // Reset form data to current profile
                                if (profile && profile.profile_data) {
                                    setFormData({
                                        organization_name: profile.profile_data.organization_name || '',
                                        organization_description: profile.profile_data.organization_description || '',
                                        contact_phone: profile.profile_data.contact_phone || '',
                                        contact_email: profile.profile_data.contact_email || '',
                                        website: profile.profile_data.website || ''
                                    })
                                }
                            }}
                            className="px-3 py-2 rounded-lg bg-[#444A58] text-[#B0B5C1] hover:bg-[#555C69]"
                        >
                            Отмена
                        </button>
                    </div>
                </div>
            )}

            <div className="mt-8">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">Организованные мероприятия</h3>
                    <CustomButton
                        placeholder="Организовать новое мероприятие"
                        handleClick={() => setShowCreateEventModal(true)}
                    />
                </div>
                
                <div className="grid grid-cols-1 gap-3">
                    {loadingEvents ? (
                        <div className="p-8 border border-[#444A58] rounded-lg text-center">
                            <svg className="animate-spin h-10 w-10 text-[#FC3000] mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <p className="text-[#B0B5C1]">Загрузка мероприятий...</p>
                        </div>
                    ) : eventsError ? (
                        <div className="p-8 border border-[#444A58] rounded-lg text-center">
                            <p className="text-red-500 mb-3">{eventsError}</p>
                            <CustomButton
                                placeholder="Попробовать снова"
                                handleClick={() => {
                                    setLoadingEvents(true);
                                    EventsService.getEvents({ organizer_id: profile.user_id })
                                        .then(data => setEvents(data))
                                        .catch(() => setEventsError('Не удалось загрузить мероприятия'))
                                        .finally(() => setLoadingEvents(false));
                                }}
                            />
                        </div>
                    ) : events.length === 0 ? (
                        <div className="p-8 border border-[#444A58] rounded-lg text-center">
                            <p className="text-[#B0B5C1] mb-3">У вас пока нет мероприятий</p>
                            <CustomButton
                                placeholder="Создать первое мероприятие"
                                handleClick={() => setShowCreateEventModal(true)}
                            />
                        </div>
                    ) : (
                        events.map(event => (
                            <div key={event.id} className="p-3 border border-[#444A58] rounded-lg hover:border-[#FC3000] transition-colors cursor-pointer">
                                <div className="flex justify-between items-center">
                                    <p className="font-semibold">{event.name}</p>
                                    <p className="text-sm text-[#B0B5C1]">
                                        {typeof event.date === 'string' && event.date.includes('-') 
                                            ? new Date(event.date).toLocaleDateString('ru-RU') 
                                            : event.date}
                                    </p>
                                </div>
                                <div className="flex justify-between items-center mt-2">
                                    <p className="text-sm text-[#B0B5C1]">
                                        Участников: {event.current_participants || event.participants || 0}
                                    </p>
                                    <div className={`px-2 py-1 rounded text-xs ${
                                        event.status === 'active' ? 'bg-[#2A2A36] text-[#FC3000]' : 
                                        event.status === 'registration' ? 'bg-[#2A2A36] text-[#D559FD]' :
                                        'bg-[#2A2A36] text-[#B0B5C1]'
                                    }`}>
                                        {event.status === 'active' ? 'Активно' : 
                                         event.status === 'registration' ? 'Регистрация' : 
                                         'Завершено'}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Модальное окно создания мероприятия */}
            <ModalWindow 
                isOpen={showCreateEventModal} 
                onClose={() => setShowCreateEventModal(false)} 
                title="Создание мероприятия"
                maxWidth="lg"
            >
                <CreateEventForm 
                    onSubmit={handleCreateEvent} 
                    onCancel={() => setShowCreateEventModal(false)} 
                />
            </ModalWindow>
        </div>
    )
}

export default SponsorProfile