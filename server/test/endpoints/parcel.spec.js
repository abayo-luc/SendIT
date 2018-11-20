import chai from "chai";
import chaiHTTP from "chai-http";

// bring in the server
import server from "../../server";
// bring in temporary db
import Parcel from "../../data/Parcel";
import {
  STATUS_CANCELED,
  STATUS_INTRANSIT
} from "../../utils/types";
// bring in parcel model

const should = chai.should();
chai.use(chaiHTTP);

// new parcel instance to be used in testing
const newParcel = {
  pickupAddress: "KG 19 Av 15",
  destination: "Kigali",
  destinationAddress: "KG 19 Av 15",
  quantity: 2,
  weight: 4,
  height: 5,
  width: 4,
  length: 5,
  status: STATUS_INTRANSIT
};
describe("Test Parcel End Point", () => {
  // clearn data before any testing
  beforeEach(() => {
    new Parcel().save(newParcel);
  });
  afterEach(() => {
    new Parcel().clean();
  });
  /*
    @GET {array} all parcles
   */
  describe("/GET all parcels", () => {
    it("it should return an empty array", done => {
      chai
        .request(server)
        .get("/api/v1/parcels")
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.parcels.should.be.a("array");
          res.body.parcels.length.should.be.eql(1);
          res.body.should.have
            .property("status")
            .eql("success");
          done();
        });
    });
  });
  /*
    @POST {object} one parcel
   */
  describe("/POST Parcel", () => {
    it("it should not create new parcel order", done => {
      chai
        .request(server)
        .post("/api/v1/parcels")
        .send(newParcel)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have
            .property("status")
            .eql("failed");
          res.body.should.have.property("errors");
          res.body.errors.should.be.a("object");
          done();
        });
    });
  });
  describe("/POST Parcel", () => {
    it("it should create new parcel order", done => {
      chai
        .request(server)
        .post("/api/v1/parcels")
        .send({ ...newParcel, pickupLocation: "Kigali" })
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.have
            .property("status")
            .eql("success");
          res.body.should.have.property("parcel");
          res.body.parcel.should.be.a("object");
          res.body.parcel.should.have.property("createdAt");
          res.body.parcel.should.have.property("id");
          res.body.parcel.should.have.property("status");
          res.body.parcel.should.have.property("userId");
          done();
        });
    });
  });
  /*
   *@GET Parcel by Id
   */
  describe("/GET Parcel by ID", () => {
    it("It should return one parcel object", done => {
      chai
        .request(server)
        .get("/api/v1/parcels/1")
        .end((req, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have
            .property("status")
            .eql("success");
          res.body.should.have.property("parcel");
          res.body.parcel.should.be.a("object");
          res.body.parcel.should.have.property("createdAt");
          res.body.parcel.should.have.property("id");
          res.body.parcel.should.have.property("status");
          done();
        });
    });
  });
  /*
   *@GET Parcel by Id
   */
  describe("/GET Parcel by ID", () => {
    it("It should not return a parcel object", done => {
      chai
        .request(server)
        .get("/api/v1/parcels/198")
        .end((req, res) => {
          res.should.have.status(404);
          res.body.should.be.a("object");
          res.body.should.have
            .property("message")
            .eql("Parcel not found");
          done();
        });
    });
  });
  /*
    @PUT {object} one parcel
   */
  describe("/PUT Parcel update", () => {
    it("it should update first parcel order", done => {
      chai
        .request(server)
        .put("/api/v1/parcels/1")
        .send({
          pickUp: "Kigeme",
          pickUpAddress: "KM 19"
        })
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.have
            .property("status")
            .eql("success");
          res.body.should.have.property("parcel");
          res.body.parcel.should.be.a("object");
          res.body.parcel.should.have
            .property("pickUp")
            .eql("Kigeme");
          res.body.parcel.should.have
            .property("pickUpAddress")
            .eql("KM 19");
          done();
        });
    });
  });

  // @PUT { object } one parcel

  describe("/PUT cancel parcel", () => {
    it("It should cancle parcel delivery order", done => {
      chai
        .request(server)
        .put("/api/v1/parcels/1/cancel")
        .send()
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.have
            .property("status")
            .eql("success");
          res.body.should.have.property("parcel");
          res.body.parcel.should.be.a("object");
          res.body.parcel.should.have
            .property("status")
            .eql(STATUS_CANCELED);
          done();
        });
    });
  });

  // @PUT { object } one parcel

  describe("/PUT Parcel", () => {
    it("It should not found a parcel order", done => {
      chai
        .request(server)
        .put("/api/v1/parcels/1909b/cancel")
        .send()
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.have
            .property("status")
            .eql("failed");
          res.body.should.have
            .property("message")
            .eql("Parcel not found");
          done();
        });
    });
  });
});
