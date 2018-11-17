import Parcel from "../../data/Parcel";
import User from "../../data/User";
import DataModel from "../../data/Data";
import data from "../../data/data.json";
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
  it("it should return type of DataModel model as an object", () => {
    let newDataModel = new DataModel("parcels");
    newDataModel.should.be.a("object");
    newDataModel.should.have.property("findAll");
    newDataModel.should.have.property("save");
    newDataModel.should.have.property("update");
    newDataModel.should.have.property("delete");
    newDataModel.should.have.property("clean");
    newDataModel.should.have.property("data");
  });
  it("it should test the json data", () => {
    data.should.be.an("object");
    data.should.have.property("parcels");
    data.should.have.property("users");
  });
});
