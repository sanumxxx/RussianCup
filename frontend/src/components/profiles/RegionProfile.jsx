import React, { useState } from 'react'
import { useProfile } from '../../context/ProfileContext'
import Components from '../../components'

const RegionProfile = () => {
    const { profile, updateProfile } = useProfile()
    const { CustomButton, InputText } = Components

    const [isEditing, setIsEditing] = useState(false)
    const [formData, setFormData] = useState({
        region_name: profile?.profile_data?.region_name || '',
        region_code: profile?.profile_data?.region_code || '',
        population: profile?.profile_data?.population || 0,
        contact_phone: profile?.profile_data?.contact_phone || '',
        contact_email: profile?.profile_data?.contact_email || ''
    })

    const handleChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: field === 'population' ? parseInt(value) || 0 : value
        }))
    }

    const handleSubmit = async () => {
        try {
            await updateProfile('region', formData)
            setIsEditing(false)
        } catch (error) {
            console.error('Failed to update profile:', error)
        }
    }

    if (!profile || !profile.profile_data) {
        return <div className="text-white text-center">Информация профиля недоступна</div>
    }

    const { team_members, region_events_count } = profile.profile_data

    return (
        <div className="text-white">
            <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="p-4 bg-[#333] rounded-lg text-center">
                    <p className="text-sm text-[#B0B5C1]">Участников из региона</p>
                    <p className="text-2xl font-bold text-[#FC3000]">{team_members || 0}</p>
                </div>
                <div className="p-4 bg-[#333] rounded-lg text-center">
                    <p className="text-sm text-[#B0B5C1]">Проведено мероприятий</p>
                    <p className="text-2xl font-bold text-[#FC3000]">{region_events_count || 0}</p>
                </div>
                <div className="p-4 bg-[#333] rounded-lg text-center">
                    <p className="text-sm text-[#B0B5C1]">Средний рейтинг</p>
                    <p className="text-2xl font-bold text-[#D559FD]">184</p>
                </div>
            </div>

            {!isEditing ? (
                <div className="mb-6">
                    <div className="mb-4">
                        <h3 className="text-lg font-semibold mb-2">Название региона</h3>
                        <p className="text-[#B0B5C1]">{formData.region_name || 'Не указано'}</p>
                    </div>
                    <div className="mb-4">
                        <h3 className="text-lg font-semibold mb-2">Код региона</h3>
                        <p className="text-[#B0B5C1]">{formData.region_code || 'Не указан'}</p>
                    </div>
                    <div className="mb-4">
                        <h3 className="text-lg font-semibold mb-2">Население</h3>
                        <p className="text-[#B0B5C1]">{formData.population?.toLocaleString() || 0} чел.</p>
                    </div>
                    <div className="mb-4">
                        <h3 className="text-lg font-semibold mb-2">Контактная информация</h3>
                        <p className="text-[#B0B5C1]">Телефон: {formData.contact_phone || 'Не указан'}</p>
                        <p className="text-[#B0B5C1]">Email: {formData.contact_email || 'Не указан'}</p>
                    </div>
                    <CustomButton
                        placeholder="Редактировать профиль"
                        handleClick={() => setIsEditing(true)}
                    />
                </div>
            ) : (
                <div className="mb-6">
                    <div className="mb-4">
                        <h3 className="text-lg font-semibold mb-2">Название региона</h3>
                        <InputText
                            placeholder="Название региона"
                            type="text"
                            value={formData.region_name || ''}
                            onChange={(e) => handleChange('region_name', e.target.value)}
                        />
                    </div>
                    <div className="mb-4">
                        <h3 className="text-lg font-semibold mb-2">Код региона</h3>
                        <InputText
                            placeholder="Код региона"
                            type="text"
                            value={formData.region_code || ''}
                            onChange={(e) => handleChange('region_code', e.target.value)}
                        />
                    </div>
                    <div className="mb-4">
                        <h3 className="text-lg font-semibold mb-2">Население</h3>
                        <InputText
                            placeholder="Количество жителей"
                            type="number"
                            value={formData.population || 0}
                            onChange={(e) => handleChange('population', e.target.value)}
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
                    </div>
                    <div className="flex space-x-4">
                        <CustomButton
                            placeholder="Сохранить"
                            handleClick={handleSubmit}
                        />
                        <button
                            onClick={() => setIsEditing(false)}
                            className="px-3 py-2 rounded-lg bg-[#444A58] text-[#B0B5C1]"
                        >
                            Отмена
                        </button>
                    </div>
                </div>
            )}

            <div className="mt-8">
                <h3 className="text-lg font-semibold mb-4">Топ участников из региона</h3>
                <div className="grid grid-cols-1 gap-3">
                    <div className="p-3 border border-[#444A58] rounded-lg flex justify-between items-center">
                        <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#FC3000] to-[#D559FD] flex items-center justify-center text-xs mr-3">
                                ИС
                            </div>
                            <div>
                                <p className="font-semibold">Игорь Смирнов</p>
                                <p className="text-xs text-[#B0B5C1]">Участник с 10.01.2025</p>
                            </div>
                        </div>
                        <p className="text-[#FC3000] font-bold">245 pts</p>
                    </div>
                    <div className="p-3 border border-[#444A58] rounded-lg flex justify-between items-center">
                        <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#FC3000] to-[#D559FD] flex items-center justify-center text-xs mr-3">
                                ЕК
                            </div>
                            <div>
                                <p className="font-semibold">Елена Козлова</p>
                                <p className="text-xs text-[#B0B5C1]">Участник с 15.01.2025</p>
                            </div>
                        </div>
                        <p className="text-[#FC3000] font-bold">198 pts</p>
                    </div>
                </div>
                <div className="mt-4">
                    <CustomButton
                        placeholder="Показать всех участников региона"
                        handleClick={() => {}}
                    />
                </div>
            </div>

            <div className="mt-8">
                <h3 className="text-lg font-semibold mb-4">Мероприятия региона</h3>
                <div className="grid grid-cols-1 gap-3">
                    <div className="p-3 border border-[#444A58] rounded-lg">
                        <div className="flex justify-between items-center">
                            <p className="font-semibold">Региональный хакатон 2025</p>
                            <p className="text-sm text-[#B0B5C1]">15.05.2025</p>
                        </div>
                        <div className="flex justify-between items-center mt-2">
                            <p className="text-sm text-[#B0B5C1]">Участников: 28</p>
                            <div className="px-2 py-1 bg-[#2A2A36] rounded text-xs text-[#FC3000]">
                                Регистрация
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RegionProfile