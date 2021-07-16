// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;
pragma experimental ABIEncoderV2;

/*import "@openzeppelin/contracts/access/Ownable.sol";*/

contract BikeContract {

  uint public bikeCounter = 0;
  uint public ownerCounter = 0;

  struct bikeDetails {
    uint bikeID;
    string make;
    string model;
    string colour;
    string typeBike;
    string frame_no;
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
    string frame_no
  );

  event OwnerAdded(
    uint ownerID,
    string name,
    string contact_no,
    string email
  );

/*
  event BikeSMCreated(
    string frame_no,
    string name,
    string contact_no,
    string email
  );
*/

  function newBikeSM(string memory _make, string memory _model, string memory _colour, string memory _type, string memory _frame_no, string memory _name, string memory _contact_no, string memory _email) public {
    bikes[bikeCounter] = bikeDetails(bikeCounter, _make, _model, _colour, _type, _frame_no, msg.sender);
    bikeCounter++;
    emit BikeCreated(bikeCounter, _make, _model, _colour, _type, _frame_no);
    _newOwner(_name, _contact_no, _email);
  }

  function _newOwner(string memory _name, string memory _contact_no, string memory _email) private {
    owner[ownerCounter] = ownerDetails(ownerCounter, _name, _contact_no, _email, msg.sender);
    ownerCounter++;
    emit OwnerAdded(ownerCounter, _name, _contact_no, _email);
  }

  function showBikeDetails() public view returns (bikeDetails[] memory) {
    bikeDetails[] memory _bikes = new bikeDetails[](bikeCounter);
    for (uint i = 0; i < bikeCounter; i++) {
        _bikes[i] = bikes[i];
    }
    return _bikes;
  }

    function showOwnerDetails() public view returns (ownerDetails[] memory) {
    ownerDetails[] memory _owner = new ownerDetails[](bikeCounter);
    for (uint i = 0; i < ownerCounter; i++) {
        _owner[i] = owner[i];
    }
    return _owner;
  }
}