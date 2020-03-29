import axios from 'axios';

// potencialiai del sito reload reikia po login/logout
axios.defaults.headers.Authorization = `Bearer ${localStorage.getItem('accessToken')}`;

// Auth
export const register = data => axios.post('/api/user/register', data);
export const login = data => axios.post('/api/user/login', data);
export const logout = () => axios.get('/api/user/logout');

// Sharing
export const createBlog = data => axios.post('/api/blog', data);
export const getBlogs = () => axios.get('/api/blog');
export const getBlog = id => axios.get(`/api/blog/${id}`);

// Journeys
export const createJourney = data => axios.post('/api/journey', data);
export const getJourneys = () => axios.get('/api/journey');
export const getJourneyItems = id => axios.get(`/api/journey/${id}`);
export const createFlightItem = data => axios.post('/api/journey/flight', data);
export const createHotelItem = data => axios.post('/api/journey/hotel', data);
export const createReservationItem = data => axios.post('/api/journey/reservation', data);
export const createEventItem = data => axios.post('/api/journey/event', data);
export const createNote = data => axios.post('/api/journey/note', data);
export const getNotes = id => axios.get(`/api/journey/${id}/notes`);