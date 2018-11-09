import chai from 'chai';
import chaiHTTP from 'chai-http';
// bring in server for testing
import server from '../../server';
import { STATUS_INTRANSIT } from '../../utils/types';
// bring in model
import Parcel from '../../data/Parcel';
import User from '../../data/User';

chai.use(chaiHTTP);
const newUser = {
  email: 'me@example.com',
  password: 'password'
};
const newParcel = {
  pickupAddress: 'KG 19 Av 15',
  destination: 'Kigali',
  destinationAddress: 'KG 19 Av 15',
  quantity: 2,
  weight: 4,
  height: 5,
  width: 4,
  length: 5,
  status: STATUS_INTRANSIT
};
describe('Testing User End Point', () => {
  // create new parcel instance for testing
  beforeEach(async () => {
    const user = await new User().save(newUser);
    await new Parcel().save({ ...newParcel, userId: user.id });
  });
  // clearn data before any testing
  afterEach(() => {
    new Parcel().clearn();
    new User().clearn();
  });
  describe('/GET users/<existing id>/parcels', () => {
    it('it should return an array with one element', (done) => {
      chai
        .request(server)
        .get('/api/v1/users/1/parcels')
        .end((req, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('parcels');
          res.body.parcels.should.be.a('array');
          res.body.parcels.length.should.be.eql(1);
          done();
        });
    });
  });

  describe('/GET users/<non existing id>/parcels', () => {
    it('it should return an empty array', (done) => {
      chai
        .request(server)
        .get('/api/v1/users/6000/parcels')
        .end((req, res) => {
          res.should.have.status(404);
          res.body.should.be.a('object');
          res.body.should.have.property('msg').eql('user not found');
          done();
        });
    });
  });
  describe('/GET users/<non integer id>/parcels', () => {
    it('it should not find a user', (done) => {
      chai
        .request(server)
        .get('/api/v1/users/1jf/parcels')
        .end((req, res) => {
          res.should.have.status(404);
          res.body.should.be.a('object');
          res.body.should.have.property('msg').eql('user not found');
          done();
        });
    });
  });
});
