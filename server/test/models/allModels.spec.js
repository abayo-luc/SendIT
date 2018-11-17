import Parcel from "../../data/Parcel";
import User from "../../data/User";
import Database from "../../data/Data";
//testing framework and assertion lib
import chai from "chai";
const should = chai.should();
describe("Testing all models", () => {
  it("it should return type of Parcel model as an object", () => {
    let newParcel = new Parcel();
    console.log(newParcel.key);
    newParcel.should.be.a("object");
    newParcel.should.have.property("key").eql("parcels");
  });
  it("it should return type of Parcel model as an object", () => {
    let newUser = new User();
    newUser.should.be.a("object");
    newUser.should.have.property("key").eql("users");
  });
  it("it should return type of Database model as an object", () => {
    let newDatabase = new Database("parcels");
    newDatabase.should.be.a("object");
    newDatabase.should.have.property("findAll");
    newDatabase.should.have.property("save");
    newDatabase.should.have.property("update");
    newDatabase.should.have.property("delete");
    newDatabase.should.have.property("clean");
    newDatabase.should.have.property("data");
  });
});
