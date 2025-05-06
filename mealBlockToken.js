const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("MealBlockToken", function () {
  let contract, owner, student, vendor;

  beforeEach(async () => {
    [owner, student, vendor] = await ethers.getSigners();
    const MealBlockToken = await ethers.getContractFactory("MealBlockToken");
    contract = await MealBlockToken.deploy();
    await contract.waitForDeployment();
  });

  it("should create user and mint tokens", async () => {
    await contract.connect(student).createUser(1); // Student
    await contract.create(student.address, ethers.parseEther("10"));
    expect(await contract.balanceOf(student.address)).to.equal(ethers.parseEther("10"));
  });

  it("should transfer and redeem tokens", async () => {
    await contract.create(student.address, ethers.parseEther("10"));
    await contract.connect(student).transfer(vendor.address, ethers.parseEther("5"));
    expect(await contract.balanceOf(vendor.address)).to.equal(ethers.parseEther("5"));
    await contract.redeem(vendor.address, ethers.parseEther("5"));
    expect(await contract.balanceOf(vendor.address)).to.equal(0);
  });
});
