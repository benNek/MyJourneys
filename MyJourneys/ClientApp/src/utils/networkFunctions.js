import axios from 'axios';
import _ from 'lodash';

const createParameters = (parameters) => {
  if (parameters === undefined) return '';
  if (_.isEmpty(parameters)) return '';
  const strings = _.reduce(parameters, (result, value, key) => {
    if (value && key) return [...result, (`${key}=${value}`)];
    return result;
  }, []);
  if (!strings.length) {
    return '';
  }
  return `?${_.join(strings, '&')}`;
};

axios.defaults.headers.Authorization = `Bearer ${localStorage.getItem('accessToken')}`;

// Auth
export const register = data => axios.post('/api/user/register', data);
export const login = data => axios.post('/api/user/login', data);
export const logout = () => axios.get('/api/user/logout');
export const getUnapprovedAuthors = () => axios.get('/api/user/unapproved');
export const approveAuthor = author => axios.get(`/api/user/approve/${author}`);
export const blockAuthor = author => axios.get(`/api/user/block/${author}`);
export const deletePhotos = () => axios.delete(`/api/user/delete-photos`);

// Overview
export const uploadJourney = data => axios.post('/api/overview', data, {
  'Content-Type': 'multipart/form-data'
});
export const getTravelingYears = () => axios.get('/api/overview/years');
export const getVisitedCountries = params => axios.get(`/api/overview/countries${createParameters(params)}`);
export const getOverviewJourneys = params => axios.get(`/api/overview${createParameters(params)}`);
export const getOverviewJourney = id => axios.get(`/api/overview/${id}`);
export const deletePhoto = (journeyId, id) => axios.delete(`api/overview/${journeyId}/photos/${id}`);

// Sharing
export const getTags = () => axios.get('/api/article/tags');
export const getPopularTags = () => axios.get('/api/article/tags/popular');
export const createArticle = data => axios.post('/api/article', data);
export const editArticle = (id, data) => axios.put(`/api/article/${id}`, data);
export const deleteArticle = id => axios.delete(`/api/article/${id}`);
export const getArticles = params => axios.get(`/api/article${createParameters(params)}`);
export const getAuthorArticles = name => axios.get(`/api/article/author/${name}`);
export const getArticle = id => axios.get(`/api/article/${id}`);
export const likeArticle = id => axios.post(`/api/article/${id}/like`);
export const hasLikedArticle = id => axios.get(`/api/article/${id}/like`);

// Journeys
export const createJourney = data => axios.post('/api/journey', data);
export const deleteJourney = id => axios.delete(`/api/journey/${id}`);
export const getJourneys = () => axios.get('/api/journey');
export const getJourney = id => axios.get(`/api/journey/${id}`);
export const getJourneyItems = id => axios.get(`/api/journey/${id}/itinerary`);
export const getPlaces = id => axios.get(`/api/journey/${id}/places`);
export const getNotes = id => axios.get(`/api/journey/${id}/notes`);
export const createItem = data => axios.post('/api/journey/item', data);
export const deleteItem = id => axios.delete(`/api/journey/item/${id}`);
export const createPlace = data => axios.post('/api/journey/place', data);
export const deletePlace = id => axios.delete(`/api/journey/place/${id}`);
export const setStartPlace = (journeyId, placeId) => axios.get(`/api/journey/${journeyId}/places/${placeId}/start`);
export const reorderPlaces = id => axios.get(`/api/journey/${id}/places/reorder`);
export const createNote = data => axios.post('/api/journey/note', data);
export const updateNote = (id, data) => axios.put(`/api/journey/note/${id}`, data);
export const deleteNote = id => axios.delete(`/api/journey/note/${id}`);

export const updateBearerToken = () => axios.defaults.headers.Authorization = `Bearer ${localStorage.getItem('accessToken')}`;