import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import './axiosConfig' // 👈 обязательно подключаем axios с интерсептором

createRoot(document.getElementById('root')).render(
	<>
		<App />
	</>
)
