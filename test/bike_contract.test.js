const BikeContract = artifacts.require("BikeContract");
const { assert } = require("chai");
const truffleAssert = require("truffle-assertions");

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
  describe("@ Bike listing", () => {
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
    it("it should list all details of bikes", async () => {
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

  describe("@ Owner listing", () => {
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
    it("it should show list of bike details", async () => {
      /* showAllDetails */
      const instance = await BikeContract.deployed();
      await instance.addDetails(1, "Detail 1", { from: accounts[0] });
      await instance.addDetails(2, "Detail 2", { from: accounts[0] });
      const detailsList = await instance.showAllDetails();
      //Bike 1: 1
      assert.equal(detailsList[0][0], 1);
      //Bike 2: Detail 2
      assert.equal(detailsList[1][2], "Detail 2");
    });
    /* addDetails */
    it("it should add details for a specific bike", async () => {
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

  describe("@ Modifiers: emptyBikeString", () => {
    /* Make */
    it("it should test empty Make field", async () => {
      const instance = await BikeContract.deployed();
      await truffleAssert.fails(
        instance.newBike(
          "",
          "Model_01",
          "Frame_no_01",
          "Name_01",
          "email_01@email.com",
          { from: accounts[0] }
        ),
        truffleAssert.ErrorType.REVERT,
        "(Make): Must not be empty."
      );
    });
    /* Model */
    it("it should test empty Model field", async () => {
      const instance = await BikeContract.deployed();
      await truffleAssert.fails(
        instance.newBike(
          "Make_01",
          "",
          "Frame_no_01",
          "Name_01",
          "email_01@email.com",
          { from: accounts[0] }
        ),
        truffleAssert.ErrorType.REVERT,
        "(Model): Must not be empty."
      );
    });
    /* Frame */
    it("it should test empty Frame field", async () => {
      const instance = await BikeContract.deployed();
      await truffleAssert.fails(
        instance.newBike(
          "Make_01",
          "Model_01",
          "",
          "Name_01",
          "email_01@email.com",
          { from: accounts[0] }
        ),
        truffleAssert.ErrorType.REVERT,
        "(Frame): Must not be empty."
      );
    });
  });
  describe("@ Modifiers: emptyOwnerString", () => {
    /* Name */
    it("it should test empty Name field", async () => {
      const instance = await BikeContract.deployed();
      await truffleAssert.fails(
        instance.newBike(
          "Make_01",
          "Model_01",
          "Frame_no_01",
          "",
          "email_01@email.com",
          { from: accounts[0] }
        ),
        truffleAssert.ErrorType.REVERT,
        "(Name): Must not be empty."
      );
    });
    /* Email */
    it("it should test empty Email field", async () => {
      const instance = await BikeContract.deployed();
      await truffleAssert.fails(
        instance.newBike("Make_01", "Model_01", "Frame_no_01", "Name_01", "", {
          from: accounts[0],
        }),
        truffleAssert.ErrorType.REVERT,
        "(Email): Must not be empty."
      );
    });
  });
  describe("@ Modifiers: emptyDetailsString", () => {
    /* Details */
    it("it should test empty Details field", async () => {
      const instance = await BikeContract.deployed();
      await truffleAssert.fails(
        instance.addDetails(1, "", { from: accounts[0] }),
        truffleAssert.ErrorType.REVERT,
        "(Details): Must not be empty."
      );
    });
  });
});