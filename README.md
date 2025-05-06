1. Create a new project directory named FinalProject

```
mkdir FinalProject

```
2. Change directory into the new directory.

```
cd FinalProject
```
Build a package.json file (holding important information about this project) by running the
following command. Hit return and take the defaults provided.
```
npm init     

```

3. Now, within the FinalProject directory, install hardhat:

```
npm install --save-dev hardhat

```

4. Next, within the FinalProject directory, initialize Hardhat with the Node Package Execute (npx) command:

```
npx hardhat init
```

You will need to select "Create an empty hardhat.config.js".

5. The npx command creates a hardhat.config.js. In addition, if you are asked to do so,
run the following npm command.

```
npm install --save-dev "hardhat@^2.18.2"

```

6. Within the project directory, install the Hardhat toolbox:

```
npm install --save-dev @nomicfoundation/hardhat-toolbox

```
7. We need access to that toolbox. Edit your hardhat.config.js file and include this line
at the top:

```
require("@nomicfoundation/hardhat-toolbox");
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.28",
};
```

8. Create a new subdirectory named contracts. Within contracts, create the following smart
contract named MealBlockToken.sol:

```
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MealBlockToken is ERC20, Ownable {
    enum UserType { None, Student, Vendor }
    mapping(address => UserType) public userTypes;

    constructor() ERC20("CMU Meal Block", "CMUMB") Ownable(msg.sender) {}

    function createUser(uint8 userType) external {
        require(userType == 1 || userType == 2, "Invalid user type");
        require(userTypes[msg.sender] == UserType.None, "User already created");
        userTypes[msg.sender] = UserType(userType);
    }

    function create(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }

    function transact(address from, address to, uint256 amount) external {
        require(balanceOf(from) >= amount, "Insufficient balance");
        _transfer(from, to, amount);
    }

    function redeem(address from, uint256 amount) external onlyOwner {
        _burn(from, amount);
    }

    function checkBalance(address user) external view returns (uint256) {
        return balanceOf(user);
    }
}

```
9. Using Node Package Execute (npx), compile the code with the following command. We do this in the
directory just above the contracts directory.

Note that this command will download the appropriate compiler.

```
npx hardhat compile

```

10. Create a new directory named scripts and place the following Javascript code in the scripts directory in a file named demo.js.
```
const { ethers } = require("hardhat");

const contractAddress = "YOUR_DEPLOYED_CONTRACT_ADDRESS";
const abi = [ /* paste your ABI here */ ];

async function main() {
    const provider = new ethers.JsonRpcProvider("http://localhost:8545"); // or your actual RPC URL
    const signer = await provider.getSigner();

    const contract = new ethers.Contract(contractAddress, abi, signer);

    const userAddress = await signer.getAddress();
    console.log("Connected as:", userAddress);

    // Create a user (0 = Student)
    let tx = await contract.createUser(0);
    await tx.wait();
    console.log("Student user created");

    // Mint tokens to user
    tx = await contract.create(userAddress, ethers.parseUnits("100", 18));
    await tx.wait();
    console.log("Minted 100 tokens");

    // Check balance
    const balance = await contract.balanceOf(userAddress);
    console.log("Balance:", ethers.formatUnits(balance, 18));

    // Transfer tokens to another address (simulate)
    const accounts = await provider.listAccounts();
    const recipient = accounts[1];
    tx = await contract.transfer(recipient, ethers.parseUnits("20", 18));
    await tx.wait();
    console.log(`Transferred 20 tokens to ${recipient}`);

    // Redeem tokens
    tx = await contract.redeem(userAddress, ethers.parseUnits("10", 18));
    await tx.wait();
    console.log("Redeemed 10 tokens");

    // Final balance
    const finalBalance = await contract.balanceOf(userAddress);
    console.log("Final Balance:", ethers.formatUnits(finalBalance, 18));
}

main().catch(console.error);


```
11. In the project directory, run the test code. Enter the following:

```
npx hardhat test
```
