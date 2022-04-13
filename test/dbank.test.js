const chai = require('chai');
const assert = chai.assert;

chai.use(require('chai-as-promised')).should();

const LoadingCoin = artifacts.require('LoadingCoin');
const RewardCoin = artifacts.require('RewardCoin');
const Dbank = artifacts.require('Dbank');

contract('Dbank', (accounts) => {
  let loadingCoin, rewardCoin, dbank;

  const tokens = (number) => web3.utils.toWei(number, 'ether');

  before(async () => {
    // load contracts
    loadingCoin = await LoadingCoin.new();
    rewardCoin = await RewardCoin.new();
    dbank = await Dbank.new(loadingCoin.address, rewardCoin.address);

    // transfer the reward token to the Dbank inside the RewardCoin contract
    await rewardCoin.transfer(dbank.address, tokens('1000000'));

    // distribute 1000 loadingCoins tokens to new investors & we select second account ganache
    await loadingCoin.transfer(accounts[1], tokens('100'), {
      from: accounts[0],
    });
  });

  describe('Mock Loading Deployed', async () => {
    it('contract has name `LoadingCoin` and is matched', async () => {
      const name = await loadingCoin.name();
      assert.equal(name, 'LoadingCoin');
    });
  });

  describe('Mock RewardCoin Deployed', async () => {
    it('contract has name `RewardCoin` and is matched', async () => {
      const name = await rewardCoin.name();
      assert.equal(name, 'RewardCoin');
    });

    it('dbank address should have 1 million the tokens', async () => {
      const token = await rewardCoin.balanceOf(dbank.address);
      assert.equal(token, tokens('1000000'));
    });
  });

  describe('Mock Dbank Deployed', async () => {
    it('contract has name `Dbank` and is matched', async () => {
      const name = await dbank.name();
      assert.equal(name, 'Dbank');
    });

    describe('Yield farming', async () => {
      it('the investor should have 100 tokens reward', async () => {
        const token = await loadingCoin.balanceOf(accounts[1]);
        console.log('LDC token', token.toString());
        assert.equal(token, tokens('100'));
      });
    });

    describe('check staking status for customer', async () => {
      it('we approve dbank to spend tokens on behalf', async () => {
        // 1 - we approve dbank to spend tokens on behalf
        await loadingCoin.approve(dbank.address, tokens('100'), {
          from: accounts[1],
        });
        // 2 - we update the dbank staking balance (deposit in dbank)
        await dbank.depositTokens(tokens('100'), { from: accounts[1] });

        // check is investor has 0 balance after deposit
        const token = await loadingCoin.balanceOf(accounts[1]);
        console.log('LDC token', token.toString());
        assert.equal(token, tokens('0'));
      });

      it('and dbank should have 100 tokens', async () => {
        const token = await dbank.stakingBalance(accounts[1]);
        console.log('token dbank', token.toString());
        assert.equal(token, tokens('100'));
      });

      it('and the account is staking', async () => {
        const hasStaked = await dbank.isStaking(accounts[1]);
        assert.isTrue(hasStaked, 'the account is staking');
      });
    });

    describe('check rewardCoin for each stakers', async () => {
      it('only owner can call this', async () => {
        await dbank.rewardTokens({ from: accounts[2] }).should.be.rejected;
      });
      it('should have reward tokens', async () => {
        await dbank.rewardTokens({ from: accounts[0] });
        const rewardCoinTokens = await rewardCoin.balanceOf(accounts[1]);
        const expected = rewardCoinTokens.toString();
        console.log('rewardTokens', expected);
        assert.equal(expected, 11111111111111111111);
      });
    });

    describe('check tokens after run unstackedTokens()', async () => {
      it('the balance should be greater than 0', async () => {
        const balance = await dbank.stakingBalance(accounts[1]);
        console.log('balance', +balance);
        assert.isAbove(+balance, 0, 'balance is not greater than 0');
      });

      it('the staking balance should be 0', async () => {
        await dbank.unstackedTokens({ from: accounts[1] });
        const value = await dbank.stakingBalance(accounts[1]);
        assert.equal(value, 0);
      });

      it('customer is no longer staking', async () => {
        const isStaking = await dbank.isStaking(accounts[1]);
        assert.isNotTrue(isStaking);
      });

      it('investor should have 100 tokens back', async () => {
        const tokensBack = await loadingCoin.balances(accounts[1]);
        console.log('token dbank', tokensBack.toString());
        assert.equal(tokensBack, tokens('100'));
      });
    });
  });
});
