import React, { useState } from 'react'
import { useProfile } from '../../context/ProfileContext'
import Components from '../../components'

const SportsmanProfile = () => {
    const { profile, updateProfile, isLoading } = useProfile()
    const { CustomButton, InputText } = Components

    const [isEditing, setIsEditing] = useState(false)
    const [formData, setFormData] = useState({
        bio: profile?.profile_data?.bio || '',
        specialization: profile?.profile_data?.specialization || '',
        experience_years: profile?.profile_data?.experience_years || 0
    })
    const [updateError, setUpdateError] = useState('')
    const [updateSuccess, setUpdateSuccess] = useState(false)

    const handleChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: field === 'experience_years' ? parseInt(value) || 0 : value
        }))
        setUpdateError('')
        setUpdateSuccess(false)
    }

    const handleSubmit = async () => {
        try {
            setUpdateError('')
            await updateProfile('sportsman', formData)
            setUpdateSuccess(true)
            setTimeout(() => setUpdateSuccess(false), 3000)
            setIsEditing(false)
        } catch (error) {
            console.error('Failed to update profile:', error)
            setUpdateError('Не удалось обновить профиль. Пожалуйста, попробуйте снова.')
        }
    }

    // Reset form data when profile changes
    React.useEffect(() => {
        if (profile && profile.profile_data) {
            setFormData({
                bio: profile.profile_data.bio || '',
                specialization: profile.profile_data.specialization || '',
                experience_years: profile.profile_data.experience_years || 0
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

    const { rating, completed_events, wins } = profile.profile_data

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
                    <p className="text-sm text-[#B0B5C1]">Рейтинг</p>
                    <p className="text-2xl font-bold text-[#FC3000]">{rating || 0}</p>
                </div>
                <div className="p-4 bg-[#333] rounded-lg text-center">
                    <p className="text-sm text-[#B0B5C1]">Мероприятий</p>
                    <p className="text-2xl font-bold text-[#FC3000]">{completed_events || 0}</p>
                </div>
                <div className="p-4 bg-[#333] rounded-lg text-center">
                    <p className="text-sm text-[#B0B5C1]">Побед</p>
                    <p className="text-2xl font-bold text-[#FC3000]">{wins || 0}</p>
                </div>
            </div>

            {!isEditing ? (
                <div className="mb-6">
                    <div className="mb-4">
                        <h3 className="text-lg font-semibold mb-2">О себе</h3>
                        <p className="text-[#B0B5C1] p-3 bg-[#33333E] rounded-lg min-h-[100px]">
                            {formData.bio || 'Нет информации'}
                        </p>
                    </div>
                    <div className="mb-4">
                        <h3 className="text-lg font-semibold mb-2">Специализация</h3>
                        <p className="text-[#B0B5C1] p-3 bg-[#33333E] rounded-lg">
                            {formData.specialization || 'Не указана'}
                        </p>
                    </div>
                    <div className="mb-4">
                        <h3 className="text-lg font-semibold mb-2">Опыт (лет)</h3>
                        <p className="text-[#B0B5C1] p-3 bg-[#33333E] rounded-lg">
                            {formData.experience_years || 0}
                        </p>
                    </div>
                    <CustomButton
                        placeholder="Редактировать профиль"
                        handleClick={() => setIsEditing(true)}
                    />
                </div>
            ) : (
                <div className="mb-6">
                    <div className="mb-4">
                        <h3 className="text-lg font-semibold mb-2">О себе</h3>
                        <textarea
                            value={formData.bio || ''}
                            onChange={(e) => handleChange('bio', e.target.value)}
                            className="w-full px-3 py-2 rounded-lg bg-[#444A58] text-[#B0B5C1] border border-[#555C69] placeholder-[#B0B5C1]"
                            rows="4"
                            placeholder="Расскажите о себе"
                        />
                    </div>
                    <div className="mb-4">
                        <h3 className="text-lg font-semibold mb-2">Специализация</h3>
                        <InputText
                            placeholder="Ваша специализация"
                            type="text"
                            value={formData.specialization || ''}
                            onChange={(e) => handleChange('specialization', e.target.value)}
                        />
                    </div>
                    <div className="mb-4">
                        <h3 className="text-lg font-semibold mb-2">Опыт (лет)</h3>
                        <InputText
                            placeholder="Опыт в годах"
                            type="number"
                            value={formData.experience_years || 0}
                            onChange={(e) => handleChange('experience_years', e.target.value)}
                        />
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
                                        bio: profile.profile_data.bio || '',
                                        specialization: profile.profile_data.specialization || '',
                                        experience_years: profile.profile_data.experience_years || 0
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
                <h3 className="text-lg font-semibold mb-4">Последние достижения</h3>
                <div className="grid grid-cols-1 gap-3">
                    <div className="p-3 border border-[#444A58] rounded-lg flex justify-between items-center">
                        <div>
                            <p className="font-semibold">Российский Кубок 2025</p>
                            <p className="text-sm text-[#B0B5C1]">15.03.2025</p>
                        </div>
                        <p className="text-[#FC3000] font-bold">+50 pts</p>
                    </div>
                    <div className="p-3 border border-[#444A58] rounded-lg flex justify-between items-center">
                        <div>
                            <p className="font-semibold">Хакатон кодеров</p>
                            <p className="text-sm text-[#B0B5C1]">28.02.2025</p>
                        </div>
                        <p className="text-[#FC3000] font-bold">+35 pts</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SportsmanProfile