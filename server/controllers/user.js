// bring in user model
import User from '../data/User';

const userInstance = new User();

export const findUserParcels = (req, res) => {
  userInstance
    .parcels(req.params.id)
    .then(parcels => res.json({ msg: 'user pracles', parcels }))
    .catch(err => res.status(404).json({ msg: 'user not found' }));
};
