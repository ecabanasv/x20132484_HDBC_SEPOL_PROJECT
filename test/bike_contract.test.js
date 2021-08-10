const BikeContract = artifacts.require("BikeContract");
const { assert } = require("chai");
const truffleAssert = require("truffle-assertions");

/*
 * uncomment accounts to access the test accounts made available by the
 * Ethereum client
 * See docs: https://www.trufflesuite.com/docs/truffle/testing/writing-tests-in-javascript
 */
contract("BikeContract", function (accounts) {
  /* newBike ("Orbea", "2019", "123123", "Enrique", "ecvoracle@gmail.com") */
  describe("@ Bike registering", () => {
    it("it should register bike and owner details", async () => {
      const make = "Orbea";
      const model = "2019";
      const frame = "123123";
      const name = "Enrique";
      const email = "ecvoracle@gmail.com";
      const instance = await BikeContract.deployed();
      const bike = await instance.newBike(
        "Orbea",
        "2019",
        "123123",
        "Enrique",
        "ecvoracle@gmail.com",
        { from: accounts[0] }
      );
      // test BikeCreated event
      truffleAssert.eventEmitted(bike, "BikeCreated", (ev) => {
        return ev.make == make && ev.model == model && ev.frame == frame;
      });
      // test OwnerAdded event
      truffleAssert.eventEmitted(bike, "OwnerAdded", (ev) => {
        return ev.name == name && ev.email == email;
      });
    });
  });
  describe("@ Bike and owner listing", () => {
    /* showListBikeDetails */
    it("it should show the list of bikes registered", async () => {
      const instance = await BikeContract.deployed();
      const bike1 = await instance.newBike(
        "Orbea",
        "2019",
        "123123",
        "Enrique",
        "ecvoracle@gmail.com",
        { from: accounts[0] }
      );
      const bike2 = await instance.newBike(
        "Carrefour",
        "2016",
        "892342",
        "Juan",
        "juan@gmail.com",
        { from: accounts[0] }
      );
      const bike3 = await instance.newBike(
        "Nike",
        "2010",
        "312456",
        "Pepe",
        "pepe@gmail.com",
        { from: accounts[0] }
      );
      const bike4 = await instance.newBike(
        "Adidas",
        "2004",
        "345345",
        "Luis",
        "luis@gmail.com",
        { from: accounts[0] }
      );
      const bikeList = await instance.showListBikeDetails();
      //Bike 1: Orbea
      assert.equal(bikeList[1][2], "Orbea");
      //Bike 2: 2016
      assert.equal(bikeList[2][3], "2016");
      //Bike 3: 312456
      assert.equal(bikeList[3][4], "312456");
      //Bike 4: -
      assert.equal(bikeList[4][2], "Adidas");
    });
    /* showBikeDetails */

    it("it should show a specific bike registered", async () => {
      const instance = await BikeContract.deployed();
      //Get bike 1 result
      const result = await instance.showBikeDetails(0);
      //Bike 1: Orbea
      assert.equal(result[1], "Orbea");
      //Bike 1: 2019
      assert.equal(result[2], "2019");
      //Bike 1: 123123
      assert.equal(result[3], "123123");
    });
  });

  describe("@ Owner functions", () => {
    /* showOwnerDetails */
    it("it should show a specific owner registered", async () => {
      const instance = await BikeContract.deployed();
      //Show owner (0)
      const result = await instance.showOwnerDetails(0);
      //Owner 1: Rafael
      assert.equal(result[0], "Enrique");
      //Owner 1: rafael@gmail.com
      assert.equal(result[1], "ecvoracle@gmail.com");
    });
  });

  describe("@ Add details, transferOwnership and renounceOwnership functions", () => {
    /* addDetails */
    it("it should add details for an specific bike", async () => {
      const bike_id = 1;
      const detail_string = "Replaced brakes";
      const instance = await BikeContract.deployed();
      const detail = await instance.addDetails(bike_id, detail_string, {
        from: accounts[0],
      });
      // test detailsAdded event
      truffleAssert.eventEmitted(detail, "detailsAdded", (ev) => {
        return ev.id == bike_id && ev.details == detail_string;
      });
    });

    /* transferOwnership */
    it("it should transfer ownership to future owner", async () => {
      const instance = await BikeContract.deployed();
      await instance.transferOwnership(
        1,
        "0x1A771540337888ADBb230f310ca442bA8B7E01aE",
        "Roberto",
        "roberto@gmail.com",
        { from: accounts[0] }
      );
      const bikeList = await instance.showListBikeDetails();
      //Check Bike 1 address
      assert.equal(
        bikeList[1][5],
        "0x1A771540337888ADBb230f310ca442bA8B7E01aE"
      );
    });

    /* renounceOwnership */
    it("it should renounce its bike ownership", async () => {
      const instance = await BikeContract.deployed();
      await instance.renounceOwnership(1, { from: accounts[0] });
      const bikeList = await instance.showListBikeDetails();
      //Check Bike 1 address
      assert.equal(
        bikeList[1][5],
        "0x0000000000000000000000000000000000000000"
      );
    });
  });
});
