import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Components from '../components'
import { saveToken, getToken, removeToken } from '../utils/auth'
import { useNavigate } from 'react-router-dom'

const Auth = () => {
	const navigate = useNavigate()

	const API_URL = import.meta.env.VITE_API_URL || 'http://10.0.85.1:8000/api'

	const { CustomButton, InputText } = Components
	const [isRegister, setIsRegister] = useState(true)
	const [formData, setFormData] = useState({
		fullName: '',
		email: '',
		password: '',
		role_id: null,
	})
	const [isFormValid, setIsFormValid] = useState(false)
	const [passwordError, setPasswordError] = useState(false)
	const [errorMessage, setErrorMessage] = useState('')

	const [roles] = useState([
		{ id: 1, value: 'sportsman', label: 'Спортсмен' },
		{ id: 2, value: 'sponsor', label: 'Организатор' },
		{ id: 3, value: 'region', label: 'Регион' },
	])

	useEffect(() => {
		const token = getToken()
		if (token) {
			navigate('/events')
		}
	}, [navigate])

	useEffect(() => {
		const validateForm = () => {
			if (!isRegister) {
				return validateEmail(formData.email) && formData.password !== ''
			}

			return (
				validateFullName(formData.fullName) &&
				validateEmail(formData.email) &&
				validatePassword(formData.password) &&
				formData.role_id !== null
			)
		}

		setIsFormValid(validateForm())
	}, [formData, isRegister])

	const validateFullName = name => {
		const trimmedName = name.trim()
		return trimmedName.split(' ').length === 3 && trimmedName.length > 0
	}

	const validateEmail = email => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

	const validatePassword = password =>
		password.length >= 8 &&
		/[A-Z]/.test(password) &&
		/[a-z]/.test(password) &&
		/\d/.test(password)

	const handleChange = (field, value) => {
		setFormData(prev => ({
			...prev,
			[field]: value,
		}))
		setPasswordError(false)
		setErrorMessage('')
	}

	const handleSubmit = async () => {
		// Сбрасываем предыдущие ошибки
		setPasswordError(false)
		setErrorMessage('')

		if (!isFormValid) {
			setErrorMessage('Пожалуйста, заполните все поля корректно')
			return
		}

		try {
			if (isRegister) {
				const selectedRole = roles.find(r => r.id === formData.role_id)?.value

				const response = await axios.post(`${API_URL}/register`, {
					full_name: formData.fullName,
					email: formData.email,
					password: formData.password,
					role: selectedRole,
				})

				saveToken(response.data.access_token || '')
				navigate('/events')
			} else {
				const form = new URLSearchParams()
				form.append('username', formData.email)
				form.append('password', formData.password)

				const response = await axios.post(`${API_URL}/token`, form, {
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded',
					},
				})

				saveToken(response.data.access_token)
				navigate('/events')
			}
		} catch (error) {
			console.error('Ошибка:', error.response?.data || error.message)

			const errorText = error.response?.data?.detail ||
				(isRegister ? 'Ошибка регистрации' : 'Ошибка входа')

			setErrorMessage(errorText)

			if (error.response?.status === 401) {
				setPasswordError(true)
			}
		}
	}

	return (
		<div className='h-screen flex flex-col justify-center items-center bg-[#22222E] p-4'>
			<div className='w-full max-w-md'>
				<div className='flex justify-between items-center bg-[#FC3000] text-white px-4 py-2 font-thin'>
					<p>
						russian_cup_
						{isRegister ? 'register' : 'login'}
						_2025
					</p>
					<img src='/assets/icons/plus.svg' alt='' className='rotate-45 h-5' />
				</div>

				<div className='bg-[#2C2C38] border-2 border-[#FC3000] p-6 shadow-2xl rounded-b-lg'>
					<h1 className='mb-5 text-center'>
						<img
							src={
								isRegister
									? '/assets/регистрация.svg'
									: '/assets/авторизация.svg'
							}
							alt=''
							className='h-12 mx-auto'
						/>
					</h1>

					{errorMessage && (
						<div className='bg-red-600 text-white p-3 rounded mb-4 text-center'>
							{errorMessage}
						</div>
					)}

					<div className='space-y-4'>
						{isRegister && (
							<InputText
								placeholder='Иванов Иван Иванович'
								type='text'
								value={formData.fullName}
								onChange={e => handleChange('fullName', e.target.value)}
							/>
						)}

						<InputText
							placeholder='example@email.ru'
							type='email'
							value={formData.email}
							onChange={e => handleChange('email', e.target.value)}
						/>

						<div>
							<InputText
								placeholder='Введите пароль'
								type='password'
								value={formData.password}
								onChange={e => handleChange('password', e.target.value)}
								error={passwordError}
							/>
							{isRegister && (
								<p className='text-xs text-center text-gray-400 mt-1'>
									Пароль должен содержать цифры и заглавные буквы
								</p>
							)}
						</div>

						{isRegister && (
							<div className='grid grid-cols-3 gap-2'>
								{roles.map(role => {
									const isSelected = formData.role_id === role.id
									return (
										<button
											key={role.id}
											type='button'
											className={`
												px-2 py-2 rounded-lg text-sm transition-all
												${isSelected
													? 'bg-[#F1C9FE] text-[#D559FD]'
													: 'bg-[#444A58] text-[#B0B5C1]'}
											`}
											onClick={() => handleChange('role_id', role.id)}
										>
											{role.label}
										</button>
									)
								})}
							</div>
						)}

						<CustomButton
							placeholder={isRegister ? 'Зарегистрироваться' : 'Войти'}
							handleClick={handleSubmit}
							disabled={!isFormValid}
						/>

						<button
							onClick={() => {
								setIsRegister(prev => !prev)
								setPasswordError(false)
								setErrorMessage('')
							}}
							className='w-full text-white hover:underline text-center'
						>
							{isRegister
								? 'У меня уже есть аккаунт, войти?'
								: 'У меня еще нет аккаунта, создать?'}
						</button>
					</div>
				</div>
			</div>
		</div>
	)
}

export default Auth