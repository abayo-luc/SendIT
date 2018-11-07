import { isEmpty, isInteger } from '../utils/validatorHelpers';

export const createParcelValidator = (data) => {
  const errors = {};
  data.weight = !isEmpty(data.weight) ? parseInt(data.weight, 10) : null;
  data.quantity = !isEmpty(data.quantity) ? parseInt(data.quantity, 10) : null;

  if (isEmpty(data.pickupLocation)) {
    errors.pickupLocation = 'Pickup location location is required';
  }
  if (isEmpty(data.destination)) {
    errors.destination = 'Destination is required';
  }
  if (!isInteger(data.quantity)) {
    errors.quantity = 'Quanity shuld be a postive integer';
  }
  if (isEmpty(data.quantity)) {
    errors.quantity = 'Quantity is required';
  }
  if (!isInteger(data.weight)) {
    errors.weight = 'Weight should be a positive integer';
  }
  if (isEmpty(data.weight)) {
    errors.weight = 'Weight is required ';
  }
  return {
    errors,
    isValid: isEmpty(errors)
  };
};
