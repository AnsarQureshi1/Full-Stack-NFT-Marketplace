import React from 'react';
import logo from './lgo.jpg';
import history from './logo.jpg';
import trends from './lg.jpg';

function About() {
  return (
    <div className="bg-gradient-to-b from-stone-600 to-purple-600">
      <div className="container mx-auto px-4 py-16">
        <img src={logo} alt="logo" className="h-12 mb-4 animate-fade-in opacity-0 hover:scale-110" />
        <h1 className="text-white text-4xl font-bold mb-8">About NFT</h1>
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2 md:col-span-1">
            <img src={history} alt="history" className="h-48 w-full object-cover rounded-lg shadow-lg" />
            <h2 className="text-white text-2xl font-bold mt-4 mb-2">History</h2>
            <p className="text-white leading-relaxed">
              Non-fungible tokens (NFTs) have been around since 2017, but they really gained popularity in 2021
              thanks to the rise of digital art, collectibles, and gaming. NFTs use blockchain technology to
              create unique digital assets that can be bought, sold, and traded.
            </p>
          </div>
          <div className="col-span-2 md:col-span-1">
            <img src={trends} alt="trends" className="h-48 w-full object-cover rounded-lg shadow-lg" />
            <h2 className="text-white text-2xl font-bold mt-4 mb-2">Present Trends</h2>
            <p className="text-white leading-relaxed">
              Today, NFTs are being used for a wide variety of purposes, including digital art, music, sports
              collectibles, virtual real estate, and even memes. In 2021 alone, NFT sales reached a total of $2.5 billion,
              with some individual NFTs selling for millions of dollars.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;
