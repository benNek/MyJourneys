import axios from 'axios';
import _ from 'lodash';

const createParameters = (parameters) => {
  if (parameters === undefined) return '';
  if (_.isEmpty(parameters)) return '';
  const strings = _.reduce(parameters, (result, value, key) => {
    if (value && key) return [...result, (`${key}=${value}`)];
    return result;
  }, []);
  return `?${_.join(strings, '&')}`;
};

// potencialiai del sito reload reikia po login/logout
axios.defaults.headers.Authorization = `Bearer ${localStorage.getItem('accessToken')}`;

// Auth
export const register = data => axios.post('/api/user/register', data);
export const login = data => axios.post('/api/user/login', data);
export const logout = () => axios.get('/api/user/logout');

// Overview
export const uploadPhoto = data => axios.post('/api/overview', data, {
  'Content-Type': 'multipart/form-data'
});
export const getVisitedCountries = params => axios.get(`/api/overview/countries${createParameters(params)}`);
export const getTravelingYears = () => axios.get('/api/overview/years');

// Sharing
export const getTags = () => axios.get('/api/article/tags');
export const getPopularTags = () => axios.get('/api/article/tags/popular');
export const createArticle = data => axios.post('/api/article', data);
export const getArticles = params => axios.get(`/api/article${createParameters(params)}`);
export const getArticle = id => axios.get(`/api/article/${id}`);
export const likeArticle = id => axios.post(`/api/article/${id}/like`);
export const hasLikedArticle = id => axios.get(`/api/article/${id}/like`);

// Journeys
export const createJourney = data => axios.post('/api/journey', data);
export const getJourneys = () => axios.get('/api/journey');
export const getJourneyItems = id => axios.get(`/api/journey/${id}`);
export const getPlaces = id => axios.get(`/api/journey/${id}/places`);
export const getNotes = id => axios.get(`/api/journey/${id}/notes`);
export const createFlightItem = data => axios.post('/api/journey/flight', data);
export const createHotelItem = data => axios.post('/api/journey/hotel', data);
export const createReservationItem = data => axios.post('/api/journey/reservation', data);
export const createEventItem = data => axios.post('/api/journey/event', data);
export const createPlace = data => axios.post('/api/journey/place', data);
export const reorderPlaces = id => axios.get(`/api/journey/${id}/places/reorder`);
export const createNote = data => axios.post('/api/journey/note', data);
