const ownerDetails = artifacts.require("ownerDetails");

/*
 * uncomment accounts to access the test accounts made available by the
 * Ethereum client
 * See docs: https://www.trufflesuite.com/docs/truffle/testing/writing-tests-in-javascript
 */
contract("ownerDetails", function (/* accounts */) {
  it("should assert true", async function () {
    await ownerDetails.deployed();
    return assert.isTrue(true);
  });
});
