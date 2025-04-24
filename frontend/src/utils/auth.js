// Token storage key
const TOKEN_KEY = 'fc_programming_token'

/**
 * Checks if token is expired
 * @param {string} token - JWT token to check
 * @returns {boolean} True if token is expired or invalid
 */
export const isTokenExpired = (token) => {
    if (!token) return true;

    try {
        // Parse the token
        const payload = parseToken(token);
        if (!payload || !payload.exp) return true;

        // Token expiration is in seconds, Date.now() is in milliseconds
        return payload.exp * 1000 < Date.now();
    } catch (error) {
        console.error('Error checking token expiration:', error);
        return true;
    }
}

/**
 * Gets the authentication token from localStorage
 * @returns {string|null} The token or null if not found
 */
export const getToken = () => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return null;

    // Проверяем токен на валидность - должен быть JWT с тремя частями
    const parts = token.split('.');
    if (parts.length !== 3) {
        // Если токен испорчен, удаляем его
        console.error('Invalid token format, removing');
        removeToken();
        return null;
    }

    // Проверяем срок действия
    if (isTokenExpired(token)) {
        console.log('Token expired, removing');
        removeToken();
        return null;
    }

    return token;
}

/**
 * Saves the authentication token to localStorage
 * @param {string} token - The token to save
 */
export const saveToken = (token) => {
    if (!token) {
        console.error('Attempted to save empty token');
        return;
    }
    localStorage.setItem(TOKEN_KEY, token);
}

/**
 * Removes the authentication token from localStorage
 */
export const removeToken = () => localStorage.removeItem(TOKEN_KEY);

/**
 * Checks if user is authenticated (has a token)
 * @returns {boolean} True if authenticated
 */
export const isAuthenticated = () => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return false;

    // Если токен есть, проверяем его срок действия
    return !isTokenExpired(token);
}

/**
 * Parse JWT token to get payload data
 * @param {string} token - JWT token
 * @returns {object|null} Parsed token payload or null if invalid
 */
export const parseToken = (token) => {
    if (!token) return null;

    try {
        // Get the payload part of the JWT (second part)
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split('')
                .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
        );

        return JSON.parse(jsonPayload);
    } catch (error) {
        console.error('Failed to parse token:', error);
        return null;
    }
}

/**
 * Gets user role from token
 * @returns {string|null} User role or null if not found
 */
export const getUserRole = () => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return null;

    const payload = parseToken(token);
    return payload?.role || null;
}

/**
 * Gets user ID from token
 * @returns {string|null} User ID or null if not found
 */
export const getUserId = () => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return null;

    const payload = parseToken(token);
    return payload?.sub || null;
}

/**
 * Обновляет JWT токен (для обновления токена на сервере)
 * @param {string} newToken - Новый JWT токен
 * @returns {void}
 */
export const updateToken = (newToken) => {
    if (!newToken) {
        console.error('Attempted to update with empty token');
        return;
    }
    localStorage.setItem(TOKEN_KEY, newToken);
}

/**
 * Проверяет, является ли пользователь спонсором
 * @returns {boolean} True если пользователь - спонсор
 */
export const isSponsor = () => {
    return getUserRole() === 'sponsor';
}

/**
 * Проверяет, является ли пользователь спортсменом
 * @returns {boolean} True если пользователь - спортсмен
 */
export const isSportsman = () => {
    return getUserRole() === 'sportsman';
}

/**
 * Проверяет, является ли пользователь представителем региона
 * @returns {boolean} True если пользователь - представитель региона
 */
export const isRegion = () => {
    return getUserRole() === 'region';
}