import './App.css';
import { NavbarComp } from './components/NavbarComp';
import ConnectWallet from './components/ConnectWallet';

function App() {
  return (
    <div className="App">
      <NavbarComp/>
      <ConnectWallet/>
    </div>
  );
}

export default App;
