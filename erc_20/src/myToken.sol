// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

interface receiver {
    function receiveApproval(
        address fromUser,
        uint256 amount,
        address token,
        bytes calldata extraData
    ) external;
}

contract myToken {
    string public name;
    string public symbol;
    uint8 public decimals = 18;
    uint256 public totalSupply;

    mapping(address => uint256) public balances;
    mapping(address => mapping(address => uint256)) public allowed;

    event Transfer(address fromUser, address toUser, uint256 amount);
    event Approval(address ownerUser, address spenderUser, uint256 amount);
    event Burn(address fromUser, uint256 amount);

    constructor(
        uint256 initialSupply,
        string memory tokenName,
        string memory tokenSymbol
    ) {
        totalSupply = initialSupply * 10 ** uint256(decimals);
        balances[msg.sender] = totalSupply;
        name = tokenName;
        symbol = tokenSymbol;
    }

    function doTransfer(
        address fromUser,
        address toUser,
        uint256 amount
    ) internal {
        require(toUser != address(0x0));
        require(balances[fromUser] >= amount);
        require(balances[toUser] + amount >= balances[toUser]);

        uint256 previousBalances = balances[fromUser] + balances[toUser];

        balances[fromUser] -= amount;
        balances[toUser] += amount;

        emit Transfer(fromUser, toUser, amount);

        require(balances[fromUser] + balances[toUser] == previousBalances);
    }

    function transfer(
        address toUser,
        uint256 amount
    ) public returns (bool done) {
        doTransfer(msg.sender, toUser, amount);
        return true;
    }

    function transferFrom(
        address fromUser,
        address toUser,
        uint256 amount
    ) public returns (bool done) {
        require(amount <= allowed[fromUser][msg.sender]);
        allowed[fromUser][msg.sender] -= amount;
        doTransfer(fromUser, toUser, amount);
        return true;
    }

    function approve(
        address spenderUser,
        uint256 amount
    ) public returns (bool done) {
        allowed[msg.sender][spenderUser] = amount;
        emit Approval(msg.sender, spenderUser, amount);
        return true;
    }

    function approveAndCall(
        address spenderUser,
        uint256 amount,
        bytes memory extraData
    ) public returns (bool done) {
        receiver spender = receiver(spenderUser);
        if (approve(spenderUser, amount)) {
            spender.receiveApproval(
                msg.sender,
                amount,
                address(this),
                extraData
            );
            return true;
        }
    }

    function burn(uint256 amount) public returns (bool done) {
        require(balances[msg.sender] >= amount);
        balances[msg.sender] -= amount;
        totalSupply -= amount;
        emit Burn(msg.sender, amount);
        return true;
    }

    function burnFrom(
        address fromUser,
        uint256 amount
    ) public returns (bool done) {
        require(balances[fromUser] >= amount);
        require(amount <= allowed[fromUser][msg.sender]);
        balances[fromUser] -= amount;
        allowed[fromUser][msg.sender] -= amount;
        totalSupply -= amount;
        emit Burn(fromUser, amount);
        return true;
    }
}
