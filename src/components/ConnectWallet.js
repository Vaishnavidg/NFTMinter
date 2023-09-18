import React, { useState } from 'react';
import './ConnectedWallet.css';
import { ethers } from 'ethers';
import Walletconnect from './Walletconnect';
import NFTmint from './NFTMint';


export default function ConnectWallet() {
    const[errormessage,setErrormessage]=useState(null);
    const[defaultAccount,setDefaultAccount]=useState(null);
    const[userBalance,setUserBalance]=useState(null);

    const getBalance = (accountAddress) => {
        window.ethereum
          .request({
            method: "eth_getBalance",
            params: [String(accountAddress), "latest"],
          })
          .then((balance) => {
            console.log(balance);
            setUserBalance(ethers.utils.formatEther(balance));
          });
      };

    const accountChange=(AccountName)=>{
        setDefaultAccount(AccountName);
        getBalance(AccountName);
    }

    const ConnectWallet=()=>{
        if(window.ethereum){
            window.ethereum
            .request({method:"eth_requestAccounts"})
            .then((result)=>{
                accountChange(result[0]);

            });
        }else{
            setErrormessage("Install Metamask");
        }
    };
  return (
    <div className="card">
     
      <div className="cont2">
        <p id="t1">Address</p>
      </div>
      <div className="cont3">
        <p id="t2">{defaultAccount}</p>
      </div>
      <div className="cont2">
        <p id="t1">Balance: </p>
      </div>
      <div className="cont3">
        <p id="t2">{userBalance}</p>
        <img src={require("../components/assests/image1.png")} alt="img1" />
        <p>ETH</p>
      </div>
      <button className="connect" onClick={ConnectWallet}>
        MetaMask Connect
      </button>
       <div>
        <Walletconnect/>
       </div>
       <div>
        <NFTmint/>
       </div>

      {errormessage}
    </div>
  )
}
