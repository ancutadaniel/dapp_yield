import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import getWeb3 from '../utils/getWeb3';

import './App.css';

const App = () => {
  const [accounts, setAccounts] = useState(['0x0']);
  const [web3, setWeb3] = useState();

  const loadWeb3 = async () => {
    const web3js = await getWeb3();
    const getAccounts = await web3js.eth.getAccounts();

    setWeb3(web3js);
    setAccounts(getAccounts);
  };

  useEffect(() => {
    loadWeb3();
  }, []);

  return (
    <div>
      <div>
        <Navbar account={accounts[0]} />
      </div>
      <div></div>
    </div>
  );
};

export default App;
