import chai from 'chai';
import chaiHTTP from 'chai-http';

// bring in the server
import server from '../../server';
// bring in parcel model
import parcel from '../../data/parcels';

const should = chai.should();
chai.use(chaiHTTP);

describe('Test Parcel End Point', () => {
  // clearn data before any testing
  beforeEach(() => {
    parcel.length = 0;
  });
  describe('/GET all parcels', () => {
    it('it should return an empty array', (done) => {
      chai
        .request(server)
        .get('/api/v1/parcels')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.parcels.should.be.a('array');
          res.body.parcels.length.should.be.eql(0);
          res.body.should.have.property('msg');
          res.body.msg.should.be.eql('all parcels');
          done();
        });
    });
  });
});
