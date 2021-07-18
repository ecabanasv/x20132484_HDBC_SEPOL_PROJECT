// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;
pragma experimental ABIEncoderV2;

contract BikeContract {

  uint public bikeCounter = 0;
  uint public ownerCounter = 0;
  
  address public emptyAddress = 0x0000000000000000000000000000000000000000;

  struct bikeDetails {
    uint bikeID;
    string make;
    string model;
    string colour;
    string typeBike;
    string frame_no;
    string details;
    address user_address;
  }

  struct ownerDetails {
    uint ownerID;
    string name;
    string contact_no;
    string email;
    address user_address;
  }

  mapping(uint => bikeDetails) public bikes;

  mapping(uint => ownerDetails) public owner;

  event BikeCreated(
    uint bikeID,
    string make,
    string model,
    string colour,
    string typeBike,
    string frame_no,
    string details
  );

  event OwnerAdded(
    uint ownerID,
    string name,
    string contact_no,
    string email
  );

    event detailsAdded(
      string details
  );

      event transferDone(
      uint ownerID,
      string name,
      string contact_no,
      string email,
      address user_address
  );

      event renounceDone(
      address user_address
  );

    /* Bike functions */

  function newBikeSM(string memory _make, string memory _model, string memory _colour, string memory _type, string memory _frame_no, string memory _details, string memory _name, string memory _contact_no, string memory _email) public {
    bikes[bikeCounter] = bikeDetails(bikeCounter, _make, _model, _colour, _type, _frame_no, _details, msg.sender);
    bikeCounter++;
    emit BikeCreated(bikeCounter, _make, _model, _colour, _type, _frame_no, _details);
    _newOwner(_name, _contact_no, _email);
  }

  function showListBikeDetails() public view returns (bikeDetails[] memory) {
    bikeDetails[] memory _bikes = new bikeDetails[](bikeCounter);
    for (uint i = 0; i < bikeCounter; i++) {
        _bikes[i] = bikes[i];
    }
    return _bikes;
  }

  /* Owner functions */

  function _newOwner(string memory _name, string memory _contact_no, string memory _email) private {
    owner[ownerCounter] = ownerDetails(ownerCounter, _name, _contact_no, _email, msg.sender);
    ownerCounter++;
    emit OwnerAdded(ownerCounter, _name, _contact_no, _email);
  }

  function showOwnerDetails() public view returns (ownerDetails[] memory) {
    ownerDetails[] memory _owner = new ownerDetails[](ownerCounter);
    for (uint i = 0; i < ownerCounter; i++) {
        _owner[i] = owner[i];
    }
    return _owner;
  }

    function _updateOwner(uint _id, string memory _name, string memory _contact_no, string memory _email, address _user_address) private {
      owner[_id].name = _name;
      owner[_id].contact_no = _contact_no;
      owner[_id].email = _email;
      owner[_id].user_address = _user_address;
  }

    /* Other functions */

  function addDetails(uint _id, string memory _details) public {
      bikes[_id].details = _details;
      emit detailsAdded(_details);
  }

  function transferOwnership(uint _id,  string memory _name, string memory _contact_no, string memory _email, address _newAddress) public {
      bikes[_id].user_address = _newAddress;
      _updateOwner(_id, _name, _contact_no, _email, _newAddress);
      emit transferDone(_id, _name, _contact_no, _email, _newAddress);
  }

  function renounceOwnership(uint _id) public {
      bikes[_id].user_address = emptyAddress;
      emit renounceDone(emptyAddress);
  }
}