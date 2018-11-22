import chai from "chai";
import chaiHTTP from "chai-http";
import moment from "moment";
// bring in server for testing
import server from "../../server";
import { STATUS_INTRANSIT } from "../../utils/types";
//bring in the db
import db from "../../database";
chai.use(chaiHTTP);

//constant to be used in test
const newUser = {
  email: "me@example.com",
  password:
    "$2b$10$ta8r9yOT8UpGuiauYFIiwecWWSx5jTl.hUFNLd8PUX8u/PPcLQSGe",
  firstName: "John",
  lastName: "Doe"
};
const nonexistingUser = {
  email: "you@example.com",
  password: "password",
  firstName: "John",
  lastName: "Doe"
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
    INSERT INTO users(first_name, last_name, email, password, created_at)
    VALUES($1, $2, $3, $4, $5)
    returning *
    `;
const userValues = [
  newUser.firstName,
  newUser.lastName,
  newUser.email,
  newUser.password,
  moment(new Date())
];
describe("Testing User End Point", () => {
  // create new parcel instance for testing
  // clearn data before any testing
  afterEach(async () => {
    const truncateQuery = `TRUNCATE users, parcels RESTART IDENTITY CASCADE;`;
    await db.query(truncateQuery).then(response => {
      return;
    });
  });
  describe("/GET users/<existing id>/parcels", () => {
    it("it should return an array with one element", done => {
      db.query(userCreateQuery, userValues).then(
        userRes => {
          const parcelValues = [
            newParcel.pickupLocation,
            newParcel.destination,
            newParcel.details,
            newParcel.pickupLocation,
            STATUS_INTRANSIT,
            userRes[0].id,
            moment(new Date())
          ];
          db.query(parcelCreateQuery, parcelValues)
            .then(response => {
              chai
                .request(server)
                .get(
                  `/api/v1/users/${userRes[0].id}/parcels`
                )
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
              console.log(err);
              done();
            });
        }
      );
    });
  });

  describe("/GET users/<non existing id>/parcels", () => {
    it("it should return an empty array", done => {
      chai
        .request(server)
        .get("/api/v1/users/6000/parcels")
        .end((req, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have.property("parcels");
          res.body.parcels.should.be.a("array");
          res.body.parcels.length.should.be.eql(0);
          done();
        });
    });
  });
  describe("/GET users/<non integer id>/parcels", () => {
    it("it should not find a user", done => {
      chai
        .request(server)
        .get("/api/v1/users/1jf/parcels")
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
            .property("message")
            .eql("success");
          res.body.should.have.property("user");
          res.body.user.should.be.a("object");
          res.body.user.should.have.property("first_name");
          res.body.user.should.have.property("last_name");
          res.body.user.should.have.property("email");
          res.body.user.should.have.property("id");
          res.body.user.should.have
            .property("is_admin")
            .eql(false);
          done();
        });
    });
    it("/it should not create new user as user already exist", done => {
      db.query(userCreateQuery, userValues)
        .then(response => {
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
        })
        .catch(err => {
          console.log("errors");
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
            .property("message")
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
      db.query(userCreateQuery, userValues)
        .then(userRes => {
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
                .property("message")
                .eql("success");
              res.body.should.have.property("token");
              done();
            });
        })
        .catch(err => {
          console.log(err);
          done();
        });
    });
    //existing user with invalid password
    describe("/POST login", () => {
      it("Invalid password should fail", done => {
        db.query(userCreateQuery, userValues)
          .then(userRes => {
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
          })
          .catch(err => {
            console.log(err);
            done();
          });
      });
    });
    // un existing user case
    it("Un-existing user should be not found", done => {
      chai
        .request(server)
        .post("/api/v1/login")
        .send({ email: "me@example.com", password: "112" })
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should
            .property("message")
            .eql("User not found");
          done();
        });
    });
  });
});
