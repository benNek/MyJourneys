import axios from 'axios';

axios.defaults.headers.Authorization = `Bearer ${localStorage.getItem('accessToken')}`;

export const register = data => axios.post('/api/user/register', data);
export const login = data => axios.post('/api/user/login', data);
export const logout = () => axios.get('/api/user/logout');