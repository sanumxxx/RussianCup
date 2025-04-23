import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Components from '../components'
import { saveToken, getToken, removeToken } from '../utils/auth'
import { useNavigate } from 'react-router-dom'

const Auth = () => {
	const navigate = useNavigate()

	const API_URL = import.meta.env.VITE_API_URL

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

	const [roles] = useState([
		{ id: 1, value: 'sportsman', label: 'Спортсмен' },
		{ id: 2, value: 'sponsor', label: 'Организатор' },
		{ id: 3, value: 'region', label: 'Регион' },
	])

	useEffect(() => {
		const token = getToken()
		if (token) {
			console.log('🔐 Уже авторизован')
			// сюда можешь вставить navigate('/dashboard') если используешь роутинг
		}
	}, [])

	useEffect(() => {
		if (!isRegister) {
			setIsFormValid(validateEmail(formData.email) && formData.password !== '')
			return
		}
		const isValid =
			validateFullName(formData.fullName) &&
			validateEmail(formData.email) &&
			validatePassword(formData.password) &&
			formData.role_id !== null

		setIsFormValid(isValid)
	}, [formData, isRegister])

	const validateFullName = name => name.trim().split(' ').length === 3
	const validateEmail = email => /\S+@\S+\.\S+/.test(email)
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
	}

	const handleSubmit = async () => {
		if (isRegister) {
			try {
				const selectedRole = roles.find(r => r.id === formData.role_id)?.value

				const response = await axios.post(`${API_URL}/register`, {
					full_name: formData.fullName,
					email: formData.email,
					password: formData.password,
					role: selectedRole,
				})

				console.log('✅ Успешная регистрация', response.data)
				navigate('/profile') // ← сюда летим после регистрации
			} catch (error) {
				console.error(
					'❌ Ошибка регистрации:',
					error.response?.data || error.message
				)
				alert(error.response?.data?.detail || 'Ошибка регистрации')
			}
		} else {
			try {
				const form = new URLSearchParams()
				form.append('username', formData.email)
				form.append('password', formData.password)

				const response = await axios.post(`${API_URL}/token`, form, {
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded',
					},
				})

				console.log('🔐 Успешный вход. Токен:', response.data.access_token)
				saveToken(response.data.access_token)
				navigate('/profile') // ← сюда летим после логина
			} catch (error) {
				console.error(
					'❌ Ошибка авторизации:',
					error.response?.data || error.message
				)
				if (error.response?.status === 401) {
					setPasswordError(true)
				}
			}
		}
	}

	return (
		<div className='h-screen flex flex-col justify-center items-center'>
			<div className='flex justify-between items-center bg-[#FC3000] w-2/3 text-white px-1 font-thin'>
				<p>
					russian_cup_
					{isRegister ? 'register' : 'login'}
					_2025
				</p>
				<img src='assets/icons/plus.svg' alt='' className='rotate-45 h-5' />
			</div>

			<div className='bg-[#22222E] border-1 border-[#FC3000] flex justify-between items-center p-4 shadow-2xl w-2/3 mx-auto gap-3'>
				<div className='w-full xl:w-1/2 flex flex-col items-center justify-center'>
					<h1 className='mb-5 text-4xl font-bold text-[#FC3000]'>
						<img
							src={
								isRegister
									? '/assets/регистрация.svg'
									: '/assets/авторизация.svg'
							}
							alt=''
							className='h-12 '
						/>
					</h1>
					<div className='flex flex-col gap-3 w-4/5'>
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
						<div className='flex flex-col gap-1'>
							<InputText
								placeholder='Введите пароль'
								type='password'
								value={formData.password}
								onChange={e => handleChange('password', e.target.value)}
								error={passwordError}
							/>
							{passwordError && (
								<p className='text-sm text-red-400 font-thin'>
									Неверный пароль или email. Попробуйте снова.
								</p>
							)}
							{isRegister && (
								<p className='text-xs text-center text-[#ffffff75] font-thin'>
									Пароль должен содержать цифры и заглавные буквы
								</p>
							)}
						</div>

						{isRegister && (
							<div className='w-full my-4'>
								<label>
									<div className='flex justify-between gap-1'>
										{roles.map(role => {
											const isSelected = formData.role_id === role.id
											const baseColor = 'bg-[#F1C9FE] text-[#D559FD]'
											const grayColor = 'bg-[#444A58] text-[#B0B5C1]'

											return (
												<button
													key={role.id}
													type='button'
													className={`pixelify font-normal text-md h-10 w-full mb-2 rounded-lg transition-all ${
														isSelected ? baseColor : grayColor
													}`}
													onClick={() => handleChange('role_id', role.id)}
												>
													{role.label}
												</button>
											)
										})}
									</div>
								</label>
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
							}}
							className='text-white hover:underline font-thin'
						>
							{isRegister
								? 'У меня уже есть аккаунт, войти?'
								: 'У меня еще нет аккаунта, создать?'}
						</button>
					</div>
				</div>
				<img
					src='https://i.pinimg.com/736x/19/2d/9c/192d9c559937f26342667987bdbec550.jpg'
					alt=''
					className='w-1/2 h-full object-cover rounded-lg hidden lg:block'
				/>
			</div>
		</div>
	)
}

export default Auth
