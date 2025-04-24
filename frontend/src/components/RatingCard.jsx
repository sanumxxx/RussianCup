import React from 'react'
import { useNavigate } from 'react-router-dom'

const RatingCard = ({ place, username, score }) => {
	return (
		<div className='flex flex-col w-[95%] mx-auto'>
			<div className='flex justify-between items-center cursor-not-allowed bg-[#FC3000] w-full text-white px-1 font-thin'>
				<p>russian_cup_header_2025</p>
				<img src='assets/icons/plus.svg' alt='' className='rotate-45 h-5' />
			</div>
			<div className='grid grid-cols-7 items-center h-16 p-4 border-1 bg-[#22222E] border-[#FC3000]'>
				<p className='col-span-1'>{place}</p>
				<p className='col-span-4'>{username}</p>
				<p className='col-span-2'>{score}</p>
			</div>
		</div>
	)
}

export default RatingCard
