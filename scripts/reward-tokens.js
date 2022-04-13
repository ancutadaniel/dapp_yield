const Dbank = artifacts.require('Dbank');

module.exports = async (callback) => {
  const dbank = await Dbank.deployed();
  await dbank.rewardTokens();
  console.log('Reward complete successfully!');
  callback();
};
