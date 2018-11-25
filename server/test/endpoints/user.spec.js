import chai from "chai";
import chaiHTTP from "chai-http";
import moment from "moment";
import jwt from "jsonwebtoken";
// bring in server for testing
import server from "../../server";
import { STATUS_INTRANSIT } from "../../utils/types";
import config from "../../config/config.json";
//bring in the db
import db from "../../database";
chai.use(chaiHTTP);
const { should, expect } = chai;
//constant to be used in test
const newUser = {
  email: "me@example.com",
  password:
    "$2b$10$ta8r9yOT8UpGuiauYFIiwecWWSx5jTl.hUFNLd8PUX8u/PPcLQSGe",
  firstName: "John",
  lastName: "Doe",
  isAdmin: true
};
const nonexistingUser = {
  email: "you@example.com",
  password: "password",
  firstName: "John",
  lastName: "Doe",
  isAdmin: true
};
const newParcel = {
  pickupLocation: "Kampala",
  destination: "Kigali",
  destinationAddress: "KG 19 Av 15",
  details: {
    quantity: 8,
    weight: 89
  },
  status: STATUS_INTRANSIT
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
  newUser.isAdmin,
  moment(new Date())
];
const parcelValues = [
  newParcel.pickupLocation,
  newParcel.destination,
  newParcel.details,
  newParcel.pickupLocation,
  STATUS_INTRANSIT,
  1,
  moment(new Date())
];
describe("Testing User End Point", () => {
  // create new parcel instance for testing
  beforeEach(async () => {
    await db
      .query(userCreateQuery, userValues)
      .then(response => {
        return;
      });
  });
  // clearn data before any testing
  afterEach(async () => {
    const truncateQuery = `TRUNCATE users, parcels RESTART IDENTITY CASCADE;`;
    await db.query(truncateQuery).then(response => {
      return;
    });
  });
  describe("/GET users/<existing id>/parcels", () => {
    const token = jwt.sign(
      { id: 1, ...newUser },
      config.secretOrKey
    );
    it("For existing user, it should return array of parcels", done => {
      db.query(parcelCreateQuery, parcelValues)
        .then(response => {
          chai
            .request(server)
            .get(`/api/v1/users/1/parcels`)
            .set("Authorization", `Bearer ${token}`)
            .end((req, res) => {
              res.should.have.status(200);
              res.body.should.be.a("object");
              res.body.should.have.property("parcels");
              res.body.parcels.should.be.a("array");
              res.body.parcels.length.should.be.eql(1);
              done();
            });
        })
        .catch(err => {
          //console.log(err);
          done();
        });
    });

    it("For non existing user, it should return user not found", done => {
      chai
        .request(server)
        .get("/api/v1/users/6000/parcels")
        .set("Authorization", `Bearer ${token}`)
        .end((req, res) => {
          res.should.have.status(404);
          res.body.should.be.a("object");
          res.body.should.have
            .property("status")
            .eql("failed");
          res.body.should.have
            .property("message")
            .eql("user not found");
          done();
        });
    });

    it("For string id, it should be invalid id", done => {
      chai
        .request(server)
        .get("/api/v1/users/1jf/parcels")
        .set("Authorization", `Bearer ${token}`)
        .end((req, res) => {
          res.should.have.status(400);
          res.body.should.be.a("object");
          res.body.should.have
            .property("message")
            .eql("Invalid id");
          done();
        });
    });
  });

  // test new signUp
  describe("/POST users", () => {
    it("/it should create new user", done => {
      chai
        .request(server)
        .post("/api/v1/users")
        .send(nonexistingUser)
        .end((req, res) => {
          res.should.have.status(201);
          res.body.should.be.a("object");
          res.body.should.have
            .property("status")
            .eql("success");
          res.body.should.have.property("user");
          res.body.user.should.be.a("object");
          res.body.user.should.have.property("first_name");
          res.body.user.should.have.property("last_name");
          res.body.user.should.have.property("email");
          res.body.user.should.have.property("id");
          expect(res.body.user).to.not.have.property(
            "password"
          );
          res.body.user.should.have
            .property("is_admin")
            .eql(false);
          done();
        });
    });
    it("/it should not create new user as user already exist", done => {
      chai
        .request(server)
        .post("/api/v1/users")
        .send(newUser)
        .end((req, res) => {
          res.should.have.status(400);
          res.body.should.be.a("object");
          res.body.should.have
            .property("message")
            .eql("User already exist");
          done();
        });
    });

    it("/it should not create user with missing attributes", done => {
      chai
        .request(server)
        .post("/api/v1/users")
        .send({})
        .end((req, res) => {
          res.should.have.status(400);
          res.body.should.be.a("object");
          res.body.should.have.property("errors");
          res.body.should.have
            .property("status")
            .eql("failed");
          res.body.errors.should.be.a("object");
          res.body.errors.should.have.property("firstName");
          res.body.errors.should.have.property("lastName");
          res.body.errors.should.have.property("email");
          res.body.errors.should.have.property("password");
          done();
        });
    });
  });

  // test user authentication end point
  describe("/POST login", () => {
    it("it should login user sucessfully", done => {
      chai
        .request(server)
        .post("/api/v1/login")
        .send({
          email: "me@example.com",
          password: "password"
        })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have
            .property("status")
            .eql("success");
          res.body.should.have.property("token");
          done();
        });
    });
    //existing user with invalid password
    it("Invalid password should fail", done => {
      chai
        .request(server)
        .post("/api/v1/login")
        .send({
          email: "me@example.com",
          password: "lkdjfljlkj"
        })
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a("object");
          res.body.should.have
            .property("message")
            .eql("Invalid email or password");
          done();
        });
    });
    // un existing user case
    it("Un-existing user should be not found", done => {
      chai
        .request(server)
        .post("/api/v1/login")
        .send({
          email: nonexistingUser.email,
          password: nonexistingUser.password
        })
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should
            .property("message")
            .eql("User not found");
          done();
        });
    });
    it("should show the current loggedin user", done => {
      const token = jwt.sign(
        { id: 1, ...newUser },
        config.secretOrKey
      );
      chai
        .request(server)
        .get("/api/v1/current")
        .set("Authorization", `Bearer ${token}`)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.a("object");
          expect(res.body.user).to.have.property(
            "first_name"
          );
          expect(res.body.user).to.have.property(
            "last_name"
          );
          expect(res.body.user).to.have.property("email");
          expect(res.body.user).to.have.property(
            "is_admin"
          );
          expect(res.body.user).to.not.have.property(
            "password"
          );
          done();
        });
    });
  });
});
