import React, { useState } from "react";
import "./NFTMinter.css";
import TokenAbi from "../TokenAbi.json";
import { ethers } from "ethers";
import axios from "axios";
import Walletconnect from './Walletconnect';
// import Walletconnect from "./WalletConnect";
const NFTApiKey = process.env.REACT_APP_API_KEY;
// const provider = new ethers.providers.Web3Provider(window.ethereum);
// const signer = provider.getSigner();

export default function NFTmint() {
  const contractAddress = "0x7d28BCf35f1082C10a21524f2B885BCf17772D74";
  const [userAddress, setuserAddress] = useState("");
  const [balance, setBalance] = useState(null);
  const [provider, setProvider] = useState("");
  const [Errormessage, setErrormessage] = useState("");
  const [contract, setContract] = useState("");
  const [SelectedFile, setSelectedFile] = useState(null);
  const [Name, setName] = useState("");
  const [Type, setType] = useState("");
  const [Description, setDescription] = useState("");
  const [Image, setImage] = useState("");
  const [MetadataUrl, setMetadataUrl] = useState("");

  const getBalance = (accountAddress) => {
    window.ethereum
      .request({
        method: "eth_getBalance",
        params: [String(accountAddress), "latest"],
      })
      .then((balance) => {
        console.log(balance);
        setBalance(ethers.utils.formatEther(balance));
      });
  };

  const accountChange = (AccountName) => {
    setuserAddress(AccountName);
    getBalance(AccountName);
  };
  //1.ConnectWallet
  const ConnectWallet = () => {
    if (window.ethereum) {
      const providers = new ethers.providers.Web3Provider(window.ethereum);
      const signer = providers.getSigner();
      setProvider(providers);
      if (provider) {
        window.ethereum
          .request({ method: "eth_requestAccounts" })
          .then((result) => {
            accountChange(result[0]);
            setContract(
              new ethers.Contract(contractAddress, TokenAbi, signer)
            );
          });
      }
    } else {
      setErrormessage("Install Metamask! ");
    }
  };

  //handleInput
  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };
  const uploadImage = async () => {
    if (!SelectedFile) return null;

    const formData = new FormData();
    formData.append("file", SelectedFile);

    try {
      const response = await axios.post(
        "https://api.nft.storage/upload",
        formData,
        {
          headers: {
            Authorization: `Bearer ${NFTApiKey}`,
          },
        }
      );

      if (response.data) {
        const imageUrl = `https://${response.data.value.cid}.ipfs.nftstorage.link/${response.data.value.files[0].name}`;
        setName(response.data.value.files[0].name);
        setImage(imageUrl);
        setType(response.data.value.files[0].type);
        setDescription("This image shows the true nature of NFT.");
        console.log("IPFS URL:", imageUrl);
        return imageUrl;
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      throw error;
    }
  };

  const createMetadataFile = () => {
    if (SelectedFile) {
      const metadataJSON = JSON.stringify({
        name: Name,
        description: Description,
        image: Image,
      });

      const metadataBlob = new Blob([metadataJSON], {
        type: "application/json",
      });

      return new File([metadataBlob], "metadata.json");
    }
    return null;
  };
  const Minting=async()=>{
    if(userAddress && MetadataUrl){
      try{
        console.log("minting");
        const rawTxn = await contract.safeMint(userAddress,"121",MetadataUrl);
        const txResponse = await rawTxn;
        console.log('Transaction sent:', txResponse);
        await txResponse.wait();
        console.log('Transaction confirmed');
      }catch(error){

      }
    }
  }
  const MintNFT = async () => {
    try {
      const imageUploadResponse = await uploadImage();

      if (imageUploadResponse) {
        const metadataFile = createMetadataFile();
        if (metadataFile) {
          const metadataFormData = new FormData();
          metadataFormData.append("file", metadataFile);

          const metadataResponse = await axios.post(
            "https://api.nft.storage/upload",
            metadataFormData,
            {
              headers: {
                Authorization: `Bearer ${NFTApiKey}`,
              },
            }
          );

          if (metadataResponse.data) {
            const metadataUrl = `https://${metadataResponse.data.value.cid}.ipfs.nftstorage.link/${metadataResponse.data.value.files[0].name}`;
            setMetadataUrl(metadataUrl);
            console.log("metadata:", String(MetadataUrl));
            console.log(String(userAddress));
            Minting();
           
          }
        }
      }
    } catch (error) {
      console.error("Error handling NFT minting:", error);
      setErrormessage("Error minting NFT");
    }
  };

  return (
    <div>
      <h1>NFT Minter</h1>
      <div className="card1">
        <button className="token" onClick={ConnectWallet}>
          Connect Wallet
        </button>
        <div className="cont3">
          <Walletconnect/>
        </div>
        <div className="cont3">
          <p id="t1">Address: </p>
          <p id="t2">{userAddress}</p>
        </div>
        <div className="cont3">
          <p id="t1">Balance: </p>
          <p id="t2">{balance}</p>
        </div>
        <div>
          <input
            className="cont3"
            type="file"
            accept="file"
            onChange={handleFileChange}
          />
        </div>
        <button className="connect2" onClick={MintNFT}>
          Mint NFT
        </button>
        {Errormessage}
      </div>
    </div>
  );
}
