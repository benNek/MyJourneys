import axios from 'axios';

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