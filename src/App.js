import './App.css';
import { NavbarComp } from './components/NavbarComp';
import ConnectWallet from './components/ConnectWallet';
import NFTmint from './components/NFTMint';

import { EthereumClient, w3mConnectors, w3mProvider } from '@web3modal/ethereum'
import { Web3Modal } from '@web3modal/react'
import { configureChains, createConfig, WagmiConfig } from 'wagmi'
import { arbitrum, mainnet, polygon, polygonMumbai } from 'wagmi/chains'
// import { Web3Button } from '@web3modal/react'
// import CustomButton from './CustomButton'
import { useState } from 'react'

const chains = [arbitrum, mainnet, polygon, polygonMumbai]
const projectId = 'ba4cc022b35796cfeb12b9d3a3f550c4';
const { publicClient } = configureChains(chains, [w3mProvider({ projectId })])

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: w3mConnectors({ projectId, chains }),
  publicClient
})

const ethereumClient = new EthereumClient(wagmiConfig, chains)

function App() {
  return (
    
    <div className="App">
      <WagmiConfig config={wagmiConfig}>
      <NFTmint/>
      </WagmiConfig>
      <Web3Modal projectId={projectId} ethereumClient={ethereumClient} />
    </div>
  );
}

export default App;
