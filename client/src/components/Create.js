import { useState } from "react";
import {ethers} from "ethers";
import { marketAddress , PINATA_KEY , PINATA_SECRET, pinata_gateway_key} from "../config";
import NFTMarketplace from "../abi/NFTMarketplace.json";
import Web3Modal from "web3modal";
import axios from "axios"

export default function Create(){
   const [fileUrl , setFileUrl] = useState();
   const [fromInput , updateFormInput] = useState({name:"",description : "",price:""});
   const [loading ,setLoading] = useState(false)


   async function imageUpload(e){
    const file = e.target.files[0];
    try{

        const formData = new FormData();
        formData.append("file",file);
        const resFile = await axios(
            {
                method: "post",
                url:"https://api.pinata.cloud/pinning/pinFileToIPFS",
                data: formData,
                crossOrigin: "anonymous",
                 headers:{
                    'pinata_api_key':PINATA_KEY,
                    'pinata_secret_api_key': PINATA_SECRET,
                    'content-Type':'multipart/form-data',
                    // 'x-pinata-gateway-token':'8_Nb0Ku3iphoZoaTxkmXx7tbx-3TolAhqr3ePvPK6yXnYAiLJovKfDVxytHEP68P',
                //     // "Access-Control-Allow-Headers": "*",
                 }
            }
        );
        const imageURL = `https://turquoise-persistent-guineafowl-126.mypinata.cloud/ipfs/${resFile.data.IpfsHash}${pinata_gateway_key}`;
        setFileUrl(imageURL)

    }catch(e){
        console.log(e)
    }
   }

   async function uploadToIpfs(){

    const {name , description ,price} = fromInput;

    if(!name || !description || !price || !fileUrl) return;
    setLoading(false);

    try{

        var jsonData =  JSON.stringify({
            "pinataMetadata":{
                "name":`${name}.json`
            },
            "pinataContent":{
                name,description,image:fileUrl
            }
        })

        const resFile = await axios(
            {
                method: "post",
                url:"https://api.pinata.cloud/pinning/pinJSONToIPFS",
                data: jsonData,
                crossOrigin: "anonymous",
                headers:{
                    'pinata_api_key':PINATA_KEY,
                    'pinata_secret_api_key': PINATA_SECRET,
                    'content-Type':'application/json',
                    // 'x-pinata-gateway-token':'8_Nb0Ku3iphoZoaTxkmXx7tbx-3TolAhqr3ePvPK6yXnYAiLJovKfDVxytHEP68P'
                }
            }
        );

        const tokenURI = `https://turquoise-persistent-guineafowl-126.mypinata.cloud/ipfs/${resFile.data.IpfsHash}${pinata_gateway_key}`;
        return tokenURI

    }catch(e){
        console.log("Error uploading file" , e)
    }
   }

   async function listNftForSale(){
    const url = await uploadToIpfs()
    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()

    
    const price = ethers.utils.parseUnits(fromInput.price, 'ether')
    let contract = new ethers.Contract(marketAddress, NFTMarketplace.abi, signer)
    let listingPrice = await contract.getListingPrice()
    listingPrice = listingPrice.toString()
    let transaction = await contract.createToken(url, price, { value: listingPrice })
    await transaction.wait()
   }


   return(
    <div className="flex justify-center">
        <div className="w-1/8 flex-col mr-10 mt-10">
            {
                !fileUrl && (
                    <img className="rounded mt-4" width={300} height={200}/>
                )
            }{
                fileUrl && (
                    <img src={fileUrl} alt="img uploaded succesfully" width={300} height={200}/>
                )
            }

        </div>
        <div className="w-1/2 flex flex-col">
            <input placeholder="Asset Name" className="mt-8 border rounded p-4" onChange={e=>updateFormInput({...fromInput,name:e.target.value})}/> 
            <input placeholder="Asset Description" className="mt-2 border rounded p-4" onChange={e=>updateFormInput({...fromInput,description:e.target.value})}/>   
            <input placeholder="Asset Price" type="number" className="mt-2 border rounded p-4" onChange={e=>updateFormInput({...fromInput,price:e.target.value})}/> 
            <input type="file" name="Asset"  className="my-4" onChange={imageUpload}/>
            {
                fileUrl && (
                   <button onClick={listNftForSale} className="font-bold mt-4 bg-black text-white rounded p-4 shadow-lg">
                    {loading == false ? 'Create NFT' : "Wait Uploading ...."}
                   </button>
                )
            }
        </div>

    </div>
   )
}

