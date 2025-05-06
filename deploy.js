const hre = require("hardhat");

async function main() {
  const MealBlockToken = await hre.ethers.getContractFactory("MealBlockToken");
  const contract = await MealBlockToken.deploy();
  await contract.waitForDeployment();
  console.log("Deployed at:", contract.target);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
