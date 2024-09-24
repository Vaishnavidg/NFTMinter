import * as React from "react";
import "./NFTMinter.css";
import {
  usePrepareContractWrite,
  useContractWrite,
  useWaitForTransaction,
} from "wagmi";

const contractAddress = "0x7d28BCf35f1082C10a21524f2B885BCf17772D74";

export function Minting(props) {
  const [tokenId, setTokenId] = React.useState("");


  const {
    config,
    error: prepareError,
    isError: isPrepareError,
  } = usePrepareContractWrite({
    address: "0x7d28BCf35f1082C10a21524f2B885BCf17772D74",
    abi: [
      {
        inputs: [
          {
            internalType: "address",
            name: "to",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "tokenId",
            type: "uint256",
          },
          {
            internalType: "string",
            name: "uri",
            type: "string",
          },
        ],
        name: "safeMint",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
    ],
    functionName: "safeMint",
    args: [
      props.userAddress, 
      parseInt(tokenId),
      props.MetadataUrl, 
    ],
    enabled: Boolean(tokenId),
  });

  const { data, error, isError, write } = useContractWrite(config);

  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        write?.();
      }}
    >
      <label for="tokenId" className="cont3">
        Token ID
      </label>
      <input
        // className="cont3"
        id="tokenId"
        onChange={(e) => setTokenId(e.target.value)}
        placeholder="420"
        value={tokenId}
      />
      <button className="connect2" disabled={!write || isLoading}>
        {isLoading ? "Minting..." : "Mint"}
      </button>

      {isSuccess && (
        <div className="cont3">
          Successfully minted your NFT!
          <div className="cont3">
            <a
              href={`https://testnet.rarible.com/token/polygon/${contractAddress}:${tokenId}`}
            >
              Rarible
            </a>
          </div>
        </div>
      )}
      {(isPrepareError || isError) && (
        <div className="cont3">Error: {(prepareError || error)?.message}</div>
      )}
    </form>
  );
}
