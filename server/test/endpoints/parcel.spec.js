import chai from "chai";
import chaiHTTP from "chai-http";
import jwt from "jsonwebtoken";
import moment from "moment";
import config from "../../config/config.json";
// bring in the server
import server from "../../server";
//bring in the db
import db from "../../database";
import {
  STATUS_CANCELED,
  STATUS_INTRANSIT
} from "../../utils/types";
// bring in parcel model

const should = chai.should();
chai.use(chaiHTTP);

// // new parcel instance to be used in testing
const newParcel = {
  pickupAddress: "KG 19 Av 15",
  destination: "Kigali",
  destinationAddress: "KG 19 Av 15",
  quantity: 2,
  weight: 4,
  status: STATUS_INTRANSIT
};
//user
const newUser = {
  email: "parcel@example.com",
  password:
    "$2b$10$ta8r9yOT8UpGuiauYFIiwecWWSx5jTl.hUFNLd8PUX8u/PPcLQSGe",
  firstName: "John",
  lastName: "Doe",
  isAdmin: true
};

const parcelCreateQuery = `
    INSERT INTO parcels(  
        pickup_location, 
        destination, 
        details, 
        current_location, 
        status,
        user_id,
        created_at)
    VALUES($1, $2, $3, $4, $5, $6, $7)
    returning *
    `;
const parcelValues = [
  newParcel.pickupLocation || "Kigali",
  newParcel.destination,
  {
    weight: newParcel.weight,
    quantity: newParcel.quantity
  },
  newParcel.pickupLocation,
  STATUS_INTRANSIT,
  1,
  moment(new Date())
];
const userCreateQuery = `
    INSERT INTO users(first_name, last_name, email, password,is_admin, created_at)
    VALUES($1, $2, $3, $4, $5, $6)
    returning *
    `;
const userValues = [
  newUser.firstName,
  newUser.lastName,
  newUser.email,
  newUser.password,
  true,
  moment(new Date())
];

