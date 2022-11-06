import { useState } from 'react'
import Link from 'next/link';
import styles from '../../styles/Home.module.css'


export const NFTCard = ({ nft}) => {

    const [OwnerAdress, setOwnerAdress] = useState("");
    const [modalIsOpen,setIsOpen] = useState(false);

    const fetchOwnerAddress = async () => {
        var requestOptions = { method: 'GET'};
        const api_key2 = "A8A1Oo_UTB9IN5oNHfAc2tAxdR4UVwfM"
        const baseURL2 = `https://eth-goerli.g.alchemy.com/v2/${api_key2}/getOwnersForToken/`;
        const fetchURL2 = `${baseURL2}?contractAddress=${nft.contract.address}&tokenId=${nft.id.tokenId}`;

        const owneraddressSet = await fetch(fetchURL2, requestOptions).then(data => data.json())
        if (owneraddressSet) {
              console.log("NFTs in collection:", owneraddressSet)
              setOwnerAdress(owneraddressSet.owners[0])
            }
      
          }

    fetchOwnerAddress()


    return (
        <div className="w-1/4 flex flex-col ">
            <div className = {styles.worksCard}>

            <img className = {styles.gridWorks} src={nft.media[0].gateway} ></img>


            <button className = {styles.rightButton}>
            <Link href = {{pathname : "/works/" + OwnerAdress}}>
            この作者の他の作品を見る
            </Link>
            </button>

            <p>作品アドレス : {nft.contract.address}</p>
            <p>ID : {nft.id.tokenId}</p>
            <p>作者アドレス : {OwnerAdress}</p>
            <p>作品名 : {nft.title}</p>
            <p>Prompt : {nft.description}</p>
            <p>seed : {nft.metadata.attributes[0].value}</p>
            <p>Guidance_Scale : {nft.metadata.attributes[3].value}</p>
            <p>STEPS : {nft.metadata.attributes[4].value}</p>
            <p>HEIGHT : {nft.metadata.attributes[1].value}</p>
            <p>WIDTH : {nft.metadata.attributes[2].value}</p>

            </div>
       

        </div>


    )

    
}