const Header = () => {
	return (
		<>
			<div className='flex flex-col w-[95%] mx-auto'>
				<div className='flex justify-between items-center bg-[#FC3000] w-full text-white px-1 font-thin'>
					<p>russian_cup_header_2025</p>
					<img src='assets/icons/plus.svg' alt='' className='rotate-45 h-5' />
				</div>
				<div className='flex justify-between items-center h-16 p-4  border-1 bg-[#22222E] border-[#FC3000]'>
					<p className='text-4xl font-bold text-[#FC3000]'>Название</p>
					<div className='flex items-center gap-5 md:gap-10 text-white '>
						<p className='hover:underline cursor-pointer'>О нас</p>
						<p className='hover:underline cursor-pointer'>Мероприятия</p>
						<p className='hover:underline cursor-pointer'>Рейтинг</p>
						<img
							className='h-12 w-12 rounded-full hover:scale-102 cursor-pointer transition-all'
							src='https://i.pinimg.com/736x/6a/49/7f/6a497fbb881b2c87ff09819970afe111.jpg'
							alt=''
						/>
					</div>
				</div>
			</div>
		</>
	)
}
export default Header
