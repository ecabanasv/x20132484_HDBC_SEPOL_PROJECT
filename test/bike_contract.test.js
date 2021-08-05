const BikeContract = artifacts.require("BikeContract");
const { assert } = require("chai");
const truffleAssert = require("truffle-assertions");

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
      const bike = await instance.newBike(
        "Orbea",
        "2019",
        "123123",
        "-",
        "Enrique",
        "ecvoracle@gmail.com",
        { from: accounts[0] }
      );
      // test BikeCreated event
      truffleAssert.eventEmitted(bike, "BikeCreated", (ev) => {
        return (
          ev.make == make &&
          ev.model == model &&
          ev.frame == frame &&
          ev.details == details
        );
      });
      // test OwnerAdded event
      truffleAssert.eventEmitted(bike, "OwnerAdded", (ev) => {
        return ev.name == name && ev.email == email;
      });
    });
  });
  describe("@ Bike and owner listing", () => {
    /* showListBikeDetails */
    it("showListBikeDetails: Can show the list of bikes registered", async () => {
      const instance = await BikeContract.deployed();
      const bike1 = await instance.newBike(
        "Orbea",
        "2019",
        "123123",
        "-",
        "Enrique",
        "ecvoracle@gmail.com",
        { from: accounts[0] }
      );
      const bike2 = await instance.newBike(
        "Carrefour",
        "2016",
        "892342",
        "-",
        "Juan",
        "juan@gmail.com",
        { from: accounts[0] }
      );
      const bike3 = await instance.newBike(
        "Nike",
        "2010",
        "312456",
        "-",
        "Pepe",
        "pepe@gmail.com",
        { from: accounts[0] }
      );
      const bike4 = await instance.newBike(
        "Adidas",
        "2004",
        "345345",
        "-",
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
      assert.equal(bikeList[4][5], "-");
    });
    /* showBikeDetails */

    it("showBikeDetails: Can show a specific bike registered", async () => {
      const instance = await BikeContract.deployed();
      //Get bike 1 result
      const result = await instance.showBikeDetails(0);
      //Bike 1: Orbea
      assert.equal(result[1], "Orbea");
      //Bike 1: 2019
      assert.equal(result[2], "2019");
      //Bike 1: 123123
      assert.equal(result[3], "123123");
      //Bike 1: -
      assert.equal(result[4], "-");
    });
  });

  describe("@ Owner functions", () => {
    /* updateOwner */
    it("updateOwner: Can update a specific registered owner", async () => {
      const name = "Rafael";
      const email = "rafael@gmail.com";
      const instance = await BikeContract.deployed();
      //Update owner 0 to Rafael, rafael@gmail.com
      const owner = await instance.updateOwner(
        0,
        "Rafael",
        "rafael@gmail.com",
        { from: accounts[0] }
      );
      //Test OwnerUpdated event
      truffleAssert.eventEmitted(owner, "OwnerUpdated", (ev) => {
        return ev.ownerID == 0 && ev.name == name && ev.email == email;
      });
    });

    /* showListOwnerDetails */

    it("showListOwnerDetails: Can show the list of owners registered", async () => {
      const instance = await BikeContract.deployed();
      const ownerList = await instance.showListOwnerDetails();
      //Owner 1
      assert.equal(ownerList[1][1], "Enrique");
      //Owner 2
      assert.equal(ownerList[2][2], "juan@gmail.com");
      //Owner 3
      assert.equal(ownerList[3][1], "Pepe");
      //Owner 4
      assert.equal(ownerList[4][2], "luis@gmail.com");
    });

    /* showOwnerDetails */

    it("showOwnerDetails: Can show a specific owners registered", async () => {
      const instance = await BikeContract.deployed();
      //Show owner (0)
      const result = await instance.showOwnerDetails(0);
      //Owner 1: Rafael
      assert.equal(result[0], "Rafael");
      //Owner 1: rafael@gmail.com
      assert.equal(result[1], "rafael@gmail.com");
    });
  });

  describe("@ Add details, transferOwnership and renounceOwnership functions", () => {
    /* addDetails */
    it("addDetails: Can update bike details", async () => {
      const instance = await BikeContract.deployed();
      //Update details Bike 2: Hola
      await instance.addDetails(2, "Hola");
      //Get Bike 2 details
      const resultBike = await instance.showBikeDetails(2);
      assert.equal(resultBike[4], "Hola");
    });

    /* transferOwnership */

    it("transferOwnership: Can transfer ownership to future owner", async () => {
      const instance = await BikeContract.deployed();
      await instance.transferOwnership(
        1,
        "0x1A771540337888ADBb230f310ca442bA8B7E01aE",
        { from: accounts[0] }
      );
      const bikeList = await instance.showListBikeDetails();
      //Check Bike 1 address
      assert.equal(
        bikeList[1][6],
        "0x1A771540337888ADBb230f310ca442bA8B7E01aE"
      );
    });

    /* renounceOwnership */

    it("renounceOwnership: User can renounce its bike ownership", async () => {
      const instance = await BikeContract.deployed();
      await instance.renounceOwnership(1, { from: accounts[0] });
      const bikeList = await instance.showListBikeDetails();
      //Check Bike 1 address
      assert.equal(
        bikeList[1][6],
        "0x0000000000000000000000000000000000000000"
      );
    });
  });
});
