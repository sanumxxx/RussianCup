import {
	BrowserRouter as Router,
	Routes,
	Route,
	Navigate,
} from 'react-router-dom'
import Auth from './pages/Auth'
import Events from './pages/Events'
import Event from './pages/Event'
import Profile from './pages/Profile'
import { Rating } from '@material-tailwind/react'

const App = () => {
	return (
		<Router>
			<Routes>
				<Route path='/' element={<Navigate to='/auth' replace />} />
				<Route path='/auth' element={<Auth />} />
				<Route path='/events' element={<Events />} />
				<Route path='/event' element={<Event />} />
				<Route path='/profile' element={<Profile />} />
				<Route path='/rating' element={<Rating />} />
			</Routes>
		</Router>
	)
}

export default App
