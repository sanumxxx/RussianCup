import React, { createContext, useState, useContext, useEffect, useRef } from 'react'
import axios from 'axios'
import { getToken, removeToken, isAuthenticated } from '../utils/auth'

const ProfileContext = createContext()

export const useProfile = () => useContext(ProfileContext)

export const ProfileProvider = ({ children }) => {
    const [profile, setProfile] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)

    // Use a ref to track if we've already initialized
    const initialized = useRef(false)
    // Ref to track API calls in progress
    const fetchInProgress = useRef(false)

    // This function is ONLY used for manual refresh button
    const fetchProfile = async () => {
        // Don't allow multiple simultaneous fetches
        if (fetchInProgress.current) return;

        try {
            fetchInProgress.current = true;
            setIsLoading(true);
            setError(null);

            // Check authentication directly from localStorage to avoid cycles
            if (!isAuthenticated()) {
                throw new Error('Not authenticated');
            }

            const response = await axios.get('/profiles/me');
            console.log('Manual profile refresh completed');
            setProfile(response.data);
        } catch (err) {
            console.error('Error refreshing profile:', err);
            setError(err.response?.data?.detail || 'Failed to load profile');

            // Handle authentication errors
            if (err.response?.status === 401) {
                console.log('Authentication failed, redirecting to login');
                removeToken();
                window.location.href = '/auth';
            }
        } finally {
            setIsLoading(false);
            fetchInProgress.current = false;
        }
    }

    // Load profile once on initial mount
    useEffect(() => {
        // Skip if we've already initialized
        if (initialized.current) return;

        // Check authorization directly without calling getToken()
        if (!isAuthenticated()) {
            setIsLoading(false);
            return;
        }

        // Mark as initialized immediately to prevent duplicate calls
        initialized.current = true;

        const loadProfileOnce = async () => {
            setIsLoading(true);

            try {
                const response = await axios.get('/profiles/me');
                console.log('Initial profile load completed');
                setProfile(response.data);
                setError(null);
            } catch (err) {
                console.error('Error loading initial profile:', err);
                if (err.response?.status === 401) {
                    console.log('Authentication token invalid or expired, redirecting to login');
                    removeToken();
                    window.location.href = '/auth';
                } else {
                    setError(err.response?.data?.detail || 'Failed to load profile');
                }
            } finally {
                setIsLoading(false);
            }
        };

        loadProfileOnce();
    }, []); // Empty dependency array = run once on mount

    const updateProfile = async (profileType, data) => {
        setIsLoading(true);
        try {
            const response = await axios.put(`/profiles/${profileType}`, data);

            // Update the local profile data
            setProfile(prev => {
                if (!prev) return null;

                return {
                    ...prev,
                    profile_data: {
                        ...prev.profile_data,
                        ...data
                    }
                };
            });

            console.log('Profile updated successfully');
            return response.data;
        } catch (err) {
            console.error('Error updating profile:', err);
            const errorMessage = err.response?.data?.detail || 'Failed to update profile';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    }

    const value = {
        profile,
        isLoading,
        error,
        fetchProfile, // Only exposed for manual refresh
        updateProfile
    };

    return (
        <ProfileContext.Provider value={value}>
            {children}
        </ProfileContext.Provider>
    );
}

export default ProfileContext