import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import getWeb3 from '../utils/getWeb3';
import LoadingCoin from '../build/contracts/LoadingCoin.json';
import RewardCoin from '../build/contracts/RewardCoin.json';
import Dbank from '../build/contracts/Dbank.json';

import Main from './Main';
import ParticlesComponent from './ParticlesComponent';

const App = () => {
  const [accounts, setAccounts] = useState([]);
  const [web3, setWeb3] = useState();
  const [loadingCoin, setLoadingCoin] = useState();
  const [rewardCoin, setRewardCoin] = useState();
  const [dbank, setDbank] = useState();

  const [loadingBalance, setLoadingBalance] = useState(0);
  const [rewardBalance, setRewardBalance] = useState(0);
  const [dbankStakingBalance, setDbankStakingBalance] = useState(0);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();

  const loadWeb3 = async () => {
    const web3js = await getWeb3();
    setWeb3(web3js);
  };

  const loadAccounts = async () => {
    if (web3) {
      const getAccounts = await web3.eth.getAccounts();
      setAccounts(getAccounts);
    }
  };

  const setupContractsInstances = async () => {
    try {
      if (web3 && accounts) {
        const networkId = await web3.eth.net.getId();

        // load loadingCoin contract address - based on network id  - json
        const loadingData = LoadingCoin.networks[networkId];
        // load rewardCoin contract address - based on network id  - json
        const rewardData = RewardCoin.networks[networkId];
        // load dbank contract address - based on network id  - json
        const dbankData = Dbank.networks[networkId];

        const loadingCoinContract = await new web3.eth.Contract(
          LoadingCoin.abi,
          loadingData.address
        );

        const rewardCoinContract = await new web3.eth.Contract(
          RewardCoin.abi,
          rewardData.address
        );

        const dbankContract = await new web3.eth.Contract(
          Dbank.abi,
          dbankData.address
        );

        setLoadingCoin(loadingCoinContract);
        setRewardCoin(rewardCoinContract);
        setDbank(dbankContract);

        // loading balance of metamask account
        const loadingBalanceAcc = await loadingCoinContract.methods
          .balanceOf(accounts[0])
          .call();
        setLoadingBalance(loadingBalanceAcc);

        const rewardBalanceAcc = await rewardCoinContract.methods
          .balanceOf(accounts[0])
          .call();
        setRewardBalance(rewardBalanceAcc);

        const dbankAcc = await dbankContract.methods
          .stakingBalance(accounts[0])
          .call();
        setDbankStakingBalance(dbankAcc);

        setLoading(false);
      }
    } catch (error) {
      console.log(`Something went wrong ${error.message}`);
      setError(error);
    }
  };

  // 1 approve dbank to spend & stake tokens on behalf
  const approveStaking = async (amount) => {
    setLoading(true);
    await loadingCoin.methods
      .approve(dbank.options.address, amount)
      .send({ from: accounts[0] })
      .on('transactionHash', (hash) => {
        console.log(hash);
        setLoading(false);
        stakeTokens(amount);
      });
  };

  // 2 we stake tokens after approve
  const stakeTokens = async (amount) => {
    setLoading(true);
    await dbank.methods
      .depositTokens(amount)
      .send({ from: accounts[0] })
      .on('transactionHash', (hash) => {
        console.log(hash);
        setLoading(false);
      });
  };

  // 3 unstacked tokens step
  const unstackedTokensAccount = async () => {
    setLoading(true);
    await dbank.methods
      .unstackedTokens()
      .send({ from: accounts[0] })
      .on('transactionHash', (hash) => {
        console.log(hash);
        setLoading(false);
      });
  };

  useEffect(() => {
    setupContractsInstances();
  }, [accounts]);

  useEffect(() => {
    loadAccounts();
  }, [web3]);

  useEffect(() => {
    loadWeb3();
  }, []);

  return (
    <div className='App' style={{ position: 'relative' }}>
      <div style={{ position: 'absolute' }}>
        <ParticlesComponent />
      </div>
      <Navbar account={accounts[0]} />
      {loading ? (
        <div
          style={{
            position: 'relative',
            top: '100px',
            textAlign: 'center',
            color: 'white',
          }}
        >
          <h3>Loading...</h3>
        </div>
      ) : (
        <div className='container-fluid mt-5'>
          <div className='row'>
            <main
              role='main'
              className='col-lg-12 ml-auto mr-auto'
              style={{ maxWidth: '600px', minHeight: '100%' }}
            >
              <div>
                <Main
                  loadingBalance={loadingBalance}
                  rewardBalance={rewardBalance}
                  dbankStakingBalance={dbankStakingBalance}
                  web3={web3}
                  stakeTokens={approveStaking}
                  unstackedTokens={unstackedTokensAccount}
                />
              </div>
            </main>
          </div>
        </div>
      )}
      {error && (
        <div>
          <p>Something went wrong {error.message}</p>
        </div>
      )}
    </div>
  );
};

export default App;
