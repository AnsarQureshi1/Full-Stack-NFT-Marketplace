import { useState ,useEffect} from "react";
import {ethers} from "ethers";
import { marketAddress , PINATA_KEY , PINATA_SECRET} from "../config";
import NFTMarketplace from "../abi/NFTMarketplace.json";
import Web3Modal from "web3modal";
import axios from "axios"

export default function CreatorDashboard(){
    const [nft , setNft] = useState([]);
    const [loading , setLoading] = useState(true);
    

    useEffect(()=>{
        loadNFTs();
    },[])
    async function loadNFTs(){
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(marketAddress, NFTMarketplace.abi, signer)
        const data = await contract.fetchListedNft()

        const items = await Promise.all(data.map(async i => {
          const tokenUri = await contract.tokenURI(i.tokenId)
          const meta = await axios.get(tokenUri)
          let price = ethers.utils.formatUnits(i.price.toString(), 'ether')
          let item = {
            price,
            tokenId: i.tokenId.toNumber(),
            seller: i.seller,
            owner: i.owner,
            name: meta.data.name,
            image: meta.data.image,
          }
          return item
        }))
        setNft(items)
        setLoading(false)
    }
    async function cancelListing(tokenId){
        setLoading(false);
        const provider = new ethers.providers.Web3Provider(window.ethereum)

        const signer = provider.getSigner();
        const contract = new ethers.Contract(marketAddress,NFTMarketplace.abi,signer);

        const transaction = await contract.cancelLisiting(tokenId);
        await transaction.wait();
        loadNFTs();
    }
    if(loading) return (
        <h1 className="px-20 py-10 text-3xl">Wait Loading . . .</h1>
      )
      if(!nft.length && loading == false) return (
          <h1 className="px-20 py-10 text-3xl">No NFTS Listed By You  . . .</h1>
      )

      return (
        <div className="flex justify-center">
        <div className="px-4" style={{ maxWidth: '1600px' }}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
            {nft.map((nft, i) => (
                <div key={i} className="border shadow rounded-xl overflow-hidden">
                <img
                    src={nft.image}
                    alt={nft.name}
                    height={200}
                    width={300}
                    className="object-cover"
                />
                <div className="p-4 bg-white">
                    <p className="text-2xl mb-4 font-bold text-black">{nft.price} ETH</p>
                </div>
                </div>
            ))}
            </div>
        </div>
        </div>
    )
}