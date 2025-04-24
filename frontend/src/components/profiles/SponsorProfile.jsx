import React, { useState } from 'react'
import { useProfile } from '../../context/ProfileContext'
import Components from '../../components'

const SponsorProfile = () => {
    const { profile, updateProfile } = useProfile()
    const { CustomButton, InputText } = Components

    const [isEditing, setIsEditing] = useState(false)
    const [formData, setFormData] = useState({
        organization_name: profile?.profile_data?.organization_name || '',
        organization_description: profile?.profile_data?.organization_description || '',
        contact_phone: profile?.profile_data?.contact_phone || '',
        contact_email: profile?.profile_data?.contact_email || '',
        website: profile?.profile_data?.website || ''
    })

    const handleChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }))
    }

    const handleSubmit = async () => {
        try {
            await updateProfile('sponsor', formData)
            setIsEditing(false)
        } catch (error) {
            console.error('Failed to update profile:', error)
        }
    }

    if (!profile || !profile.profile_data) {
        return <div className="text-white text-center">Информация профиля недоступна</div>
    }

    const { hosted_events_count } = profile.profile_data

    return (
        <div className="text-white">
            <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="p-4 bg-[#333] rounded-lg text-center">
                    <p className="text-sm text-[#B0B5C1]">Организовано мероприятий</p>
                    <p className="text-2xl font-bold text-[#FC3000]">{hosted_events_count || 0}</p>
                </div>
                <div className="p-4 bg-[#333] rounded-lg text-center">
                    <p className="text-sm text-[#B0B5C1]">Участников привлечено</p>
                    <p className="text-2xl font-bold text-[#FC3000]">247</p>
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
                        <p className="text-[#B0B5C1]">{formData.organization_name || 'Не указано'}</p>
                    </div>
                    <div className="mb-4">
                        <h3 className="text-lg font-semibold mb-2">Описание организации</h3>
                        <p className="text-[#B0B5C1]">{formData.organization_description || 'Нет информации'}</p>
                    </div>
                    <div className="mb-4">
                        <h3 className="text-lg font-semibold mb-2">Контактная информация</h3>
                        <p className="text-[#B0B5C1]">Телефон: {formData.contact_phone || 'Не указан'}</p>
                        <p className="text-[#B0B5C1]">Email: {formData.contact_email || 'Не указан'}</p>
                        <p className="text-[#B0B5C1]">Сайт: {formData.website || 'Не указан'}</p>
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
                            className="w-full px-2 py-2 rounded-lg bg-[#444A58] text-[#B0B5C1] border-1 border-[#555C69] placeholder-[#B0B5C1]"
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
                <h3 className="text-lg font-semibold mb-4">Организованные мероприятия</h3>
                <div className="grid grid-cols-1 gap-3">
                    <div className="p-3 border border-[#444A58] rounded-lg">
                        <div className="flex justify-between items-center">
                            <p className="font-semibold">Российский Кубок 2025</p>
                            <p className="text-sm text-[#B0B5C1]">25.04.2025</p>
                        </div>
                        <div className="flex justify-between items-center mt-2">
                            <p className="text-sm text-[#B0B5C1]">Участников: 54</p>
                            <div className="px-2 py-1 bg-[#2A2A36] rounded text-xs text-[#FC3000]">
                                Активно
                            </div>
                        </div>
                    </div>
                    <div className="p-3 border border-[#444A58] rounded-lg">
                        <div className="flex justify-between items-center">
                            <p className="font-semibold">Хакатон по блокчейну</p>
                            <p className="text-sm text-[#B0B5C1]">10.03.2025</p>
                        </div>
                        <div className="flex justify-between items-center mt-2">
                            <p className="text-sm text-[#B0B5C1]">Участников: 32</p>
                            <div className="px-2 py-1 bg-[#2A2A36] rounded text-xs text-[#B0B5C1]">
                                Завершено
                            </div>
                        </div>
                    </div>
                </div>
                <div className="mt-4">
                    <CustomButton
                        placeholder="Организовать новое мероприятие"
                        handleClick={() => {}}
                    />
                </div>
            </div>
        </div>
    )
}

export default SponsorProfile