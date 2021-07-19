const BikeContract = artifacts.require('BikeContract');
const { assert } = require('chai');
const truffleAssert = require('truffle-assertions');

/*
 * uncomment accounts to access the test accounts made available by the
 * Ethereum client
 * See docs: https://www.trufflesuite.com/docs/truffle/testing/writing-tests-in-javascript
 */
contract("BikeContract", function (accounts) {
  /* newBike ("Orbea", "2019", "123123", "-", "Enrique", "ecvoracle@gmail.com") */
  describe("@ Bike registering", () => {
    it("newBike: Can register bike and owner details", async () => {
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
  describe("@ Bike and owner listing", () => {
    /* showListBikeDetails */
    it("showListBikeDetails: Can show the list of bikes registered", async () => {
      const instance = await BikeContract.deployed();
      const bike1 = await instance.newBike("Orbea", "2019", "123123", "-", "Enrique", "ecvoracle@gmail.com", {from:accounts[0]});
      const bike2 = await instance.newBike("Carrefour", "2016", "892342", "-", "Juan", "juan@gmail.com", {from:accounts[0]});
      const bike3 = await instance.newBike("Nike", "2010", "312456", "-", "Pepe", "pepe@gmail.com", {from:accounts[0]});
      const bike4 = await instance.newBike("Adidas", "2004", "345345", "-", "Luis", "luis@gmail.com", {from:accounts[0]});
      const bikeList = await instance.showListBikeDetails();
      //Bike 1: Orbea
      assert.equal(bikeList[1][1], "Orbea");
      //Bike 2: 2016
      assert.equal(bikeList[2][2], "2016");
      //Bike 3: 312456
      assert.equal(bikeList[3][3], "312456");
      //Bike 4: -
      assert.equal(bikeList[4][4], "-");
    });
  });

  /* showBikeDetails */

  it("showBikeDetails: Can show a specific bike registered", async () => {});
  describe("@ Owner functions", () => {
    /* _newOwner */
  
    it("_newOwner: Can register new owner", async () => {});
  
    /* updateOwner */
  
    it("updateOwner: Can update a specific registered owner", async () => {});
  
    /* showListOwnerDetails */
  
    it("showListOwnerDetails: Can show a specific owners registered", async () => {});
  
    /* showListOwnerDetails */
  
    it("showListOwnerDetails: Can show the list of owners registered", async () => {});
  
    /* showOwnerDetails */
  
    it("showOwnerDetails: Can show a specific owner registered", async () => {});
    });
  
  describe("@ Add details, transferOwnership and renounceOwnership functions", () => {
    /* addDetails */
  
    it("addDetails: Can update bike details", async () => {});
  
    /* transferOwnership */
  
    it("transferOwnership: Can transfer ownership to future owner", async () => {});
  
    /* renounceOwnership */
  
    it("renounceOwnership: User can renounce its bike ownership", async () => {});
  });
});
