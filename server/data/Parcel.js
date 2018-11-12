import Database from './Data';
import { STATUS_INTRANSIT } from '../utils/types';

export default class Parcel extends Database {
  constructor() {
    super('parcels');
  }
}
