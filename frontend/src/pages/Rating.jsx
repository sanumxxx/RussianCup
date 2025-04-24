import { Button } from '@material-tailwind/react'
import React, { useState } from 'react'
import RatingCard from '../components/RatingCard'
import Header from '../components/Header'
import { motion } from 'framer-motion'
import ModalWindow from '../components/ModalWindow'
import { useNavigate } from 'react-router-dom'

const Rating = () => {
	const [isOpen, setIsOpen] = useState(false)

	const RatingList = [
		{ name: 'Иван Иванов', score: 120 },
		{ name: 'Андрей Смирнов', score: 230 },
		{ name: 'Мария Козлова', score: 180 },
		{ name: 'Ольга Петрова', score: 90 },
		{ name: 'Егор Сидоров', score: 300 },
	]

	// Сортируем по убыванию очков
	const sortedList = [...RatingList].sort((a, b) => b.score - a.score)

	return (
		<>
			<Header handleNav={handleNav} />

			<div className='relative w-full'>
				{/* Нижняя карточка */}
				<div className='flex flex-col w-4/5 mx-auto mt-10 bg-[#22222E] border border-[#D559FD] z-0'>
					<div className='flex justify-between items-center w-full text-[#D559FD] px-3 py-2 font-thin'>
						<p>russian_cup_events_2025</p>
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
							Мероприятия
						</p>
					</div>
				</div>

				{/* Верхняя карточка */}
				<div className='absolute top-28 left-1/2 transform -translate-x-1/2 w-4/6 z-10'>
					<div className='flex flex-col overflow-hidden shadow-xl'>
						<div className='flex justify-between items-center bg-[#FC3000] w-full text-white px-3 py-2 font-thin'>
							<p>russian_cup_events_2025</p>
							<img
								src='/assets/icons/plus.svg'
								alt=''
								className='rotate-45 h-5'
							/>
						</div>
						<div className='flex justify-between items-center h-90 p-4 border border-[#FC3000] bg-[#22222E]'>
							<div className='w-full flex justify-center'></div>
						</div>
					</div>
				</div>
			</div>

			<div className='grid grid-cols-3 auto-rows-auto gap-4 w-4/5 mx-auto mt-60'>
				{sortedList.map((user, index) => (
					<motion.div
						key={index}
						initial={{ opacity: 0, y: 50 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.4, delay: index * 0.1 }}
					>
						<RatingCard
							place={index + 1}
							username={user.name}
							score={user.score}
						/>
					</motion.div>
				))}
			</div>
		</>
	)
}

export default Rating