describe("Test Parcel End Point", () => {
  // clearn data before any testing
  beforeEach(async () => {
    await db
      .query(userCreateQuery, userValues)
      .then(response => {
        const payload = { ...response[0] };
        payload.should.have.property("email");
        payload.should.have.property("password");
      });
  });
  afterEach(async () => {
    const truncateQuery = `TRUNCATE users, parcels RESTART IDENTITY CASCADE;`;
    await db.query(truncateQuery).then(response => {
      return;
    });
  });

  /*
   @GET {array} all parcles
   */
  describe("/GET all parcels", () => {
    const token = jwt.sign(
      { id: 1, ...newUser },
      config.secretOrKey
    );
    it("it should return an empty array", done => {
      chai
        .request(server)
        .get("/api/v1/parcels")
        .set("Authorization", `Bearer ${token}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.parcels.should.be.a("array");
          res.body.parcels.length.should.be.eql(0);
          done();
        });
    });

    it("Unauthorized user shouldn't access", done => {
      const token = jwt.sign(
        { id: 2, ...newUser },
        config.secretOrKey
      );
      chai
        .request(server)
        .get("/api/v1/parcels")
        .set("Authorization", `Bearer ${token}`)
        .end((err, res) => {
          res.should.have.status(401);
          // res.body.should.be.a("object");
          // res.body.should.have.property("message");
          done();
        });
    });
  });
  /*
   @POST {object} one parcel
   */
  describe("/POST Parcel", () => {
    const token = jwt.sign(
      { id: 1, ...newUser },
      config.secretOrKey
    );
    it("it should not create new parcel order", done => {
      chai
        .request(server)
        .post("/api/v1/parcels")
        .set("Authorization", `Bearer ${token}`)
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
    //create parcel successful
    it("it should create new parcel order", done => {
      chai
        .request(server)
        .post("/api/v1/parcels")
        .send({ ...newParcel, pickupLocation: "Kigali" })
        .set("Authorization", `Bearer ${token}`)
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.have
            .property("status")
            .eql("success");
          res.body.should.have.property("parcel");
          res.body.parcel.should.be.a("object");
          res.body.parcel.should.have.property(
            "created_at"
          );
          res.body.parcel.should.have.property("id");
          res.body.parcel.should.have
            .property("status")
            .eql(STATUS_INTRANSIT);
          res.body.parcel.should.have.property("user_id");
          res.body.parcel.should.have.property(
            "destination"
          );
          res.body.parcel.should.have.property(
            "pickup_location"
          );
          res.body.parcel.should.have.property(
            "current_location"
          );
          done();
        });
    });
  });
  /*
   *@GET Parcel by Id
   */
  describe('"/GET Parcel by ID"', () => {
    const token = jwt.sign(
      { id: 1, ...newUser },
      config.secretOrKey
    );
    it("It should return one parcel object", done => {
      db.query(parcelCreateQuery, parcelValues).then(
        response => {
          chai
            .request(server)
            .get(`/api/v1/parcels/${response[0].id}`)
            .set("Authorization", `Bearer ${token}`)
            .end((req, res) => {
              res.should.have.status(200);
              res.body.should.be.a("object");
              res.body.should.have
                .property("status")
                .eql("success");
              res.body.should.have.property("parcel");
              res.body.parcel.should.be.a("object");
              res.body.parcel.should.have.property(
                "created_at"
              );
              res.body.parcel.should.have.property("id");
              res.body.parcel.should.have.property(
                "status"
              );
              done();
            });
        }
      );
    });
    it("should admin access parcel creted by other user", done => {
      const userValues = [
        "A",
        "B",
        "a@gmail.com",
        "pwd",
        false,
        moment(new Date())
      ];
      db.query(userCreateQuery, userValues)
        .then(user => {
          //console.log(user);
          const values = [...parcelValues];
          values[5] = user[0].id;
          db.query(parcelCreateQuery, values).then(
            parcel => {
              chai
                .request(server)
                .get(`/api/v1/parcels/${parcel[0].id}`)
                .set("Authorization", `Bearer ${token}`)
                .end((err, res) => {
                  res.should.have.status(200);
                  res.body.should.be.a("object");
                  res.body.should.have
                    .property("status")
                    .eql("success");
                  res.body.should.have.property("parcel");
                  done();
                });
            }
          );
        })
        .catch(err => {
          console.log(err);
          done();
        });
    });
    it("It should not return a parcel object", done => {
      chai
        .request(server)
        .get("/api/v1/parcels/198")
        .set("Authorization", `Bearer ${token}`)
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
    const token = jwt.sign(
      { id: 1, ...newUser },
      config.secretOrKey
    );
    it("it should update first parcel", done => {
      db.query(parcelCreateQuery, parcelValues).then(
        response => {
          chai
            .request(server)
            .put(`/api/v1/parcels/${response[0].id}`)
            .send({
              destination: "New York",
              destinationAddress: "KY 19 AV"
            })
            .set("Authorization", `Bearer ${token}`)
            .end((err, res) => {
              res.should.have.status(201);
              res.body.should.have
                .property("status")
                .eql("success");
              res.body.should.have.property("parcel");
              res.body.parcel.should.be.a("object");
              res.body.parcel.should.have
                .property("destination")
                .eql("New York");
              res.body.parcel.should.have.property(
                "address"
              );
              res.body.parcel.address.should.be.a("object");
              res.body.parcel.address.should.have
                .property("destination_address")
                .eql("KY 19 AV");
              done();
            });
        }
      );
    });
  });
  // @PUT { object } one parcel
  describe("/PUT cancel parcel", () => {
    const token = jwt.sign(
      { id: 1, ...newUser },
      config.secretOrKey
    );
    it("It should cancle parcel delivery order", done => {
      db.query(parcelCreateQuery, parcelValues).then(
        response => {
          chai
            .request(server)
            .put(`/api/v1/parcels/${response[0].id}/cancel`)
            .send()
            .set("Authorization", `Bearer ${token}`)
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
        }
      );
    });
    it("It should not found a parcel order", done => {
      chai
        .request(server)
        .put("/api/v1/parcels/1909b/cancel")
        .send()
        .set("Authorization", `Bearer ${token}`)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have
            .property("message")
            .eql("Invalid id");
          done();
        });
    });
  });
});
