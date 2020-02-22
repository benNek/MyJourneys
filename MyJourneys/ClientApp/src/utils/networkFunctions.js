import axios from 'axios';

const config = () => {
  return {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('ACCESS_TOKEN')}`
    }
  }
};

export const register = data => axios.post('/api/user/register', data);