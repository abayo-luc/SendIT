import chai from "chai";
import db from "../../database";

const { should } = chai;

describe("Testing db", () => {
  describe("/Create test table", () => {
    it("It should create one test table", done => {
      const queryText = `CREATE TABLE IF NOT EXISTS test( id SERIAL)`;
      db.createTable(queryText)
        .then(response => {
          response.should.have
            .property("command")
            .eql("CREATE");
          response.should.have
            .property("rowCount")
            .eql(null);
          done();
        })
        .catch(err => {
          console.log(err);
          done();
        });
    });

    it("It should drop table test", done => {
      const queryText = "DROP TABLE IF EXISTS test";
      db.query(queryText)
        .then(response => {
          response.should.be.a("array");
          response.length.should.be.eql(0);
          done();
        })
        .catch(err => {
          done();
        });
    });
  });
});
