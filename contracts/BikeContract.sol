// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;
pragma experimental ABIEncoderV2;

contract BikeContract {

  uint private bikeCounter = 0;
  uint private ownerCounter = 0;
  address private emptyAddress = 0x0000000000000000000000000000000000000000;

  struct bikeDetails {
    uint bikeID;
    string make;
    string model;
    string frame;
    string details;
    address user_address;
  }

  struct ownerDetails {
    uint ownerID;
    string name;
    string email;
  }

  mapping(uint => bikeDetails) public bikes;

  mapping(uint => ownerDetails) public owner;

  event BikeCreated(
    uint bikeID,
    string make,
    string model,
    string frame,
    string details
  );

  event OwnerAdded(
    uint ownerID,
    string name,
    string email
  );

  event OwnerUpdated(
    uint ownerID,
    string name,
    string email
  );

  event detailsAdded(
    uint id,
    string details
  );

  event transferDone(
    uint ownerID,
    address user_address
  );

  event renounceDone(
    uint id,
    address user_address
  );

    /* Bike functions */

  function newBike(string memory _make, string memory _model, string memory _frame, string memory _details, string memory _name, string memory _email) public {
    bikes[bikeCounter] = bikeDetails(bikeCounter, _make, _model, _frame, _details, msg.sender);
    bikeCounter++;
    emit BikeCreated(bikeCounter, _make, _model, _frame, _details);
    _newOwner(_name, _email);
  }

  function showListBikeDetails() public view returns (bikeDetails[] memory) {
    bikeDetails[] memory _bikes = new bikeDetails[](bikeCounter);
    for (uint i = 0; i < bikeCounter; i++) {
        _bikes[i] = bikes[i];
    }
    return _bikes;
  }

  function showBikeDetails(uint _bikeID) public view returns (string memory, string memory, string memory) {
    return (bikes[_bikeID].make, bikes[_bikeID].model, bikes[_bikeID].frame);
  }

  /* Owner functions */

  function _newOwner(string memory _name, string memory _email) private {
    owner[ownerCounter] = ownerDetails(bikeCounter, _name, _email);
    ownerCounter++;
    emit OwnerAdded(bikeCounter, _name, _email);
  }

  function updateOwner(uint _ownerID, string memory _name, string memory _email) public {
    owner[_ownerID].name = _name;
    owner[_ownerID].email = _email;
    emit OwnerUpdated(_ownerID, _name, _email);
  }

  function showListOwnerDetails() public view returns (ownerDetails[] memory) {
    ownerDetails[] memory _owner = new ownerDetails[](ownerCounter);
    for (uint i = 0; i < ownerCounter; i++) {
        _owner[i] = owner[i];
    }
    return _owner;
  }

  function showOwnerDetails(uint _ownerID) public view returns (string memory, string memory) {
    return (owner[_ownerID].name, owner[_ownerID].email);
  }

    /* Other functions */

  function addDetails(uint _id, string memory _details) public {
    bikes[_id].details = _details;
    emit detailsAdded(_id, _details);
  }

  function transferOwnership(uint _id, address _newAddress) public {
    bikes[_id].user_address = _newAddress;
    emit transferDone(_id, _newAddress);
  }

  function renounceOwnership(uint _id) public {
    bikes[_id].user_address = emptyAddress;
    emit renounceDone(_id, emptyAddress);
  }
}