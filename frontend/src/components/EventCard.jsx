const EventCard = ({ name, isPurple = true }) => {
	return (
		<div
			className={`flex flex-col border-1 ${
				isPurple ? 'border-[#D559FD]' : 'border-[#FC3000]'
			} bg-[#22222E] w-full h-full`}
		>
			<div
				className={`flex justify-between items-center ${
					isPurple
						? 'text-[#D559FD] border-b-1 border-b-[#D559FD]'
						: 'text-white bg-[#FC3000]'
				} px-2 py-1 font-thin`}
			>
				<p>russian_cup_event_card_2025</p>
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
						fill={isPurple ? '#D559FD' : '#FFFFFF'}
					/>
				</svg>
			</div>
			<div className='flex flex-col justify-between items-center p-4'>
				<img className='w-full' src='https://placehold.co/600x400.png' alt='' />
				<p className={`text-white text-lg font-bold`}>{name}</p>
			</div>
		</div>
	)
}

export default EventCard
