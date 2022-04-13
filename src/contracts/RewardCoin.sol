//SPDX-License-Identifier: GPL-3.0

pragma solidity >= 0.7.0 < 0.9.0;


contract RewardCoin {
    string public name = "RewardCoin";
    string public symbol = "RWD";
    uint public decimals = 18;
    uint public totalSupply;
    address public owner;

    event Transfer(address indexed from, address indexed to, uint tokens);
    event Approve(address indexed tokenOwner, address indexed spender, uint tokens);

    mapping(address => uint) public balances;

    // set the allowance from owner to person to send tokens
    mapping(address => mapping(address => uint)) allowed;


    constructor() {
        owner = msg.sender;
        totalSupply = 1000000000000000000000000;
        balances[owner] = totalSupply;
    }

    modifier onlyOwner {
        require(owner == msg.sender, "You are not the owner"); 
        _;
    }

    function balanceOf(address _address) public view returns(uint) {
        return balances[_address];
    }

    function transfer(address to, uint tokens) public returns(bool) {
        // 1 - require that the msg.sender to have that amount of tokens
        require(balances[msg.sender] >= tokens, "Not enought tokens");        
        balances[msg.sender] -= tokens;
        balances[to] += tokens;
        emit Transfer(msg.sender, to, tokens);
        return true;
    }

    function allowance(address tokenOwner, address spender) public view returns(uint remaining) {
        // set the allowance on behalf 
        return allowed[tokenOwner][spender];
    } 

    function approve(address spender, uint tokens) public returns(bool success) {
        require(balances[msg.sender]>= tokens, "Not enought tokens");
        require(tokens > 0, "No more tokens");

        // we allow to spend the amount of tokens
        allowed[msg.sender][spender] = tokens;

        emit Approve(msg.sender, spender, tokens);

        return true;
    }

    function transferFrom(address from, address to, uint tokens) public returns(bool success) {
        require(allowed[from][to] >= tokens, "This is not allowed");
        require(balances[from] >= tokens, "Not enought tokens");

        balances[from] -= tokens;
        balances[to] += tokens;

        allowed[from][to] -= tokens;

        return true;
    }
}