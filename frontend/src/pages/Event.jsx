import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import Header from '../components/Header'
import Components from '../components'
import EventsService from '../services/EventsService'
import { getImageUrl } from '../utils/imageUtils'
import { getUserRole, getUserId } from '../utils/auth'
import ModalWindow from '../components/ModalWindow'

const Event = () => {
	const { id } = useParams()
	const navigate = useNavigate()
	const { CustomButton } = Components

	const [event, setEvent] = useState(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState(null)
	const [userRole, setUserRole] = useState(null)
	const [isRegistered, setIsRegistered] = useState(false)
	const [registrationLoading, setRegistrationLoading] = useState(false)
	const [successMessage, setSuccessMessage] = useState(null)
	const [showConfirmModal, setShowConfirmModal] = useState(false)
	const [participants, setParticipants] = useState([])
	const [showParticipantsModal, setShowParticipantsModal] = useState(false)

	// Get current user information
	useEffect(() => {
		setUserRole(getUserRole())
	}, [])

	// Fetch event details
	useEffect(() => {
		const fetchEventDetails = async () => {
			setLoading(true)
			setError(null)

			try {
				const eventData = await EventsService.getEventById(id)
				setEvent(eventData)

				// Check if user is registered for this event
				if (userRole === 'sportsman') {
					try {
						const participants = await EventsService.getEventParticipants(id)
						const userId = getUserId()
						setIsRegistered(participants.some(p => p.id === userId))
					} catch (err) {
						console.error('Error checking registration status:', err)
					}
				}
			} catch (err) {
				console.error('Error fetching event details:', err)
				setError('Не удалось загрузить данные мероприятия')
			} finally {
				setLoading(false)
			}
		}

		if (id) {
			fetchEventDetails()
		}
	}, [id, userRole])

	// Format date from ISO to readable format
	const formatDate = (dateString) => {
		if (!dateString) return 'Не указано'

		try {
			const date = new Date(dateString)
			return date.toLocaleDateString('ru-RU', {
				day: '2-digit',
				month: '2-digit',
				year: 'numeric',
				hour: '2-digit',
				minute: '2-digit'
			})
		} catch (e) {
			return dateString
		}
	}

	// Get status text
	const getStatusText = (status) => {
		switch (status) {
			case 'active': return 'Активно'
			case 'registration': return 'Открыта регистрация'
			case 'completed': return 'Завершено'
			case 'cancelled': return 'Отменено'
			case 'draft': return 'Черновик'
			default: return status || 'Не указан'
		}
	}

	// Get difficulty text
	const getDifficultyText = (difficulty) => {
		switch (difficulty) {
			case 'beginner': return 'Начинающий'
			case 'medium': return 'Средний'
			case 'advanced': return 'Продвинутый'
			case 'expert': return 'Эксперт'
			default: return difficulty || 'Не указан'
		}
	}

	// Get event type text
	const getEventTypeText = (type) => {
		switch (type) {
			case 'hackathon': return 'Хакатон'
			case 'competition': return 'Соревнование'
			case 'workshop': return 'Воркшоп'
			case 'meetup': return 'Митап'
			case 'conference': return 'Конференция'
			case 'other': return 'Другое'
			default: return type || 'Не указан'
		}
	}

	// Register for event
	const handleRegister = async () => {
		setRegistrationLoading(true)
		setError(null)

		try {
			const result = await EventsService.registerForEvent(id)
			setIsRegistered(true)
			setSuccessMessage('Вы успешно зарегистрированы на мероприятие!')
			setTimeout(() => setSuccessMessage(null), 5000)

			// Update event data to reflect new participant count
			if (event) {
				setEvent({
					...event,
					current_participants: (event.current_participants || 0) + 1
				})
			}
		} catch (err) {
			console.error('Error registering for event:', err)
			setError(err.response?.data?.detail || 'Не удалось зарегистрироваться на мероприятие')
		} finally {
			setRegistrationLoading(false)
			setShowConfirmModal(false)
		}
	}

	// Unregister from event
	const handleUnregister = async () => {
		setRegistrationLoading(true)
		setError(null)

		try {
			const result = await EventsService.unregisterFromEvent(id)
			setIsRegistered(false)
			setSuccessMessage('Регистрация отменена')
			setTimeout(() => setSuccessMessage(null), 5000)

			// Update event data to reflect new participant count
			if (event) {
				setEvent({
					...event,
					current_participants: Math.max(0, (event.current_participants || 1) - 1)
				})
			}
		} catch (err) {
			console.error('Error unregistering from event:', err)
			setError(err.response?.data?.detail || 'Не удалось отменить регистрацию')
		} finally {
			setRegistrationLoading(false)
			setShowConfirmModal(false)
		}
	}

	// View participants
	const handleViewParticipants = async () => {
		try {
			const participants = await EventsService.getEventParticipants(id)
			setParticipants(participants)
			setShowParticipantsModal(true)
		} catch (err) {
			console.error('Error fetching participants:', err)
			setError('Не удалось загрузить список участников')
		}
	}

const isOrganizer = () => {
		if (!event) return false;

		// Get current user ID
		const currentUserId = getUserId();
		if (!currentUserId) return false;

		// Handle different organizer data formats
		if (typeof event.organizer === 'object' && event.organizer.id) {
			return event.organizer.id === currentUserId;
		} else if (event.organizer_id) {
			return event.organizer_id === currentUserId;
		}

		return false;
	}

	// Determine if registration button should be shown
	const showRegistrationButton = () => {
		if (loading || !event || !userRole) return false
		if (userRole !== 'sportsman') return false
		if (event.status !== 'registration' && event.status !== 'active') return false
		if (event.current_participants >= event.max_participants && !isRegistered) return false
		return true
	}

	if (loading) {
		return (
			<>
				<Header />
				<div className="flex justify-center items-center h-[70vh]">
					<div className="text-white text-center">
						<svg className="animate-spin h-12 w-12 text-[#FC3000] mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
							<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
							<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
						</svg>
						<p>Загрузка информации о мероприятии...</p>
					</div>
				</div>
			</>
		)
	}

	if (error || !event) {
		return (
			<>
				<Header />
				<div className="flex justify-center items-center h-[70vh]">
					<div className="text-white text-center max-w-md">
						<svg className="h-16 w-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
						</svg>
						<h2 className="text-xl font-bold mb-4">Ошибка загрузки</h2>
						<p className="mb-6">{error || 'Мероприятие не найдено'}</p>
						<div className="flex justify-center space-x-4">
							<button
								onClick={() => navigate('/events')}
								className="px-4 py-2 bg-[#444A58] text-white rounded-lg hover:bg-[#555C69]"
							>
								Вернуться к списку
							</button>
							<button
								onClick={() => window.location.reload()}
								className="px-4 py-2 bg-[#FC3000] text-white rounded-lg hover:bg-[#e02b00]"
							>
								Попробовать снова
							</button>
						</div>
					</div>
				</div>
			</>
		)
	}

	return (
		<>
			<Header />
			<div className='relative w-full'>
				{/* Фоновая карточка */}
				<div className='flex flex-col w-4/5 mx-auto mt-10 bg-[#22222E] border border-[#D559FD] z-0'>
					<div className='flex justify-between items-center w-full text-[#D559FD] px-3 py-2 font-thin'>
						<p>russian_cup_event_{id}_2025</p>
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
							{event.name}
						</p>
					</div>
				</div>

				{/* Карточка с информацией о мероприятии */}
				<div className='absolute top-28 left-1/2 transform -translate-x-1/2 w-5/6 z-10'>
					<div className='flex flex-col overflow-hidden shadow-xl mb-6'>
						<div className='flex justify-between items-center bg-[#FC3000] w-full text-white px-3 py-2 font-thin'>
							<p>event_information</p>
							<img
								src='/assets/icons/plus.svg'
								alt=''
								className='rotate-45 h-5 cursor-pointer'
								onClick={() => navigate('/events')}
							/>
						</div>

						{/* Уведомления */}
						{successMessage && (
							<div className="bg-green-600 text-white p-3 text-center">
								{successMessage}
							</div>
						)}
						{error && (
							<div className="bg-red-600 text-white p-3 text-center">
								{error}
							</div>
						)}

						<div className='flex flex-col md:flex-row p-6 border border-[#FC3000] bg-[#22222E] text-white'>
							{/* Изображение и статус */}
							<div className="md:w-1/3 mb-6 md:mb-0 md:pr-6">
								<div className="relative">
									<img
										src={event.image_url || 'https://placehold.co/600x400.png'}
										alt={event.name}
										className="w-full h-64 object-cover rounded-lg"
									/>
									<div className={`absolute top-4 right-4 px-3 py-1.5 rounded-lg text-sm font-medium ${
										event.status === 'active' ? 'bg-[#FC3000] text-white' :
										event.status === 'registration' ? 'bg-[#D559FD] text-white' :
										event.status === 'completed' ? 'bg-[#333] text-[#B0B5C1]' :
										'bg-red-700 text-white'
									}`}>
										{getStatusText(event.status)}
									</div>
								</div>

								{/* Регистрация */}
								{showRegistrationButton() && (
									<div className="mt-4">
										{!isRegistered ? (
											<CustomButton
												placeholder={event.current_participants >= event.max_participants ?
												'Нет свободных мест' : 'Зарегистрироваться'}
												handleClick={() => setShowConfirmModal(true)}
												disabled={event.current_participants >= event.max_participants || registrationLoading}
											/>
										) : (
											<CustomButton
												placeholder={registrationLoading ? "Отмена регистрации..." : "Отменить регистрацию"}
												handleClick={() => setShowConfirmModal(true)}
												disabled={registrationLoading}
											/>
										)}
									</div>
								)}

								{/* Участники и прогресс */}
								<div className="mt-4">
									<div className="flex justify-between items-center mb-2">
										<span className="text-[#B0B5C1]">Участников: {event.current_participants || 0}/{event.max_participants || 100}</span>
										{(isOrganizer() || userRole === 'region') && (
											<button
												onClick={handleViewParticipants}
												className="text-[#FC3000] hover:underline text-sm"
											>
												Просмотреть список
											</button>
										)}
									</div>
									<div className="w-full bg-[#333] rounded-full h-2">
										<div
											className="h-2 rounded-full bg-[#FC3000]"
											style={{ width: `${Math.min(100, Math.round((event.current_participants / event.max_participants) * 100))}%` }}
										/>
									</div>
								</div>

								{/* Организатор */}
								{/* Организатор */}
								{event.organizer && (
									<div className="mt-6 p-4 bg-[#33333E] rounded-lg">
										<h3 className="font-semibold mb-2">Организатор</h3>
										<div className="flex items-center">
											<div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#FC3000] to-[#D559FD] flex items-center justify-center text-white mr-3">
												{(typeof event.organizer === 'object' && event.organizer.full_name
													? event.organizer.full_name.substring(0, 2)
													: (typeof event.organizer === 'string'
														? event.organizer.substring(0, 2)
														: 'ОР'))}
											</div>
											<div>
												<p className="font-medium">
													{typeof event.organizer === 'object'
														? event.organizer.full_name || 'Организатор'
														: (typeof event.organizer === 'string'
															? event.organizer
															: 'Организатор')}
												</p>
												{typeof event.organizer === 'object' && event.organizer.organization_name && (
													<p className="text-sm text-[#B0B5C1]">{event.organizer.organization_name}</p>
												)}
											</div>
										</div>
										{isOrganizer() && (
											<div className="mt-3">
												<button
													onClick={() => navigate(`/event/${id}/edit`)} // This would need a new route/page for editing
													className="w-full px-3 py-1.5 bg-[#444A58] text-[#B0B5C1] rounded-lg hover:bg-[#555C69] text-sm"
												>
													Редактировать мероприятие
												</button>
											</div>
										)}
									</div>
								)}f
							</div>

							{/* Детали мероприятия */}
							<div className="md:w-2/3">
								<motion.h1
									className="text-3xl font-bold mb-3"
									initial={{ opacity: 0, y: -20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ delay: 0.1 }}
								>
									{event.name}
								</motion.h1>

								{/* Теги */}
								<motion.div
									className="flex flex-wrap gap-2 mb-4"
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									transition={{ delay: 0.2 }}
								>
									{event.tags && event.tags.map((tag, index) => (
										<span
											key={index}
											className="px-3 py-1 bg-[#FC300015] text-[#FC3000] rounded-lg text-sm"
										>
											{tag.name || tag}
										</span>
									))}
									<span className="px-3 py-1 bg-[#D559FD20] text-[#D559FD] rounded-lg text-sm">
										{getDifficultyText(event.difficulty_level)}
									</span>
									<span className="px-3 py-1 bg-[#33333E] text-[#B0B5C1] rounded-lg text-sm">
										{getEventTypeText(event.event_type)}
									</span>
								</motion.div>

								{/* Описание */}
								<motion.div
									className="mb-6"
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									transition={{ delay: 0.3 }}
								>
									<h3 className="text-lg font-semibold mb-2">О мероприятии</h3>
									<p className="text-[#B0B5C1] whitespace-pre-line">
										{event.description || 'Описание отсутствует'}
									</p>
								</motion.div>

								{/* Основная информация */}
								<motion.div
									className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6"
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									transition={{ delay: 0.4 }}
								>
									<div className="p-4 bg-[#33333E] rounded-lg">
										<h3 className="font-semibold mb-2">Дата и время</h3>
										<div className="flex items-center">
											<svg className="w-5 h-5 text-[#FC3000] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
											</svg>
											<p className="text-[#B0B5C1]">{formatDate(event.date)}</p>
										</div>
									</div>

									<div className="p-4 bg-[#33333E] rounded-lg">
										<h3 className="font-semibold mb-2">Место проведения</h3>
										<div className="flex items-center">
											<svg className="w-5 h-5 text-[#FC3000] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
											</svg>
											<p className="text-[#B0B5C1]">{event.is_online ? 'Онлайн' : (event.location || 'Не указано')}</p>
										</div>
									</div>
								</motion.div>

								{/* Дополнительная информация */}
								<motion.div
									className="p-4 bg-[#33333E] rounded-lg mb-6"
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									transition={{ delay: 0.5 }}
								>
									<h3 className="font-semibold mb-3">Дополнительная информация</h3>
									<div className="grid grid-cols-2 gap-x-4 gap-y-2">
										{event.registration_deadline && (
											<>
												<p className="text-[#B0B5C1]">Окончание регистрации:</p>
												<p>{formatDate(event.registration_deadline)}</p>
											</>
										)}
										<p className="text-[#B0B5C1]">Сложность:</p>
										<p>{getDifficultyText(event.difficulty_level)}</p>
										<p className="text-[#B0B5C1]">Тип мероприятия:</p>
										<p>{getEventTypeText(event.event_type)}</p>
										<p className="text-[#B0B5C1]">Дата создания:</p>
										<p>{formatDate(event.created_at)}</p>
									</div>
								</motion.div>

								{/* Призыв к действию */}
								{showRegistrationButton() && (
									<motion.div
										className="p-4 bg-[#FC300015] rounded-lg border border-[#FC3000] mb-6"
										initial={{ opacity: 0 }}
										animate={{ opacity: 1 }}
										transition={{ delay: 0.6 }}
									>
										<div className="flex flex-col md:flex-row items-center justify-between">
											<div className="mb-4 md:mb-0">
												<h3 className="font-semibold text-[#FC3000]">
													{isRegistered ? 'Вы зарегистрированы на это мероприятие!' : 'Присоединяйтесь к мероприятию!'}
												</h3>
												<p className="text-[#B0B5C1] text-sm">
													{isRegistered
														? 'Вы можете отменить регистрацию, если не сможете участвовать'
														: 'Регистрация открыта. Не упустите возможность принять участие!'
													}
												</p>
											</div>
											<div>
												{!isRegistered ? (
													<CustomButton
														placeholder="Зарегистрироваться"
														handleClick={() => setShowConfirmModal(true)}
														disabled={event.current_participants >= event.max_participants || registrationLoading}
													/>
												) : (
													<CustomButton
														placeholder="Отменить регистрацию"
														handleClick={() => setShowConfirmModal(true)}
														disabled={registrationLoading}
													/>
												)}
											</div>
										</div>
									</motion.div>
								)}

								{/* Поделиться */}
								<motion.div
									className="flex justify-end"
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									transition={{ delay: 0.7 }}
								>
									<button
										onClick={() => navigator.clipboard.writeText(window.location.href)}
										className="px-3 py-1.5 bg-[#444A58] text-[#B0B5C1] rounded-lg hover:bg-[#555C69] text-sm flex items-center"
									>
										<svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path>
										</svg>
										Поделиться
									</button>
								</motion.div>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Дополнительное пространство для контента */}
			<div className="h-[700px]"></div>

			{/* Модальное окно подтверждения регистрации/отмены */}
			<ModalWindow
				isOpen={showConfirmModal}
				onClose={() => setShowConfirmModal(false)}
				title={isRegistered ? "Отмена регистрации" : "Подтверждение регистрации"}
			>
				<div className="text-white">
					<p className="mb-6">
						{isRegistered
							? "Вы уверены, что хотите отменить регистрацию на это мероприятие?"
							: "Вы хотите зарегистрироваться на это мероприятие?"
						}
					</p>
					<div className="flex justify-end space-x-3">
						<button
							onClick={() => setShowConfirmModal(false)}
							className="px-3 py-1.5 bg-[#444A58] text-[#B0B5C1] rounded-lg hover:bg-[#555C69]"
						>
							Отмена
						</button>
						<CustomButton
							placeholder={isRegistered ? "Да, отменить" : "Да, зарегистрироваться"}
							handleClick={isRegistered ? handleUnregister : handleRegister}
							disabled={registrationLoading}
						/>
					</div>
				</div>
			</ModalWindow>

			{/* Модальное окно со списком участников */}
			<ModalWindow
				isOpen={showParticipantsModal}
				onClose={() => setShowParticipantsModal(false)}
				title="Участники мероприятия"
				maxWidth="md"
			>
				<div className="text-white">
					<p className="mb-4">Всего зарегистрировано: {participants.length}</p>
					{participants.length === 0 ? (
						<p className="text-center py-6 text-[#B0B5C1]">Пока нет зарегистрированных участников</p>
					) : (
						<div className="max-h-[400px] overflow-y-auto">
							{participants.map((participant, index) => (
								<div key={participant.id || index} className="flex items-center py-3 border-b border-[#444A58] last:border-0">
									<div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#FC3000] to-[#D559FD] flex items-center justify-center text-xs mr-3">
										{(participant.full_name || 'УЧ').substring(0, 2)}
									</div>
									<div>
										<p className="font-medium">{participant.full_name || 'Участник'}</p>
										{isOrganizer() && participant.email && (
											<p className="text-xs text-[#B0B5C1]">{participant.email}</p>
										)}
									</div>
								</div>
							))}
						</div>
					)}
					<div className="flex justify-end mt-4">
						<CustomButton
							placeholder="Закрыть"
							handleClick={() => setShowParticipantsModal(false)}
						/>
					</div>
				</div>
			</ModalWindow>
		</>
	)
}

export default Event