import React, { createContext, useState, useContext, useEffect } from 'react'
import axios from 'axios'
import { getToken } from '../utils/auth'

const ProfileContext = createContext()

export const useProfile = () => useContext(ProfileContext)

export const ProfileProvider = ({ children }) => {
    const [profile, setProfile] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)

    const fetchProfile = async () => {
        setIsLoading(true)
        try {
            const token = getToken()
            if (!token) {
                throw new Error('Not authenticated')
            }

            const response = await axios.get('/api/profiles/me')
            setProfile(response.data)
            setError(null)
        } catch (err) {
            console.error('Error fetching profile:', err)
            setError(err.response?.data?.detail || 'Failed to load profile')
        } finally {
            setIsLoading(false)
        }
    }

    const updateProfile = async (profileType, data) => {
        setIsLoading(true)
        try {
            const response = await axios.put(`/api/profiles/${profileType}`, data)

            // Update the profile data with the new values
            setProfile(prev => {
                if (!prev) return null

                return {
                    ...prev,
                    profile_data: {
                        ...prev.profile_data,
                        ...data
                    }
                }
            })

            return response.data
        } catch (err) {
            console.error('Error updating profile:', err)
            setError(err.response?.data?.detail || 'Failed to update profile')
            throw err
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        const token = getToken()
        if (token) {
            fetchProfile()
        } else {
            setIsLoading(false)
        }
    }, [])

    const value = {
        profile,
        isLoading,
        error,
        fetchProfile,
        updateProfile
    }

    return (
        <ProfileContext.Provider value={value}>
            {children}
        </ProfileContext.Provider>
    )
}

export default ProfileContext