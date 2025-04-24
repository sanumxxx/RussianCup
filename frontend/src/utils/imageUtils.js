/**
 * Utility functions for handling image URLs
 */

// Get the API base URL from environment or default to localhost
const API_BASE_URL = import.meta.env.VITE_API_URL?.replace(/\/api$/, '') || 'http://localhost:8000';

/**
 * Converts a relative image path to an absolute URL
 * @param {string} imagePath - The image path from the API (can be relative or absolute)
 * @returns {string} The absolute URL to the image
 */
export const getImageUrl = (imagePath) => {
  if (!imagePath) {
    return 'https://placehold.co/600x400.png'; // Default placeholder
  }

  // If the path is already a full URL, return it as is
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }

  // If the path is relative (starts with /), prepend the API base URL
  if (imagePath.startsWith('/')) {
    return `${API_BASE_URL}${imagePath}`;
  }

  // If the path doesn't start with /, assume it's a relative path to /api/uploads
  return `${API_BASE_URL}/api/uploads/${imagePath}`;
};