// bring in validator functions
import { createParcelValidator } from "../../validations/parcelsValidations";

describe("Testing Validators", () => {
  describe("Testing ParcelCreate Validators", () => {
    it("It should either be valid or not, and if it is not valid it should return errors", () => {
      createParcelValidator({}).should.have.property(
        "errors"
      );
      createParcelValidator({}).errors.should.be.a(
        "object"
      );
      createParcelValidator({})
        .should.have.property("isValid")
        .eql(false);
      createParcelValidator({}).errors.should.have.property(
        "pickupLocation"
      );
      createParcelValidator({}).errors.should.have.property(
        "destination"
      );
      createParcelValidator({}).errors.should.have.property(
        "quantity"
      );
      createParcelValidator({}).errors.should.have.property(
        "weight"
      );
    });
  });
});
