
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ExpenseTracker {
    struct Expense {
        string description;
        uint256 amount;
    }

    mapping(address => Expense[]) public expenses;

    function addExpense(string memory _description, uint256 _amount) public payable {
        require(msg.value == _amount, "Amount must match value sent");
        expenses[msg.sender].push(Expense(_description, _amount));
    }

    function getExpenses() public view returns (Expense[] memory) {
        return expenses[msg.sender];
    }
}
