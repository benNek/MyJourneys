import axios from 'axios';

const config = () => {
  return {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('ACCESS_TOKEN')}`
    }
  }
};

export const register = data => axios.post('/api/user/register', data);
export const login = data => axios.post('/api/user/login', data);
export const logout = () => axios.get('/api/user/logout');