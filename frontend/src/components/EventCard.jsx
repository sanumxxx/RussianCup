import React from 'react'
import { useNavigate } from 'react-router-dom'

const EventCard = ({ 
    id, 
    name, 
    description, 
    date, 
    status = 'active', 
    difficulty = 'medium',
    location,
    isOnline = false,
    participants = 0,
    maxParticipants = 100,
    tags = [],
    imageUrl = 'https://placehold.co/600x400.png',
    isPurple = false 
}) => {
    const navigate = useNavigate()
    
    // Форматирование даты из ISO формата в читаемый вид
    const formatDate = (dateString) => {
        try {
            const date = new Date(dateString)
            return date.toLocaleDateString('ru-RU', { 
                day: '2-digit', 
                month: '2-digit', 
                year: 'numeric' 
            })
        } catch (e) {
            return dateString // Возвращаем как есть, если неверный формат
        }
    }
    
    // Вычисление процента заполнения
    const fillPercentage = Math.min(100, Math.round((participants / maxParticipants) * 100))
    
    // Получение статуса как текст
    const getStatusText = (status) => {
        switch(status) {
            case 'active': return 'Активно'
            case 'registration': return 'Регистрация'
            case 'completed': return 'Завершено'
            case 'cancelled': return 'Отменено'
            default: return status
        }
    }
    
    // Получение цвета в зависимости от сложности
    const getDifficultyColor = (difficulty) => {
        switch(difficulty) {
            case 'beginner': return 'text-green-500'
            case 'medium': return 'text-yellow-500'
            case 'advanced': return 'text-orange-500'
            case 'expert': return 'text-red-500'
            default: return 'text-white'
        }
    }
    
    // Получение текста сложности
    const getDifficultyText = (difficulty) => {
        switch(difficulty) {
            case 'beginner': return 'Начинающий'
            case 'medium': return 'Средний'
            case 'advanced': return 'Продвинутый'
            case 'expert': return 'Эксперт'
            default: return difficulty
        }
    }
    
    // Обработчик клика по карточке
    const handleClick = () => {
        navigate(`/event/${id}`)
    }

    return (
        <div
            className={`flex flex-col border ${
                isPurple ? 'border-[#D559FD]' : 'border-[#FC3000]'
            } bg-[#22222E] w-full h-full hover:shadow-md transition-shadow cursor-pointer`}
            onClick={handleClick}
        >
            <div
                className={`flex justify-between items-center ${
                    isPurple
                        ? 'text-[#D559FD] border-b border-b-[#D559FD]'
                        : 'text-white bg-[#FC3000]'
                } px-3 py-2 font-thin`}
            >
                <p className="truncate">russian_cup_event_{id}_2025</p>
                <svg
                    className="h-5 w-5 rotate-45 flex-shrink-0 ml-2"
                    width='800px'
                    height='800px'
                    viewBox='0 0 16 16'
                    fill='none'
                    xmlns='http://www.w3.org/2000/svg'
                >
                    <path
                        d='M10 1H6V6L1 6V10H6V15H10V10H15V6L10 6V1Z'
                        fill={isPurple ? '#D559FD' : '#FFFFFF'}
                    />
                </svg>
            </div>
            
            <div className='flex flex-col justify-between p-4 h-full'>
                <div>
                    <div className="relative mb-3">
                        <img 
                            className="w-full h-40 object-cover rounded" 
                            src={imageUrl} 
                            alt={name} 
                        />
                        <div className={`absolute top-2 right-2 px-2 py-1 rounded text-xs ${
                            status === 'active' ? 'bg-[#FC3000] text-white' : 
                            status === 'registration' ? 'bg-[#D559FD] text-white' :
                            status === 'completed' ? 'bg-[#333] text-[#B0B5C1]' :
                            'bg-red-700 text-white'
                        }`}>
                            {getStatusText(status)}
                        </div>
                    </div>
                    
                    <h3 className={`text-white text-xl font-bold mb-2`}>{name}</h3>
                    
                    <p className="text-[#B0B5C1] text-sm mb-4 line-clamp-2">{description}</p>
                    
                    <div className="flex items-center mb-2">
                        <svg className="w-4 h-4 text-[#B0B5C1] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                        </svg>
                        <span className="text-[#B0B5C1] text-sm">{formatDate(date)}</span>
                    </div>
                    
                    <div className="flex items-center mb-3">
                        <svg className="w-4 h-4 text-[#B0B5C1] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        </svg>
                        <span className="text-[#B0B5C1] text-sm">{isOnline ? 'Онлайн' : location}</span>
                    </div>
                    
                    <div className="flex flex-wrap gap-1 mb-4">
                        {tags.slice(0, 3).map((tag, index) => (
                            <span 
                                key={index} 
                                className={`text-xs px-2 py-1 rounded ${
                                    isPurple ? 'bg-[#D559FD20] text-[#D559FD]' : 'bg-[#FC300015] text-[#FC3000]'
                                }`}
                            >
                                {tag}
                            </span>
                        ))}
                        {tags.length > 3 && (
                            <span className="text-xs px-2 py-1 rounded bg-[#444A58] text-[#B0B5C1]">
                                +{tags.length - 3}
                            </span>
                        )}
                    </div>
                </div>
                
                <div>
                    <div className="flex justify-between items-center mb-1">
                        <span className="text-[#B0B5C1] text-xs">Участников: {participants}/{maxParticipants}</span>
                        <span className={`text-xs font-medium ${getDifficultyColor(difficulty)}`}>
                            {getDifficultyText(difficulty)}
                        </span>
                    </div>
                    
                    <div className="w-full bg-[#333] rounded-full h-1.5">
                        <div 
                            className={`h-1.5 rounded-full ${
                                isPurple ? 'bg-[#D559FD]' : 'bg-[#FC3000]'
                            }`} 
                            style={{ width: `${fillPercentage}%` }}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default EventCard