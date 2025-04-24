import axios from 'axios'
import { getToken, removeToken } from './utils/auth'


axios.defaults.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'


console.log('API base URL:', axios.defaults.baseURL)


axios.interceptors.request.use(config => {
    const token = getToken()
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
}, error => {
    return Promise.reject(error)
})


axios.interceptors.response.use(
    response => response,
    error => {

        if (error.response && error.response.status === 401) {
            console.error('Authentication error:', error.response.data)

            if (!error.config.url.includes('/token')) {
                console.log('Removing invalid token')
                removeToken()


                if (window.location.pathname !== '/auth') {
                    window.location.href = '/auth'
                }
            }
        }


        if (error.response) {
            console.error('API error:', error.response.status, error.response.data)
        } else if (error.request) {
            console.error('No response received:', error.request)
        } else {
            console.error('Request error:', error.message)
        }

        return Promise.reject(error)
    }
)

export default axios