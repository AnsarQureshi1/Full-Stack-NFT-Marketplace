import { useEffect , useState } from "react";
import {ethers} from "ethers";
import NFTMarketplace from "../abi/NFTMarketplace.json";
import Web3Modal from "web3modal";
import {marketAddress , ALCHEMY_URL} from "../config"
import axios from "axios"

export default function Home(){
    const [nft , setNft] = useState([]);
    const [loading , setLoading] = useState(true);
    

    useEffect(()=>{
        loadNFTs();
    },[])
    async function loadNFTs(){
        const provider = new ethers.providers.JsonRpcProvider()
        const contract = new ethers.Contract(marketAddress, NFTMarketplace.abi, provider)
        const data = await contract.fetchMarketItem()
    
        
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
            description: meta.data.description,
            image: meta.data.image,
          }
          return item
        }))
        setNft(items)
        setLoading(false)
    }

    async function buyNFT(nft){
        const web3Modal = new Web3Modal();
        const connection =  await web3Modal.connect();
        const provider = new ethers.providers.Web3Provider(connection)

        const signer = provider.getSigner();
        const contract = new ethers.Contract(marketAddress,NFTMarketplace.abi,signer);
        const price = ethers.utils.parseUnits(nft.price.toString(),'ether');
        const tx = await contract.sale(nft.tokenId,{value:price})
        await tx.wait()
        loadNFTs()

    }

  
    if(loading) return (
      <h1 className="px-20 py-10 text-3xl">Wait Loading . . .</h1>
    )
    if(!nft.length && loading == false) return (
        <h1 className="px-20 py-10 text-3xl">No Listed Items  . . .</h1>
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
                <div className="p-4">
                    <p style={{ maxHeight: "60px" }} className="text-2xl font-semibold truncate">
                    {nft.name}
                    </p>
                    <div className="max-h-40 overflow-hidden">
                    <p className="text-gray-400">{nft.description}</p>
                    </div>
                </div>

                <div className="p-4 bg-white">
                    <p className="text-2xl mb-4 font-bold text-black">{nft.price} ETH</p>
                    <button className="w-full bg-black text-white font-bold py-2 px-4 rounded-md shadow-lg hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900" onClick={() => buyNFT(nft)}>
                    Buy Now
                    </button>
                </div>
                </div>
            ))}
            </div>
        </div>
        </div>

    )

}