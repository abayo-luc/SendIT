import chai from 'chai';
import chaiHTTP from 'chai-http';

// bring in the server
import server from '../../server';
// bring in temporary db
import Parcel from '../../data/Parcel';
import { STATUS_CANCELED } from '../../utils/types';
// bring in parcel model

const should = chai.should();
chai.use(chaiHTTP);

// new parcel instance to be used in testing
const newParcel = new Parcel({
  pickUp: 'Kigali',
  pickUpAddress: 'KG 19 Av 15',
  destination: 'Kigali',
  destinationAddress: 'KG 19 Av 15',
  quantity: 2,
  weight: 4,
  height: 5,
  width: 4,
  length: 5
});
describe('Test Parcel End Point', () => {
  // clearn data before any testing
  beforeEach(() => {
    newParcel.save();
  });
  afterEach(() => {
    new Parcel().clearn();
  });
  /*
    @GET {array} all parcles
   */
  describe('/GET all parcels', () => {
    it('it should return an empty array', (done) => {
      chai
        .request(server)
        .get('/api/v1/parcels')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.parcels.should.be.a('array');
          res.body.parcels.length.should.be.eql(1);
          res.body.should.have.property('msg');
          res.body.msg.should.be.eql('all parcels');
          done();
        });
    });
  });
  /*
    @POST {object} one parcel
   */
  describe('/POST Parcel', () => {
    it('it should create new parcel order', (done) => {
      chai
        .request(server)
        .post('/api/v1/parcels')
        .send(newParcel)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('msg');
          res.body.msg.should.be.a('string');
          res.body.should.have.property('parcel');
          res.body.parcel.should.be.a('object');
          res.body.parcel.should.have.property('createdAt');
          res.body.parcel.should.have.property('id');
          res.body.parcel.should.have.property('status');
          done();
        });
    });
  });
  /*
  *@GET Parcel by Id
  */
  describe('/GET Parcel by ID', () => {
    it('It should return one parcel object', (done) => {
      chai
        .request(server)
        .get('/api/v1/parcels/1')
        .end((req, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('msg');
          res.body.msg.should.be.eql('parcel found');
          res.body.should.have.property('parcel');
          res.body.parcel.should.be.a('object');
          res.body.parcel.should.have.property('createdAt');
          res.body.parcel.should.have.property('id');
          res.body.parcel.should.have.property('status');
          done();
        });
    });
  });
  /*
    @PUT {object} one parcel
   */
  describe('/PUT Parcel', () => {
    it('it should update first parcel order', (done) => {
      chai
        .request(server)
        .put('/api/v1/parcels/1')
        .send({
          pickUp: 'Kigeme',
          pickUpAddress: 'KM 19'
        })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('msg').eql('Purcel updated');
          res.body.msg.should.be.a('string');
          res.body.should.have.property('parcel');
          res.body.parcel.should.be.a('object');
          res.body.parcel.should.have.property('pickUp').eql('Kigeme');
          res.body.parcel.should.have.property('pickUpAddress').eql('KM 19');
          done();
        });
    });
  });

  // @PUT { object } one parcel

  describe('/PUT Parcel', () => {
    it('It should cancle parcel delivery order', (done) => {
      chai
        .request(server)
        .put('/api/v1/parcels/1/cancel')
        .send()
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('msg').eql('Parcel order canceled');
          res.body.msg.should.be.a('string');
          res.body.should.have.property('parcel');
          res.body.parcel.should.be.a('object');
          res.body.parcel.should.have.property('status').eql(STATUS_CANCELED);
          done();
        });
    });
  });
});
