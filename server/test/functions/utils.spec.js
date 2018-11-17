import assert from "assert";
import chai from "chai";
// functions for testing
import {
  isEmpty,
  isInteger
} from "../../utils/validatorHelpers";
import { findIndex } from "../../utils/queryHelper";
// bring in dammy data
import { data } from "../../utils/damies";

const should = chai.should();
// bring ing testing frameworkg
describe("/UTILS functions ", () => {
  describe("func isEmpty() for checking an empty string, empty object, null, or undefined", () => {
    it("it should return a boolean: true", () => {
      assert.ok(isEmpty(""));
      assert.ok(isEmpty({}));
      assert.ok(isEmpty(null));
      assert.ok(isEmpty(undefined));
    });
  });

  describe("func findIndex() for an array containing parcels", () => {
    it("it should return an inteer or null", () => {
      findIndex(data.parcels, 1).should.equal(0);
      should.equal(findIndex(data.parcels, 4000), null);
    });
  });

  describe("func isInteger() a given", () => {
    it("it should return either true or false", () => {
      assert.ok(isInteger(7));
      assert.ok(!isInteger(300 ** 400));
    });
  });
});
