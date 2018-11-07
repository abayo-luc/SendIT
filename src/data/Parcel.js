import Database from './Data';
import { STATUS_INTRANSIT } from '../utils/types';

export default class Parcel extends Database {
  constructor({
    pickupLocation,
    pickupAddress,
    destination,
    destinationAddress,
    quantity,
    weight,
    height,
    width,
    length
  } = {}) {
    super('parcels');
    this.pickupLocation = pickupLocation;
    this.pickAddress = pickupAddress;
    this.destination = destination;
    this.destinationAddress = destinationAddress;
    this.quantity = quantity;
    this.weight = weight;
    this.height = height;
    this.width = width;
    this.length = length;
    this.status = STATUS_INTRANSIT;
  }
}
