const LoadingCoin = artifacts.require('LoadingCoin');
const RewardCoin = artifacts.require('RewardCoin');
const Dbank = artifacts.require('Dbank');

// for compile we need to have all the arguments inside module exports
module.exports = async function (deployer, networks, accounts) {
  await deployer.deploy(LoadingCoin);
  const loadingCoin = await LoadingCoin.deployed();

  await deployer.deploy(RewardCoin);
  const rewardCoin = await RewardCoin.deployed();

  await deployer.deploy(Dbank, loadingCoin.address, rewardCoin.address);
  const dbank = await Dbank.deployed();

  // transfer the reward token to the Dbank inside the RewardCoin contract
  await rewardCoin.transfer(dbank.address, '1000000000000000000000000');

  // distribute 1000 loadingCoins tokens to new investors & we select second account ganache
  await loadingCoin.transfer(accounts[1], '100000000000000000000');
};
