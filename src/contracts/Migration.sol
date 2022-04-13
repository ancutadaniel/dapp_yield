//SPDX-License-Identifier: GPL-3.0

pragma solidity >= 0.7.0 < 0.9.0;

contract Migrations {
    address public owner = msg.sender;
    uint public last_migration;
    
    modifier onlyOwner {
        require(owner == msg.sender, "You are not the owner");
        _;
    }

    function setCompleted(uint _completed) public onlyOwner {
        last_migration = _completed;
    }

    function updateStatus(address _address) public onlyOwner {
        Migrations update = Migrations(_address);
        update.setCompleted(last_migration);
    }
}