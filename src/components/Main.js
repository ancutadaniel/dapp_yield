import React, { useState } from 'react';
import Airdrop from './Airdrop';
import loadingImg from '../tether.png';

const Main = ({
  loadingBalance,
  rewardBalance,
  dbankStakingBalance,
  web3,
  stakeTokens,
  unstackedTokens,
}) => {
  const ldc = web3.utils.fromWei(loadingBalance, 'Ether');
  const rwd = web3.utils.fromWei(rewardBalance, 'Ether');
  const dbk = web3.utils.fromWei(dbankStakingBalance, 'Ether');

  const [deposit, setDeposit] = useState(0);

  const handleDeposit = (e) => {
    setDeposit(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const amount = web3.utils.toWei(deposit, 'Ether');
    console.log('amount', amount);
    stakeTokens(amount);
  };

  const handleWithdraw = () => {
    unstackedTokens();
  };

  return (
    <div id='content' className='m-3'>
      <table className='table text-muted text-center mr-3'>
        <thead>
          <tr style={{ color: 'white' }}>
            <th scope='col'>Staking Balance</th>
            <th scope='col'>Reward Balance</th>
          </tr>
        </thead>
        <tbody>
          <tr style={{ color: 'white' }}>
            <td>{dbk} LDC</td>
            <td>{rwd} RWD</td>
          </tr>
        </tbody>
      </table>
      <div className='card m-2' style={{ opacity: '0.9' }}>
        <form className='m-4' onSubmit={handleSubmit}>
          <div style={{ borderSpacing: '0 1em' }}>
            <label className='float-left' style={{ marginLeft: '15px' }}>
              Stake Tokens
            </label>
            <span className='float-right' style={{ marginRight: '8px' }}>
              Balance: {ldc}
            </span>
            <div className='input-group mb-4'>
              <input
                type='text'
                placeholder='0'
                required
                value={deposit}
                onChange={handleDeposit}
              />
              <div className='input-group-open'>
                <div className='input-group-text'>
                  <img
                    src={loadingImg}
                    alt='loadingCoin'
                    height='32px'
                    className='d-inline-block align-top rounded-circle'
                  />
                  LDC
                </div>
              </div>
            </div>
            <button className='btn btn-primary btn-lg btn-block' type='submit'>
              DEPOSIT
            </button>
            <button
              className='btn btn-primary btn-lg btn-block '
              onClick={handleWithdraw}
            >
              WITHDRAW
            </button>
          </div>
        </form>
        <div className='card-body text-center' style={{ color: 'blue' }}>
          <Airdrop />
        </div>
      </div>
    </div>
  );
};

export default Main;
