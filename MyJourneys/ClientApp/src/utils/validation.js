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