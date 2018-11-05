import chai from 'chai';
import chaiHTTP from 'chai-http';

// bring in the server
import server from '../../server';

const should = chai.should();
chai.use(chaiHTTP);
