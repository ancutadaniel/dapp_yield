//SPDX-License-Identifier: GPL-3.0

pragma solidity >= 0.7.0 < 0.9.0;


import './LoadingCoin.sol';
import './RewardCoin.sol';

contract Dbank {
    string public name = "Dbank";
    address public owner;
    
    // define the contract
    LoadingCoin public loadingCoin;
    RewardCoin public rewardCoin;

    address[] public stakers;

    mapping(address => uint) public stakingBalance;
    mapping(address => bool) public hasStaked;
    mapping(address => bool) public isStaking;

    constructor(LoadingCoin _loadingCoin, RewardCoin _rewardCoin) {
        owner = msg.sender;
        loadingCoin = _loadingCoin;
        rewardCoin = _rewardCoin;
    }

    modifier onlyOwner {
        require(owner == msg.sender, "You are not the owner");
        _;
    }

    function depositTokens(uint amount) public {
        require(amount > 0, "The amount cannot be 0");

        // transfer loadingCoin to this contract for staking
        loadingCoin.transferFrom(msg.sender, address(this), amount);

        // update staking balance
        stakingBalance[msg.sender] += amount;

        // check is hasStaked
        if(!hasStaked[msg.sender]) {
            stakers.push(msg.sender);
            hasStaked[msg.sender] = true;
            isStaking[msg.sender] = true;
        } 
    }

    function rewardTokens() public onlyOwner {
        for(uint i = 0; i < stakers.length; i++) {
            address recipient = stakers[i];
            // we get balance to know how much to reward 
            uint balance = stakingBalance[recipient] / 9; // to create incentive
            // transfer reward tokens if balance > 0
            if(balance > 0) rewardCoin.transfer(recipient, balance);
        }
    }

    function unstackedTokens() public {
        uint balance = stakingBalance[msg.sender];
        require(balance > 0, "The balance should be greater than 0");

        // get back the tokens staked
        loadingCoin.transfer(msg.sender, balance);

        stakingBalance[msg.sender] = 0;
        isStaking[msg.sender] = false;
    }
}

   