import { Button } from '@material-tailwind/react'

const CustomButton = ({ placeholder, handleClick, disabled }) => {
	return (
		<button
			onClick={disabled ? null : handleClick}
			disabled={disabled}
			className={`relative rounded-lg h-10 px-3 transition-all overflow-hidden
        ${
					disabled
						? 'bg-[#444A58] text-[#B0B5C1] cursor-not-allowed'
						: 'bg-[#FC3000] text-white hover:scale-[100.5%] active:scale-[99.5%]'
				}
      `}
		>
			{placeholder}
			{!disabled && (
				<div className='circle absolute bg-[#ffffff10] rounded-full w-16 h-16 pointer-events-none scale-0'></div>
			)}
		</button>
	)
}

const InputText = ({ placeholder, type, value, onChange }) => {
	return (
		<input
			type={type}
			value={value}
			onChange={onChange}
			className='px-2 rounded-lg bg-[#444A58] text-[#B0B5C1] border-1 border-[#555C69] h-10 placeholder-[#B0B5C1]'
			placeholder={placeholder}
		/>
	)
}

const Select = ({ body, name, default_option }) => {
	return (
		<select
			name={name}
			className='appearance-none w-full p-2 rounded-2xl border border-gray-300 bg-white text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ease-in-out'
		>
			<option value=''>{default_option}</option>
			{body.map((item, index) => (
				<option key={index} value={item.value}>
					{item.label}
				</option>
			))}
		</select>
	)
}

export default { CustomButton, InputText, Select }
