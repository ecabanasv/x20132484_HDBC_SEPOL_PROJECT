const BikeContract = artifacts.require('BikeContract');
const truffleAssert = require('truffle-assertions');

/*
 * uncomment accounts to access the test accounts made available by the
 * Ethereum client
 * See docs: https://www.trufflesuite.com/docs/truffle/testing/writing-tests-in-javascript
 */
contract("BikeContract", function (accounts) {
  it("should assert true", async function () {
    await BikeContract.deployed();
    return assert.isTrue(true);
  });

  /* newBike ("Orbea", "2019", "123123", "-", "Enrique", "ecvoracle@gmail.com") */
  describe("Bike registering", () => {
    it("newBike: Can register bike details", async () => {
      const make = "Orbea";
      const model = "2019";
      const frame = "123123";
      const details = "-";
      const name = "Enrique";
      const email = "ecvoracle@gmail.com";
      const instance = await BikeContract.deployed();
      const bike = await instance.newBike("Orbea", "2019", "123123", "-", "Enrique", "ecvoracle@gmail.com", {from:accounts[0]});
      // test BikeCreated event
      truffleAssert.eventEmitted(bike, 'BikeCreated', (ev) => {
        return ev.make == make && ev.model == model && ev.frame == frame && ev.details == details
      })
      // test OwnerAdded event
      truffleAssert.eventEmitted(bike, 'OwnerAdded', (ev) => {
        return ev.name == name && ev.email == email
      })
    });
  });
});
