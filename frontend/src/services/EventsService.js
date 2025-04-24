import axios from 'axios'

// Функция для моковых данных
function mockEvents() {
    return [
        {
            id: 1,
            name: 'Российский Кубок 2025',
            date: '2025-04-25',
            location: 'Москва',
            description: 'Главное соревнование по программированию 2025 года',
            max_participants: 200,
            current_participants: 54,
            status: 'active',
            difficulty_level: 'advanced',
            is_online: false,
            image_url: 'https://placehold.co/600x400.png',
            tags: ['программирование', 'соревнование', 'кубок']
        },
        {
            id: 2,
            name: 'Хакатон по блокчейну',
            date: '2025-03-10',
            location: 'Санкт-Петербург',
            description: 'Трехдневный хакатон по блокчейн-технологиям',
            max_participants: 100,
            current_participants: 32,
            status: 'completed',
            difficulty_level: 'medium',
            is_online: false,
            image_url: 'https://placehold.co/600x400.png',
            tags: ['блокчейн', 'хакатон', 'web3']
        },
        {
            id: 3,
            name: 'Онлайн-воркшоп по ML',
            date: '2025-05-15',
            description: 'Воркшоп по машинному обучению для новичков',
            max_participants: 500,
            current_participants: 125,
            status: 'registration',
            difficulty_level: 'beginner',
            is_online: true,
            image_url: 'https://placehold.co/600x400.png',
            tags: ['ML', 'AI', 'воркшоп', 'онлайн']
        }
    ];
}

const EventsService = {
    /**
     * Получение списка мероприятий
     * @param {Object} filters - фильтры для мероприятий
     * @returns {Promise<Array>} список мероприятий
     */
    async getEvents(filters = {}) {
        try {
            console.log('Fetching events with filters:', filters);
            // В реальном приложении тут будут параметры фильтрации
            const response = await axios.get('/events', { params: filters });
            return response.data;
        } catch (error) {
            console.error('Error fetching events:', error);
            // В случае ошибки возвращаем моковые данные
            return mockEvents();
        }
    },

    /**
     * Получение информации о конкретном мероприятии
     * @param {string|number} eventId - ID мероприятия
     * @returns {Promise<Object>} данные мероприятия
     */
    async getEventById(eventId) {
        try {
            const response = await axios.get(`/events/${eventId}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching event ${eventId}:`, error);

            // В демо-режиме возвращаем моковое событие с нужным ID
            const mockEvent = mockEvents().find(event => event.id.toString() === eventId.toString());
            if (mockEvent) return mockEvent;

            throw error;
        }
    },

    /**
     * Создание нового мероприятия
     * @param {Object} eventData - данные нового мероприятия, включая файл изображения
     * @returns {Promise<Object>} созданное мероприятие
     */
    async createEvent(eventData) {
        try {
            // Если есть изображение, подготовим FormData
            let data;
            if (eventData.image) {
                data = new FormData();

                // Добавляем изображение
                data.append('image', eventData.image);

                // Добавляем остальные поля
                for (const key in eventData) {
                    if (key !== 'image' && key !== 'displayDate') {
                        data.append(key, eventData[key]);
                    }
                }
            } else {
                // Если изображения нет, отправляем как обычный JSON
                data = { ...eventData };
                delete data.image;
                delete data.displayDate;
            }

            console.log('Creating event with data:', eventData);

            // Указываем в headers, что мы отправляем FormData или JSON
            const headers = eventData.image
                ? { 'Content-Type': 'multipart/form-data' }
                : { 'Content-Type': 'application/json' };

            const response = await axios.post('/events', data, { headers });
            return response.data;
        } catch (error) {
            console.error('Error creating event:', error);

            // В демо-режиме без реального API возвращаем мок данные
            console.log('Demo mode: returning mock data');

            // Создаём URL для изображения, если оно есть
            let imageUrl = 'https://placehold.co/600x400.png';
            if (eventData.image) {
                imageUrl = URL.createObjectURL(eventData.image);
            }

            return {
                ...eventData,
                id: Math.floor(Math.random() * 1000) + 100,
                created_at: new Date().toISOString(),
                status: 'registration',
                current_participants: 0,
                image_url: imageUrl
            };
        }
    },

    /**
     * Обновление мероприятия
     * @param {string|number} eventId - ID мероприятия
     * @param {Object} eventData - новые данные мероприятия
     * @returns {Promise<Object>} обновленное мероприятие
     */
    async updateEvent(eventId, eventData) {
        try {
            // Подготовка данных с учетом возможной загрузки изображения
            let data;
            if (eventData.image) {
                data = new FormData();
                data.append('image', eventData.image);

                for (const key in eventData) {
                    if (key !== 'image') {
                        data.append(key, eventData[key]);
                    }
                }
            } else {
                data = { ...eventData };
                delete data.image;
            }

            const headers = eventData.image
                ? { 'Content-Type': 'multipart/form-data' }
                : { 'Content-Type': 'application/json' };

            const response = await axios.put(`/events/${eventId}`, data, { headers });
            return response.data;
        } catch (error) {
            console.error(`Error updating event ${eventId}:`, error);
            throw error;
        }
    },

    /**
     * Регистрация пользователя на мероприятие
     * @param {string|number} eventId - ID мероприятия
     * @returns {Promise<Object>} результат регистрации
     */
    async registerForEvent(eventId) {
        try {
            const response = await axios.post(`/events/${eventId}/register`);
            return response.data;
        } catch (error) {
            console.error(`Error registering for event ${eventId}:`, error);
            throw error;
        }
    },

    /**
     * Отмена регистрации пользователя на мероприятие
     * @param {string|number} eventId - ID мероприятия
     * @returns {Promise<Object>} результат отмены регистрации
     */
    async unregisterFromEvent(eventId) {
        try {
            const response = await axios.delete(`/events/${eventId}/register`);
            return response.data;
        } catch (error) {
            console.error(`Error unregistering from event ${eventId}:`, error);
            throw error;
        }
    },

    /**
     * Получение списка участников мероприятия
     * @param {string|number} eventId - ID мероприятия
     * @returns {Promise<Array>} список участников
     */
    async getEventParticipants(eventId) {
        try {
            const response = await axios.get(`/events/${eventId}/participants`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching participants for event ${eventId}:`, error);
            throw error;
        }
    }
}

export default EventsService