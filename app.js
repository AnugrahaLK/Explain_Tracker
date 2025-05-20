
// Connect to MetaMask
let account;
const contractAddress = "0x**********";
const contractABI = [ 
  {
    "inputs": [
      { "internalType": "string", "name": "_description", "type": "string" },
      { "internalType": "uint256", "name": "_amount", "type": "uint256" }
    ],
    "name": "addExpense",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getExpenses",
    "outputs": [
      {
        "components": [
          { "internalType": "string", "name": "description", "type": "string" },
          { "internalType": "uint256", "name": "amount", "type": "uint256" }
        ],
        "internalType": "struct ExpenseTracker.Expense[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

window.addEventListener("load", async () => {
  if (window.ethereum) {
    const web3 = new Web3(window.ethereum);
    await window.ethereum.request({ method: "eth_requestAccounts" });
    const accounts = await web3.eth.getAccounts();
    account = accounts[0];

    const expenseContract = new web3.eth.Contract(contractABI, contractAddress);

    const form = document.getElementById("expense-form");
    const expenseList = document.getElementById("expense-list");

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const description = document.getElementById("description").value;
      const amount = document.getElementById("amount").value;
      await expenseContract.methods.addExpense(description, web3.utils.toWei(amount, "ether")).send({ from: account, value: web3.utils.toWei(amount, "ether") });
      alert("Expense added to blockchain!");
      form.reset();
      loadExpenses();
    });

    async function loadExpenses() {
      const expenses = await expenseContract.methods.getExpenses().call();
      expenseList.innerHTML = "";
      expenses.forEach(exp => {
        const li = document.createElement("li");
        li.textContent = `${exp.description}: ${web3.utils.fromWei(exp.amount)} ETH`;
        expenseList.appendChild(li);
      });
    }

    loadExpenses();
  } else {
    alert("Please install MetaMask!");
  }
});
