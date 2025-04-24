import {
	BrowserRouter as Router,
	Routes,
	Route,
	Navigate,
} from 'react-router-dom'
import { lazy, Suspense } from 'react'
import { ProfileProvider } from './context/ProfileContext'
import { getToken } from './utils/auth'

// Using React.lazy for better performance
const Auth = lazy(() => import('./pages/Auth'))
const Events = lazy(() => import('./pages/Events'))
const Event = lazy(() => import('./pages/Event'))
const Profile = lazy(() => import('./pages/Profile'))
const Rating = lazy(() => import('./pages/Rating'))

// Protected route component
const ProtectedRoute = ({ children }) => {
	const isAuthenticated = getToken();
	return isAuthenticated ? children : <Navigate to="/auth" />;
};

const App = () => {
	return (
		<ProfileProvider>
			<Router>
				<Suspense fallback={
					<div className="flex items-center justify-center h-screen bg-[#22222E]">
						<div className="text-white">Loading...</div>
					</div>
				}>
					<Routes>
						<Route path="/" element={<Navigate to="/auth" />} />
						<Route path="/auth" element={<Auth />} />
						<Route
							path="/events"
							element={
								<ProtectedRoute>
									<Events />
								</ProtectedRoute>
							}
						/>
						<Route
							path="/event"
							element={
								<ProtectedRoute>
									<Event />
								</ProtectedRoute>
							}
						/>
						<Route
							path="/profile"
							element={
								<ProtectedRoute>
									<Profile />
								</ProtectedRoute>
							}
						/>
						<Route
							path="/event/:id"
							element={
								<ProtectedRoute>
									<Event />
								</ProtectedRoute>
							}
						/>
						<Route
							path="/rating"
							element={
								<ProtectedRoute>
									<Rating />
								</ProtectedRoute>
							}
						/>
					</Routes>
				</Suspense>
			</Router>
		</ProfileProvider>
	)
}

export default App