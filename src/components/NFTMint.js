import React, { useState } from "react";
import "./NFTMinter.css";
import axios from "axios";
import CustomButton from "./CustomButton";
import { confirmAlert } from "react-confirm-alert"; // Import
import "react-confirm-alert/src/react-confirm-alert.css"; // Import css

import {
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";
import TokenAbi from "../TokenAbi.json";
import { Minting } from "./Minting";

const NFTApiKey = process.env.REACT_APP_API_KEY;

export default function NFTmint() {
  const [userAddress, setUserAddress] = useState("");
  const [balance, setBalance] = useState("");
  const [Symbol, setSymbol] = useState("");
  const [Errormessage, setErrormessage] = useState("");
  const [SelectedFile, setSelectedFile] = useState(null);
  const [MetadataUrl, setMetadataUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

 

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const uploadImage = async () => {
    setIsLoading(true);

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

        // Set the Name, Description, and Image here
        const name = response.data.value.files[0].name;
        const description = "This image shows the true nature of NFT.";
        const image = imageUrl;
        // Create the metadata file
        const metadataJSON = JSON.stringify({
          name: name,
          description: description,
          image: image,
        });

        const metadataBlob = new Blob([metadataJSON], {
          type: "application/json",
        });

        const metadataFile = new File([metadataBlob], "metadata.json");

        // Display the confirmation dialog
        confirmAlert({
          title: "Confirm",
          message: "Do you want to proceed?",
          buttons: [
            {
              label: "Yes",
              onClick: () => MintNFT(metadataFile),
            },
            {
              label: "No",
              onClick: () => setIsLoading(false),
            },
          ],
        });

        return imageUrl;
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      setIsLoading(false);
      throw error;
    }
  };

  const MintNFT = async (metadataFile) => {
    try {
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
          console.log(metadataUrl);
          setMetadataUrl(metadataUrl);
        }
      }
    } catch (error) {
      console.error("Error handling NFT minting:", error);
      setErrormessage("Error minting NFT");
    }
  };

  const handleAddress = (data) => {
    setUserAddress(data);
  };

  const handleBalance = (data) => {
    setBalance(data.formatted);
    setSymbol(data.symbol);
  };

  return (
    <div>
      <h1>NFT Minter</h1>
      <div className="card1">
        <div className="cont3">
          <CustomButton
            sendAddress={handleAddress}
            sendBalance={handleBalance}
          />
        </div>
        <div className="cont3">
          <p id="t1">Address: </p>
          <p id="t2">{userAddress}</p>
        </div>
        <div className="cont3">
          <p id="t1">Balance: </p>
          <p id="t2">
            {balance} {Symbol}
          </p>
        </div>
        <div>
          <input
            className="cont3"
            type="file"
            accept="file"
            onChange={handleFileChange}
          />
        </div>
        <button
          disabled={isLoading || isSuccess}
          className="connect2"
          onClick={uploadImage}
        >
          {" "}
          Upload Image to Mint
        </button>
        <div>
          <Minting userAddress={userAddress} MetadataUrl={MetadataUrl} />
        </div>

        {Errormessage}
      </div>
    </div>
  );
}
