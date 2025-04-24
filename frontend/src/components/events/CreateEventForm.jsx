import React, { useState } from 'react'
import Components from '../../components'

const CreateEventForm = ({ onSubmit, onCancel }) => {
    const { CustomButton, InputText } = Components

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        date: '',
        location: '',
        max_participants: 100,
        difficulty_level: 'medium',
        event_type: 'hackathon',
        is_online: false
    })

    const [imageFile, setImageFile] = useState(null)
    const [imagePreview, setImagePreview] = useState(null)

    const [errors, setErrors] = useState({})
    const [step, setStep] = useState(1) // 1 = основная информация, 2 = дополнительная информация

    const difficultyOptions = [
        { value: 'beginner', label: 'Начинающий' },
        { value: 'medium', label: 'Средний' },
        { value: 'advanced', label: 'Продвинутый' },
        { value: 'expert', label: 'Эксперт' }
    ]

    const eventTypeOptions = [
        { value: 'hackathon', label: 'Хакатон' },
        { value: 'competition', label: 'Соревнование' },
        { value: 'workshop', label: 'Воркшоп' },
        { value: 'meetup', label: 'Митап' },
        { value: 'conference', label: 'Конференция' }
    ]

    const handleChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }))

        // Очищаем ошибку поля при изменении
        if (errors[field]) {
            setErrors(prev => ({
                ...prev,
                [field]: undefined
            }))
        }
    }

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Проверяем тип файла
        if (!file.type.startsWith('image/')) {
            setErrors(prev => ({
                ...prev,
                image: 'Пожалуйста, выберите изображение'
            }));
            return;
        }

        // Проверяем размер файла (не более 5 МБ)
        if (file.size > 5 * 1024 * 1024) {
            setErrors(prev => ({
                ...prev,
                image: 'Размер файла должен быть не более 5 МБ'
            }));
            return;
        }

        setImageFile(file);

        // Создаем превью
        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result);
        };
        reader.readAsDataURL(file);

        // Очищаем ошибку
        setErrors(prev => ({
            ...prev,
            image: undefined
        }));
    }

    const validateStep1 = () => {
        const newErrors = {}

        if (!formData.name.trim()) {
            newErrors.name = 'Обязательное поле'
        }

        if (!formData.date) {
            newErrors.date = 'Обязательное поле'
        } else {
            const selectedDate = new Date(formData.date)
            const today = new Date()

            if (selectedDate < today) {
                newErrors.date = 'Дата не может быть в прошлом'
            }
        }

        if (!formData.location.trim() && !formData.is_online) {
            newErrors.location = 'Обязательно для оффлайн-мероприятия'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const validateStep2 = () => {
        const newErrors = {}

        if (formData.max_participants <= 0) {
            newErrors.max_participants = 'Должно быть больше нуля'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleNextStep = () => {
        if (validateStep1()) {
            setStep(2)
        }
    }

    const handlePrevStep = () => {
        setStep(1)
    }

    const handleSubmit = () => {
        if (validateStep2()) {
            // Формируем данные для отправки
            const eventData = {
                ...formData,
                image: imageFile,  // Включаем файл изображения
                displayDate: new Date(formData.date).toLocaleDateString('ru-RU')
            };

            onSubmit(eventData);
        }
    }

    return (
        <div className="w-full text-white">
            <h2 className="text-xl font-bold mb-4 text-[#FC3000]">
                {step === 1 ? 'Основная информация' : 'Дополнительные параметры'}
            </h2>

            {step === 1 ? (
                <div className="space-y-3">
                    <div>
                        <label className="block text-sm font-medium mb-1">Название мероприятия*</label>
                        <InputText
                            placeholder="Введите название"
                            value={formData.name}
                            onChange={(e) => handleChange('name', e.target.value)}
                        />
                        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Описание</label>
                        <textarea
                            placeholder="Краткое описание мероприятия"
                            value={formData.description}
                            onChange={(e) => handleChange('description', e.target.value)}
                            className="w-full px-3 py-2 rounded-lg bg-[#444A58] text-[#B0B5C1] border border-[#555C69] placeholder-[#B0B5C1]"
                            rows="2"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Дата проведения*</label>
                        <InputText
                            type="date"
                            value={formData.date}
                            onChange={(e) => handleChange('date', e.target.value)}
                        />
                        {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date}</p>}
                    </div>

                    <div className="flex items-center mb-2">
                        <input
                            type="checkbox"
                            id="is_online"
                            checked={formData.is_online}
                            onChange={(e) => handleChange('is_online', e.target.checked)}
                            className="mr-2 h-4 w-4 text-[#FC3000]"
                        />
                        <label htmlFor="is_online" className="text-sm">Онлайн мероприятие</label>
                    </div>

                    {!formData.is_online && (
                        <div>
                            <label className="block text-sm font-medium mb-1">Место проведения*</label>
                            <InputText
                                placeholder="Адрес проведения"
                                value={formData.location}
                                onChange={(e) => handleChange('location', e.target.value)}
                            />
                            {errors.location && <p className="text-red-500 text-xs mt-1">{errors.location}</p>}
                        </div>
                    )}

                    {/* Добавляем поле для загрузки изображения */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Изображение мероприятия</label>
                        <div className="flex flex-col space-y-2">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="hidden"
                                id="event-image"
                            />
                            <label
                                htmlFor="event-image"
                                className="px-3 py-2 bg-[#444A58] text-[#B0B5C1] rounded-lg cursor-pointer hover:bg-[#555C69] text-center"
                            >
                                Выбрать изображение
                            </label>
                            {errors.image && <p className="text-red-500 text-xs">{errors.image}</p>}

                            {/* Показываем превью выбранного изображения */}
                            {imagePreview && (
                                <div className="mt-2">
                                    <p className="text-sm mb-1">Превью:</p>
                                    <div className="relative w-full h-40 bg-[#333] rounded-lg overflow-hidden">
                                        <img
                                            src={imagePreview}
                                            alt="Превью"
                                            className="w-full h-full object-cover"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setImageFile(null);
                                                setImagePreview(null);
                                            }}
                                            className="absolute top-2 right-2 bg-[#00000080] text-white rounded-full w-6 h-6 flex items-center justify-center"
                                        >
                                            ×
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex justify-end space-x-3 mt-4">
                        <button
                            type="button"
                            onClick={onCancel}
                            className="px-3 py-1.5 rounded-lg bg-[#444A58] text-[#B0B5C1] hover:bg-[#555C69] text-sm"
                        >
                            Отмена
                        </button>
                        <button
                            type="button"
                            onClick={handleNextStep}
                            className="px-3 py-1.5 rounded-lg bg-[#FC3000] text-white hover:bg-[#e02b00] text-sm"
                        >
                            Далее
                        </button>
                    </div>
                </div>
            ) : (
                <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-sm font-medium mb-1">Макс. участников</label>
                            <InputText
                                type="number"
                                min="1"
                                placeholder="100"
                                value={formData.max_participants}
                                onChange={(e) => handleChange('max_participants', parseInt(e.target.value) || 1)}
                            />
                            {errors.max_participants && <p className="text-red-500 text-xs mt-1">{errors.max_participants}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Сложность</label>
                            <select
                                value={formData.difficulty_level}
                                onChange={(e) => handleChange('difficulty_level', e.target.value)}
                                className="w-full px-3 py-2 rounded-lg bg-[#444A58] text-[#B0B5C1] border border-[#555C69]"
                            >
                                {difficultyOptions.map(option => (
                                    <option key={option.value} value={option.value}>{option.label}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Тип мероприятия</label>
                        <select
                            value={formData.event_type}
                            onChange={(e) => handleChange('event_type', e.target.value)}
                            className="w-full px-3 py-2 rounded-lg bg-[#444A58] text-[#B0B5C1] border border-[#555C69]"
                        >
                            {eventTypeOptions.map(option => (
                                <option key={option.value} value={option.value}>{option.label}</option>
                            ))}
                        </select>
                    </div>

                    <div className="flex justify-end space-x-3 mt-4">
                        <button
                            type="button"
                            onClick={handlePrevStep}
                            className="px-3 py-1.5 rounded-lg bg-[#444A58] text-[#B0B5C1] hover:bg-[#555C69] text-sm"
                        >
                            Назад
                        </button>
                        <button
                            type="button"
                            onClick={onCancel}
                            className="px-3 py-1.5 rounded-lg bg-[#555C69] text-[#B0B5C1] hover:bg-[#666D7A] text-sm"
                        >
                            Отмена
                        </button>
                        <button
                            type="button"
                            onClick={handleSubmit}
                            className="px-3 py-1.5 rounded-lg bg-[#FC3000] text-white hover:bg-[#e02b00] text-sm"
                        >
                            Создать
                        </button>
                    </div>
                </div>
            )}

            {/* Индикатор шагов */}
            <div className="flex justify-center mt-4">
                <span className={`h-2 w-2 rounded-full mx-1 ${step === 1 ? 'bg-[#FC3000]' : 'bg-[#555C69]'}`}></span>
                <span className={`h-2 w-2 rounded-full mx-1 ${step === 2 ? 'bg-[#FC3000]' : 'bg-[#555C69]'}`}></span>
            </div>
        </div>
    )
}

export default CreateEventForm