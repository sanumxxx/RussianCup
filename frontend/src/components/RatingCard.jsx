import React from 'react'

const RatingCard = ({ place, username, score, trend = 0, isCurrentUser = false }) => {
    return (
        <div className={`grid grid-cols-12 items-center h-16 p-4 border-t border-[#444A58] text-white transition-all ${isCurrentUser ? 'bg-[#FC300015]' : 'hover:bg-[#D559FD10]'}`}>
            {/* Позиция */}
            <div className='col-span-1 text-center'>
                {place <= 3 ? (
                    <span className={`text-2xl ${
                        place === 1 ? 'text-[#FFD700]' :
                        place === 2 ? 'text-[#C0C0C0]' : 'text-[#CD7F32]'
                    }`}>
                        {place === 1 ? '🏆' : place === 2 ? '🥈' : '🥉'}
                    </span>
                ) : (
                    <span className='text-[#B0B5C1]'>{place}</span>
                )}
            </div>

            {/* Изменение рейтинга */}
            <div className='col-span-1 text-center'>
                {trend > 0 ? (
                    <span className='text-green-500'>▲{trend}</span>
                ) : trend < 0 ? (
                    <span className='text-red-500'>▼{Math.abs(trend)}</span>
                ) : (
                    <span className='text-gray-500'>—</span>
                )}
            </div>

            {/* Аватар */}
            <div className='col-span-1'>
                <div className='w-8 h-8 rounded-full bg-gradient-to-r from-[#FC3000] to-[#D559FD] flex items-center justify-center text-xs'>
                    {username.split(' ').map(part => part[0]).join('')}
                </div>
            </div>

            {/* Имя пользователя */}
            <div className='col-span-4 flex items-center'>
                <span className={`${isCurrentUser ? 'font-bold text-[#FC3000]' : ''}`}>{username}</span>
                {isCurrentUser && <span className='ml-2 text-xs bg-[#FC3000] px-1 rounded'>ВЫ</span>}
                {place === 1 && <span className='ml-2 text-xs bg-[#FFD700] text-black px-1 rounded'>ЛИДЕР</span>}
            </div>

            {/* Активность */}
            <div className='col-span-2'>
                <div className='w-full bg-[#333] rounded-full h-1.5'>
                    <div className='bg-gradient-to-r from-[#FC3000] to-[#D559FD] h-1.5 rounded-full' style={{ width: `${Math.min(100, score/3)}%` }}></div>
                </div>
            </div>

            {/* Очки */}
            <div className='col-span-3 text-right font-bold text-[#FC3000]'>
                {score} <span className='text-sm text-[#B0B5C1]'>pts</span>
            </div>
        </div>
    )
}

export default RatingCard