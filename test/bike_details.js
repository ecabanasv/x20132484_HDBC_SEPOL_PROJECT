const bikeDetails = artifacts.require("bikeDetails");

/*
 * uncomment accounts to access the test accounts made available by the
 * Ethereum client
 * See docs: https://www.trufflesuite.com/docs/truffle/testing/writing-tests-in-javascript
 */
contract("bikeDetails", function (/* accounts */) {
  it("should assert true", async function () {
    await bikeDetails.deployed();
    return assert.isTrue(true);
  });
});
