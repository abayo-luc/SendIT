import { Router } from 'express';
import user from './user';
import parcel from './parcel';

const routers = Router();

routers.use(user, parcel);

export default routers;
