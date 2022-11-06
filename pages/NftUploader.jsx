// NftUploader.jsx
import { Button, TextField } from "@mui/material";
import React from "react";
import { useEffect, useState } from 'react'
// import "./NftUploader.css";
import { ethers }  from "ethers";
import Web3Mint from "./Web3Mint.json";
import { Web3Storage } from 'web3.storage';

const API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDdENzUxY0QyNzA0QzQzNTU2ZjE3ZTNkNDZlYTBBNzRjNDkwQjFBRGEiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2NjczMzAyMzU0MDQsIm5hbWUiOiJmaXJzdCJ9.zR2IeP-Wy2dm1PR_hdmRUtBrfYptGESX4YeIW612Xek"
var url = "";

const NftUploader = () => {
  /*
   * ユーザーのウォレットアドレスを格納するために使用する状態変数を定義します。
   */
  const [currentAccount, setCurrentAccount] = useState("");
  /*この段階でcurrentAccountの中身は空*/
  console.log("currentAccount: ", currentAccount);
  const checkIfWalletIsConnected = async () => {
    const { ethereum } = window;
    if (!ethereum) {
      console.log("Make sure you have MetaMask!");
      return;
    } else {
      console.log("We have the ethereum object", ethereum);
    }

    const accounts = await ethereum.request({ method: "eth_accounts" });

    if (accounts.length !== 0) {
      const account = accounts[0];
      console.log("Found an authorized account:", account);
      setCurrentAccount(account);
    } else {
      console.log("No authorized account found");

      let chainId = await ethereum.request({ method: "eth_chainId" });
      console.log("Connected to chain " + chainId);
      // 0x5 は Goerli の ID です。
      const goerliChainId = "0x5";
      if (chainId !== goerliChainId) {
          alert("You are not connected to the Goerli Test Network!");
      }
    }
  };
  const connectWallet = async () =>{
    try {
      const { ethereum } = window;
      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }
      /*
       * ウォレットアドレスに対してアクセスをリクエストしています。
       */
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      console.log("Connected", accounts[0]);
      /*
       * ウォレットアドレスを currentAccount に紐付けます。
       */
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  };

  const imageToNFT = async (e) => {
    const client = new Web3Storage({ token: API_KEY })
    const image = e.target
    console.log(image)

    const rootCid = await client.put(image.files, {
        name: 'experiment',
        maxRetries: 3
    })
    const res = await client.get(rootCid) // Web3Response
    const files = await res.files() // Web3File[]
    for (const file of files) {
      console.log("file.cid:",file.cid)
      askContractToMintNft(file.cid)
    }
  };

  const askContractToMintNft = async (ipfs) => {
    const CONTRACT_ADDRESS =
      "0xfF8053A18f44af056DC718e0A5a344A0B8ccC675";
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(
          CONTRACT_ADDRESS,
          Web3Mint.abi,
          signer
        );
        console.log("Going to pop wallet now to pay gas...");
        let name = variables[6]
        let prompt = variables[5]
        let seed = variables[0]
        let height = variables[2]
        let width = variables[3]
        let guidance_scale = variables[1]
        let steps = variables[4]
        let nftTxn = await connectedContract.mintIpfsNFT(name,prompt,ipfs,seed,height,width,guidance_scale,steps);
        console.log("Mining...please wait.");
        await nftTxn.wait();
        console.log(
          `Mined, see transaction: https://goerli.etherscan.io/tx/${nftTxn.hash}`
        );
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const [variables, setVariables] = useState([0, 0, 0, 0, 0, "", ""]);
  const updateVariables = (e) => {
    
    setVariables((prevState) => prevState.map((value, index) => (index === 5 ?  e.target.value : value)));
  };
  const updateSeedVal = (e) => {
    
    setVariables((prevState) => prevState.map((value, index) => (index === 0 ?  e.target.value : value)));
  };
  const updateGuidanceScale = (e) => {
    
    setVariables((prevState) => prevState.map((value, index) => (index === 1 ?  e.target.value : value)));
  };
  const updateHeight = (e) => {
    
    setVariables((prevState) => prevState.map((value, index) => (index === 2 ?  e.target.value * 512 : value)));
  };
  const updateWidth = (e) => {
    
    setVariables((prevState) => prevState.map((value, index) => (index === 3 ?  e.target.value * 512: value)));
  };
  const updateSteps = (e) => {
    
    setVariables((prevState) => prevState.map((value, index) => (index === 4 ?  e.target.value : value)));
  };

  const updateName = (e) => {
    
    setVariables((prevState) => prevState.map((value, index) => (index === 6 ?  e.target.value : value)));
  };
  

  let imgsrc = "https://images.pexels.com/photos/20787/pexels-photo.jpg?auto=compress&cs=tinysrgb&h=350"
  const generateImage = async () => {
    url = 'http://localhost:8000/api/member/'+variables[0]+'/'+variables[1]+'/'+variables[2]+'/'+variables[3]+'/'+variables[4]+'/'+variables[5];
    const response = await fetch(url, {method: 'get'});
    const json = response.json();
    console.log(json)
  };

  
  

  const renderNotConnectedContainer = () => (
      <button onClick={connectWallet} className="cta-button connect-wallet-button">
        Connect to Wallet
      </button>
    );
  /*
   * ページがロードされたときに useEffect()内の関数が呼び出されます。
   */
  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  return (
    
    <div>
      <div className="outerBox">
        {currentAccount === "" ? (
          renderNotConnectedContainer()
          ) : (
        <p>If you choose image, you can mint your NFT</p>
        )}
      <div className="title">
      <h2>NFTアップローダー</h2>
      </div>
      <div className="nameForm"></div>
	    
		    <p>呪文を作成</p>
		    <input type="text" name="prompt" size="90" onChange={updateVariables}/>
        <input type="range" name="prompt" size="90" onChange={updateSeedVal} min="0" max="4294967295"/>
        <input type="range" name="prompt" size="90" onChange={updateGuidanceScale} min="0" max="20"/>
        <input type="range" name="prompt" size="90" onChange={updateHeight}min="1" max="4"/>
        <input type="range" name="prompt" size="90" onChange={updateWidth}min="1" max="4"/>
        <input type="range" name="prompt" size="90" onChange={updateSteps} min="5" max="30"/>
	    
      
      <p>{variables}</p>
      <Button onClick={generateImage}>
      画像を生成
      </Button>
      {imgsrc === "" ? (
          renderNotConnectedContainer()
          ) : (
        <img 
        src = {imgsrc}
        alt="new"
        />
        )}

      <p><input type="text" size="90" onChange={updateName}/></p>
      <Button onClick={generateImage}>
      画像を生成
      </Button>
      </div> 
      </div>
  );
};

export default NftUploader;