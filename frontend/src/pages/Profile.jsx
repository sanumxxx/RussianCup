import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import { useProfile } from '../context/ProfileContext'
import SportsmanProfile from '../components/profiles/SportsmanProfile'
import SponsorProfile from '../components/profiles/SponsorProfile'
import RegionProfile from '../components/profiles/RegionProfile'
import { getToken, removeToken } from '../utils/auth'

const Profile = () => {
	const navigate = useNavigate()
	const { profile, isLoading, error } = useProfile()

	useEffect(() => {
		const token = getToken()
		if (!token) {
			navigate('/auth')
		}
	}, [navigate])

	const handleLogout = () => {
		removeToken()
		navigate('/auth')
	}

	const renderProfileContent = () => {
		if (isLoading) {
			return (
				<div className="text-white text-center py-10">
					<p>Загрузка профиля...</p>
				</div>
			)
		}

		if (error) {
			return (
				<div className="text-red-400 text-center py-10">
					<p>Ошибка: {error}</p>
					<button
						onClick={() => navigate('/auth')}
						className="mt-4 px-4 py-2 bg-[#FC3000] text-white rounded-lg"
					>
						Войти снова
					</button>
				</div>
			)
		}

		if (!profile) {
			return (
				<div className="text-white text-center py-10">
					<p>Профиль не найден</p>
					<button
						onClick={() => navigate('/auth')}
						className="mt-4 px-4 py-2 bg-[#FC3000] text-white rounded-lg"
					>
						Войти
					</button>
				</div>
			)
		}

		switch (profile.role) {
			case 'sportsman':
				return <SportsmanProfile />
			case 'sponsor':
				return <SponsorProfile />
			case 'region':
				return <RegionProfile />
			default:
				return <div className="text-white">Неизвестный тип профиля</div>
		}
	}

	return (
		<>
			<Header />
			<div className='relative w-full'>
				{/* Нижняя карточка */}
				<div className='flex flex-col w-4/5 mx-auto mt-10 bg-[#22222E] border border-[#D559FD] z-0'>
					<div className='flex justify-between items-center w-full text-[#D559FD] px-3 py-2 font-thin'>
						<p>russian_cup_profile_2025</p>
						<svg
							className='h-5 w-5 rotate-45'
							width='800px'
							height='800px'
							viewBox='0 0 16 16'
							fill='none'
							xmlns='http://www.w3.org/2000/svg'
						>
							<path
								d='M10 1H6V6L1 6V10H6V15H10V10H15V6L10 6V1Z'
								fill='#D559FD'
							/>
						</svg>
					</div>
					<div className='flex h-64 p-4 border-t border-[#D559FD] bg-[#22222E]'>
						<p className='text-center w-full pixelify text-[#D559FD] text-4xl'>
							Личный кабинет
						</p>
					</div>
				</div>

				{/* Верхняя карточка — перекрывает нижнюю */}
				<div className='absolute top-28 left-1/2 transform -translate-x-1/2 w-4/6 z-10'>
					<div className='flex flex-col overflow-hidden shadow-xl'>
						<div className='flex justify-between items-center bg-[#FC3000] w-full text-white px-3 py-2 font-thin'>
							<p>russian_cup_profile_2025</p>
							<img
								src='/assets/icons/plus.svg'
								alt=''
								className='rotate-45 h-5'
							/>
						</div>
						<div className='flex flex-col p-6 border border-[#FC3000] bg-[#22222E]'>
							{profile && !isLoading && (
								<div className="flex justify-between items-center mb-6">
									<div className="flex items-center">
										<div className="w-16 h-16 rounded-full bg-gradient-to-r from-[#FC3000] to-[#D559FD] flex items-center justify-center text-2xl text-white mr-4">
											{profile.full_name?.split(' ').map(part => part[0]).join('').substring(0, 2) || 'ПП'}
										</div>
										<div>
											<h2 className="text-2xl font-bold text-white">{profile.full_name}</h2>
											<p className="text-[#B0B5C1]">{profile.email}</p>
											<p className="text-[#D559FD]">
												{profile.role === 'sportsman' ? 'Спортсмен' :
												profile.role === 'sponsor' ? 'Организатор' :
												profile.role === 'region' ? 'Представитель региона' : 'Пользователь'}
											</p>
										</div>
									</div>
									<button
										onClick={handleLogout}
										className="px-4 py-2 bg-[#444A58] text-[#B0B5C1] rounded-lg hover:bg-[#FC3000] hover:text-white transition-colors"
									>
										Выйти
									</button>
								</div>
							)}

							{renderProfileContent()}
						</div>
					</div>
				</div>
			</div>

			{/* Дополнительное пространство для корректного отображения */}
			<div className="h-[1000px]"></div>
		</>
	)
}

export default Profile