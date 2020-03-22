import * as Yup from 'yup';
import moment from "moment";

const yesterday = moment().subtract(1, 'days').toDate();

export const journeyValidation = Yup.object().shape({
  location: Yup.string().required('Location name is required'),
  startDate: Yup.date().required('Start date is required').min(yesterday, 'Start date cannot be in the past')
    .max(Yup.ref('endDate'), 'Start date should be before end date'),
  endDate: Yup.date().required('End date is required')
    .min(Yup.ref('startDate'), 'End date should be after start date')
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