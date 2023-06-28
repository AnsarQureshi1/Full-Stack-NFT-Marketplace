import React from "react";
import { Container, Button } from "react-bootstrap";
import image  from './home.png'
import { Link } from "react-router-dom"

const HomePage = () => {
  return (
    <Container fluid>
    <div
      className="flex flex-col justify-center items-center h-screen bg-cover"
      style={{ backgroundImage: `url(${image})` }}
    >
      <h4 className="text-white font-semibold mb-3 bg-dark rounded-r-lg">Blockchain-based platform for unique digital assets</h4>
      <div className="flex flex-col items-center">
        <h2 className="text-white font-bold text-xl mb-3 bg-dark rounded-l-lg">Mint your own NFT and join the community of creators!</h2>
        <Link to="/create">
          <Button variant="primary" size="lg" className="bg-black border-black text-white font-bold ">
            Mint
          </Button>
        </Link>
      </div>
    </div>
  </Container>
  );
};

export default HomePage;