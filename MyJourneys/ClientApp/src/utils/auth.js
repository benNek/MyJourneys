import decode from 'jwt-decode';

export const parseUser = () => {
  const token = localStorage.getItem('accessToken');
  try {
    const decoded = decode(token);
    if (decoded.exp > Date.now() / 1000) {
      return decoded;
    }

    localStorage.removeItem('accessToken');
    return null;
  } catch (err) {
    return null;
  }
};