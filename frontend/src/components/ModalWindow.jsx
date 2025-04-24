import React from 'react'

const ModalWindow = ({ isOpen, onClose, children, title = 'Окно', maxWidth = 'md' }) => {
    if (!isOpen) return null

    // Определение максимальной ширины модального окна
    const getMaxWidthClass = () => {
        switch (maxWidth) {
            case 'sm': return 'max-w-sm'
            case 'md': return 'max-w-md'
            case 'lg': return 'max-w-lg'
            case 'xl': return 'max-w-xl'
            case '2xl': return 'max-w-2xl'
            default: return 'max-w-md'
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#00000080] backdrop-blur-sm" onClick={onClose}>
            <div
                className={`flex flex-col w-[95%] ${getMaxWidthClass()} mx-auto overflow-hidden`}
                onClick={e => e.stopPropagation()} // Предотвращаем закрытие при клике на само окно
            >
                <div className="flex justify-between items-center bg-[#FC3000] w-full text-white px-3 py-2 font-thin">
                    <p>{title || 'russian_cup_modal_2025'}</p>
                    <img
                        src='/assets/icons/plus.svg'
                        alt='Закрыть'
                        className='rotate-45 h-5 cursor-pointer'
                        onClick={onClose}
                    />
                </div>
                <div className="flex flex-col p-4 border border-[#FC3000] bg-[#22222E] text-white max-h-[80vh] overflow-y-auto">
                    {children}
                </div>
            </div>
        </div>
    )
}

export default ModalWindow