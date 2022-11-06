// NftUploader.jsx
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import Link from 'next/link';
import { Button, TextField } from "@mui/material";
import React from "react";
import { ethers } from "ethers";
import Web3Mint from "./Web3Mint.json";
import { Web3Storage } from 'web3.storage';
import { useEffect, useState } from "react";

export default function Home() {
  const [currentAccount, setCurrentAccount] = useState("");
  /*この段階でcurrentAccountの中身は空*/
  //console.log("currentAccount: ", currentAccount);
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

  async function askContractToMintNft  (ipfs, variables) {
    console.log(ipfs, variables);
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
        console.log("variables : " ,{variables});
        let name = variables[6]
        let prompt = variables[5]
        let seed = variables[0]
        let height = variables[2]
        let width = variables[3]
        let guidance_scale = variables[1]
        let steps = variables[4]

        console.log("name : " ,{name});
        console.log("prompt : " ,{prompt});
        console.log("seed : " ,{seed});
        console.log("height : " ,{height});

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
  
const [variables, setVariables] = useState(['111111', '2', '512', '512', '5', "テスト", "テスト"]);
const updatePrompt = (e) => {
  
  setVariables((prevState) => prevState.map((value, index) => (index === 5 ?  e.target.value : value)));
};
const updateSeedVal = (e) => {
  
  setVariables((prevState) => prevState.map((value, index) => (index === 0 ?  e.target.value : value)));
};
const updateGuidanceScale = (e) => {
  
  setVariables((prevState) => prevState.map((value, index) => (index === 1 ?  e.target.value : value)));
};
const updateHeight = (e) => {
  
  setVariables((prevState) => prevState.map((value, index) => (index === 2 ?  e.target.value * 64 : value)));
};
const updateWidth = (e) => {
  
  setVariables((prevState) => prevState.map((value, index) => (index === 3 ?  e.target.value * 64: value)));
};
const updateSteps = (e) => {
  
  setVariables((prevState) => prevState.map((value, index) => (index === 4 ?  e.target.value : value)));
};

const updateName = (e) => {
  
  setVariables((prevState) => prevState.map((value, index) => (index === 6 ?  e.target.value : value)));
};

  const[data, setData] = useState("https://i.imgur.com/t1fye4S.jpg")
  const generateImage = async () => {
    //let url = 'http://127.0.0.1:8000/SDAPI/'+variables[0]+'/'+variables[1]+'/'+variables[2]+'/'+variables[3]+'/'+variables[4]+'/'+variables[5];
    // let url = "http://127.0.0.1:8000/SDAPI/4294967/7/512/512/6/dogs%20and%20Doooog/"
    let url = "https://i.imgur.com/t1fye4S.jpg"
    await fetch(url, {method: 'GET'}).then((res) => res.json()).then((data) => setData(data.link)).catch((error) => {
      console.error('Error:', error);
    });

    //一時的にdataをurlと置く
    data = url;
  };

  //IPFSを用いる際は利用する
//   // NftUploader.jsx
// const API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDVlRjkzOEMxZDgxYjZkODk1YzBBNjlEQjJiYmMzRkFDNTIyMDYxMUMiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2NjUzNjcxNDU1MTAsIm5hbWUiOiJVTkNIQUlOIn0.pT0uSDyETOz8xyCpXPnX1T4w6rmkeekwTckJVcJsHsk"
// const imageToNFT = async (e) => {
//   const client = new Web3Storage({ token: API_KEY })
//   const image = data

//   const rootCid = await client.put(image.files, {
//       name: 'experiment',
//       maxRetries: 3
//   })
//   const res = await client.get(rootCid) // Web3Response
//   const files = await res.files() // Web3File[]
//   for (const file of files) {
//     console.log("file.cid:",file.cid)
//     askContractToMintNft(file.cid)
//   }
// }


  const renderNotConnectedContainer = () => (
    <button onClick={connectWallet} className="cta-button connect-wallet-button">
     Connect to Wallet
    </button>
  );


  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  return (

    <div className={styles.container}>
      {currentAccount === "" ? (
        renderNotConnectedContainer()
      ) : (
        <p>If you choose image, you can mint your NFT</p>
      )}

      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
        AI絵画を作る
        </h1>
        <Button onClick={connectWallet} className="cta-button connect-wallet-button">
          Walletを接続
        </Button>

        <p className={styles.description}>
        Stable Diffusionを用いてAI絵画を実際に作ることができます。作品はブロックチェーン上に保存されます。
        </p>

        <div className={styles.grid}>

          <a
            target="_blank"
            rel="noopener noreferrer"
            className={styles.outerBox}
          >
           <img 
                src = {data}
                alt="new"
               />
          <h2>呪文を入力</h2>
          <p><input type="text" name="prompt" size="90" onChange={updatePrompt}/></p>
          <fieldset>
		        
            <p>Seed: {variables[0]}</p>
            <p><input type="range" name="prompt" size="200" onChange={updateSeedVal}min="100" max="4294967292"/></p>
            <p>Guidance Scale: {variables[1]}</p>
            <p><input type="range" name="prompt" size="200" onChange={updateGuidanceScale}min="1" max="20"/></p>
            <p>Height: {variables[2]}</p>
            <p><input type="range" name="prompt" size="200" onChange={updateHeight} min="8" max="16"/></p>
            <p>Width: {variables[3]}</p>
            <p><input type="range" name="prompt" size="200" onChange={updateWidth} min="8" max="16"/></p>
            <p>Steps: {variables[4]}</p>
            <p><input type="range" name="prompt" size="200" onChange={updateSteps} min="5" max="10"/></p>

            
	        </fieldset>
          <Button onClick={generateImage}>
              画像を生成
          </Button>

          <p>
          名前をつける
          <p><input type="text" name="prompt" size="90" onChange={updateName}/></p>
          <Button onClick={askContractToMintNft(data, variables)}>
          NFTにする

          </Button>
          </p>

    
       
          </a>
          
        </div>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer>
    </div>
  )
}
