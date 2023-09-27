import { useWeb3Modal } from "@web3modal/react";
import "./StyleNavbar.css";
import { useState, useEffect } from "react";
import { useAccount, useBalance, useDisconnect } from "wagmi"; 
import { getPublicClient } from "@wagmi/core";

export default function CustomButton({ sendAddress, sendBalance }) {
  const [loading, setLoading] = useState(false);
  const { open, provider } = useWeb3Modal(); 
  const { isConnected, address } = useAccount();
  const { data, isError, isLoading } = useBalance({
    address: address,
  });

  if (isLoading) return <div>Fetching balance…</div>;
  if (isError) return <div>Error fetching balance</div>;

  const { disconnect } = useDisconnect();
  const publicClient = getPublicClient();

  const [userAddress, setUserAddress] = useState(null);
  const [Balance, setBalance] = useState("");

  useEffect(() => {
    if (isConnected) {
      // Fetch user's address
      setUserAddress(address);
      setBalance(data);
      sendBalance(data);

      sendAddress(address);
    } else {
      setUserAddress(null);
      setBalance("");
    }
  }, [isConnected, address]);

  const label = isConnected ? "Disconnect" : "Connect Custom";

  async function onOpen() {
    setLoading(true);
    await open(); // Wait for the Web3 modal to open
    setLoading(false);
  }

  function onClick() {
    if (isConnected) {
      setUserAddress(null);
      setBalance("");
      disconnect();
    } else {
      onOpen();
    }
  }

  return (
    <div>
      <button className="connect1" onClick={onClick} disabled={loading}>
        {loading ? "Loading..." : label}
      </button>
    </div>
  );
}
