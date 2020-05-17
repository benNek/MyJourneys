import * as Yup from 'yup';
import moment from "moment";

const yesterday = moment().subtract(1, 'days').toDate();
const today = moment().toDate();

// Auth
export const registerValidation = Yup.object().shape({
  username: Yup.string().required('Username is required'),
  email: Yup.string().email('Please enter an email'),
  password: Yup.string().required('Password is required').min(8, 'Password must be at least 8 characters long'),
  confirmPassword: Yup.string().oneOf([Yup.ref('password'), null], 'Passwords must match')
});

export const loginValidation = Yup.object().shape({
  username: Yup.string().required('Username is required'),
  password: Yup.string().required('Password is required')
});

// Planner
export const journeyValidation = Yup.object().shape({
  location: Yup.string().required('Location name is required'),
  startDate: Yup.date().required('Start date is required')
    .max(Yup.ref('endDate'), 'Start date should be before end date'),
  endDate: Yup.date().required('End date is required')
    .min(today, 'End date should not be in the past')
});

export const flightItemValidation = Yup.object().shape({
  airline: Yup.string().required('Airline name is required'),
  flightNumber: Yup.string().required('Flight number is required')
    .matches(/^([A-Z]{2}|[A-Z]\d|\d[A-Z])[1-9](\d{1,3})?$/, 'Invalid flight number'),
  origin: Yup.string().required('Origin airport is required'),
  destination: Yup.string().required('Destination airport is required'),
  date: Yup.date().required('Departure date is required').min(yesterday, 'Departure date cannot be in the past')
});

export const hotelItemValidation = Yup.object().shape({
  name: Yup.string().required('Hotel name is required'),
  address: Yup.string().required('Hotel address is required'),
  date: Yup.date().required('Check-in date is required').min(yesterday, 'Check-in date cannot be in the past')
});

export const reservationItemValidation = Yup.object().shape({
  name: Yup.string().required('Reservation name is required'),
  address: Yup.string().required('Reservation address is required'),
  date: Yup.date().required('Reservation date is required').min(yesterday, 'Reservation date cannot be in the past')
});

export const eventItemValidation = Yup.object().shape({
  name: Yup.string().required('Event name is required'),
  address: Yup.string().required('Event address is required'),
  date: Yup.date().required('Event date is required').min(yesterday, 'Event date cannot be in the past')
});

export const noteValidation = Yup.object().shape({
  title: Yup.string().required('Title is required'),
  text: Yup.string().required('Text is required')
});

// Sharing

export const articleValidation = Yup.object().shape({
  title: Yup.string().required('Title is required'),
  text: Yup.string().required('Text is required')
});

// Overview

export const pastJourneyValidation = Yup.object().shape({
  title: Yup.string().required('Journey title is required')
});