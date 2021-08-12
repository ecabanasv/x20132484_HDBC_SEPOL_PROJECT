// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;
pragma experimental ABIEncoderV2;

contract BikeContract {
    uint256 private bikeCounter = 0;
    uint256 private ownerCounter = 0;
    uint256 private detailsCounter = 0;
    address private emptyAddress = 0x0000000000000000000000000000000000000000;

    // struct bikeDetails
    struct bikeDetails {
        uint256 bikeID;
        uint256 regDate;
        string make;
        string model;
        string frame;
        address user_address;
    }

    // struck ownerDetails
    struct ownerDetails {
        uint256 ownerID;
        string name;
        string email;
    }

    // struck listDetails
    struct listDetails {
        uint256 bikeID;
        uint256 date;
        string details;
    }

    mapping(uint256 => bikeDetails) public bikes;

    mapping(uint256 => ownerDetails) public owner;

    mapping(uint256 => listDetails) public details;

    event BikeCreated(
        uint256 bikeID,
        uint256 regDate,
        string make,
        string model,
        string frame
    );

    // events

    event OwnerAdded(uint256 ownerID, string name, string email);

    event OwnerUpdated(uint256 ownerID, string name, string email);

    event detailsAdded(uint256 id, uint256 date, string details);

    event transferDone(uint256 ownerID, address user_address);

    event renounceDone(uint256 id, address user_address);

    // modifier functions that is executed before rest of code
    // it validates fields (make, model and frame) are not empty
    modifier emptyBikeString(
        string memory _make,
        string memory _model,
        string memory _frame
    ) {
        require(bytes(_make).length > 0, "(Make): Must not be empty.");
        require(bytes(_model).length > 0, "(Model): Must not be empty.");
        require(bytes(_frame).length > 0, "(Frame): Must not be empty.");
        _;
    }

    // modifier functions that is executed before rest of code
    // it validates fields (name and email) are not empty
    modifier emptyOwnerString(string memory _name, string memory _email) {
        require(bytes(_name).length > 0, "(Name): Must not be empty.");
        require(bytes(_email).length > 0, "(Email): Must not be empty.");
        _;
    }

    // modifier functions that is executed before rest of code
    // it validates field (details) is not empty
    modifier emptyDetailsString(string memory _details) {
        require(bytes(_details).length > 0, "(Details): Must not be empty.");
        _;
    }

    /* Bike functions */
    function newBike(
        string memory _make,
        string memory _model,
        string memory _frame,
        string memory _name,
        string memory _email
    ) public emptyBikeString(_make, _model, _frame) {
        bikes[bikeCounter] = bikeDetails(
            bikeCounter,
            block.timestamp,
            _make,
            _model,
            _frame,
            msg.sender
        );
        bikeCounter++;
        emit BikeCreated(bikeCounter, block.timestamp, _make, _model, _frame);
        _newOwner(_name, _email);
    }

    function showListBikeDetails() public view returns (bikeDetails[] memory) {
        bikeDetails[] memory _bikes = new bikeDetails[](bikeCounter);
        for (uint256 i = 0; i < bikeCounter; i++) {
            _bikes[i] = bikes[i];
        }
        return _bikes;
    }

    function showBikeDetails(uint256 _bikeID)
        public
        view
        returns (
            uint256,
            string memory,
            string memory,
            string memory,
            address
        )
    {
        return (
            bikes[_bikeID].regDate,
            bikes[_bikeID].make,
            bikes[_bikeID].model,
            bikes[_bikeID].frame,
            bikes[_bikeID].user_address
        );
    }

    /* Owner functions */
    function _newOwner(string memory _name, string memory _email)
        private
        emptyOwnerString(_name, _email)
    {
        owner[ownerCounter] = ownerDetails(bikeCounter, _name, _email);
        ownerCounter++;
        emit OwnerAdded(bikeCounter, _name, _email);
    }

    function _updateOwner(
        uint256 _ownerID,
        string memory _name,
        string memory _email
    ) private emptyOwnerString(_name, _email) {
        owner[_ownerID].name = _name;
        owner[_ownerID].email = _email;
        emit OwnerUpdated(_ownerID, _name, _email);
    }

    function showOwnerDetails(uint256 _ownerID)
        public
        view
        returns (string memory, string memory)
    {
        return (owner[_ownerID].name, owner[_ownerID].email);
    }

    /* Other functions */
    function addDetails(uint256 _id, string memory _details)
        public
        emptyDetailsString(_details)
    {
        details[detailsCounter] = listDetails(_id, block.timestamp, _details);
        detailsCounter++;
        emit detailsAdded(_id, block.timestamp, _details);
    }

    function showAllDetails() public view returns (listDetails[] memory) {
        listDetails[] memory _details = new listDetails[](detailsCounter);
        for (uint256 i = 0; i < detailsCounter; i++) {
            _details[i] = details[i];
        }
        return _details;
    }

    function transferOwnership(
        uint256 _id,
        address _newAddress,
        string memory _name,
        string memory _email
    ) public {
        bikes[_id].user_address = _newAddress;
        emit transferDone(_id, _newAddress);
        _updateOwner(_id, _name, _email);
    }

    function renounceOwnership(uint256 _id) public {
        bikes[_id].user_address = emptyAddress;
        emit renounceDone(_id, emptyAddress);
    }
}