import { Nav , Container ,Navbar,Button } from "react-bootstrap"
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState ,useEffect } from "react";
import { ethers } from "ethers";
export default function Header(){
    const [account , setAccount] = useState();
    useEffect(() => {
      connectHandler(); 
    }, []);
    const connectHandler = async () => {
      if(account){
        // await window.ethereum.request({ method: "eth_accounts" });
        setAccount(null);
      }else{
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const account = ethers.utils.getAddress(accounts[0])
        setAccount(account);
      }
     
      
  }

  
    return(
        <>
      <Navbar bg="dark" variant="dark">
        <Container>
          <Navbar.Brand href="">NFT Souq</Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link href="/">Home</Nav.Link>
            <Nav.Link href="/marketplace">Marketplace</Nav.Link>
            <Nav.Link href="/create">Create NFT</Nav.Link>
            <Nav.Link href="/my-Nfts">My NFTs</Nav.Link>
            <Nav.Link href="/dashboard">Dashboard</Nav.Link>
            <Nav.Link href="/about">About</Nav.Link>
            
          </Nav>
          {account ? (
                <Button variant="primary" size="lg" className="bg-black border-black text-white font-bold ">
               {account.slice(0, 6) + '...' + account.slice(38, 42)}
                </Button>

            ) : (
              <Button onClick={connectHandler} variant="primary" size="lg" className="bg-black border-black text-white font-bold ">
              Connect
            </Button>
            )}
        </Container>
      </Navbar>

     

    </>
    )
}