// SPDX-License-Identifier: MIT

pragma solidity ^0.8.18;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract NFTMarketplace is ERC721URIStorage{
    using Counters for Counters.Counter;
    Counters.Counter private tokenId;
    Counters.Counter private itemsSold;

    address payable owner;
    uint256 private listingPrice = 0.001 ether ;

    mapping(uint256 => MarketItem) private idToMarketItem;

    struct MarketItem{
        uint256 tokenId;
        address seller;
        address owner;
        uint256 price;
        bool sold;
    }

    event MarketItemCreated (
        uint256 indexed tokenId,
        address seller,
        address owner,
        uint256 price,
        bool sold
    );


    constructor()ERC721("NFT Souq", "ANS"){
        owner=payable(msg.sender);
    }
    
    function updateLisitngPrice(uint256 _lisitngPrice)public payable{
        require(owner == msg.sender , "only marketplace owner can update the price");
        listingPrice = _lisitngPrice;
    }

    function listItem(uint256 tokenID , uint256 price)private{
        require(price > 0 ,"price should be greater than 0");
        require(msg.value == listingPrice , "Price Must be Equal to Listing Price");

        idToMarketItem[tokenID]= MarketItem(
            tokenID,
            payable(msg.sender),
            payable(address(this)),
            price,
            false
        );
        _transfer(msg.sender, address(this), tokenID);
        emit MarketItemCreated(tokenID, msg.sender, address(this), price, false);
    }

    function createToken(string memory tokenURI , uint256 price)public payable returns(uint256){
        tokenId.increment();
        uint256 newTokenId = tokenId.current();
        _mint(msg.sender, newTokenId);
        _setTokenURI(newTokenId, tokenURI);
        listItem(newTokenId, price);
        return newTokenId;

    }

    function sale(uint256 tokenID)public payable{
        uint price = idToMarketItem[tokenID].price;
        address seller = idToMarketItem[tokenID].seller;

        require(msg.value == price,"please submit the asking price to complete the purchase");
        idToMarketItem[tokenID].owner = payable(msg.sender);
        idToMarketItem[tokenID].sold = true;
        idToMarketItem[tokenID].seller = payable(address(0));
        itemsSold.increment();
        _transfer(address(this), msg.sender, tokenID);
        payable(owner).transfer(listingPrice);
        payable(seller).transfer(msg.value);

    }

    function fetchMarketItem() public view returns(MarketItem [] memory){
        uint itemCount = tokenId.current();
        uint unsoldItemCount = tokenId.current() - itemsSold.current();
        uint currentIndex = 0 ;

        MarketItem[] memory items = new MarketItem[](unsoldItemCount);

        for(uint i = 0;i<itemCount;i++){
            if(idToMarketItem[i+1].owner == address(this)){
                uint currentId = i+1;
                MarketItem storage currentItem = idToMarketItem[currentId];
                items[currentIndex]= currentItem;
                currentIndex += 1 ;

            }
        }
        return items;
    }

    function fetchMyNft()public view returns(MarketItem[] memory){
         uint totalItemCount = tokenId.current();
         uint itemCount = 0;
         uint currentIndex = 0;

            for (uint i = 0; i < totalItemCount; i++) {
                if (idToMarketItem[i + 1].owner == msg.sender) {
                itemCount += 1;
                }
            }

            MarketItem[] memory items = new MarketItem[](itemCount);
            for (uint i = 0; i < totalItemCount; i++) {
                if (idToMarketItem[i + 1].owner == msg.sender) {
                uint currentId = i + 1;
                MarketItem storage currentItem = idToMarketItem[currentId];
                items[currentIndex] = currentItem;
                currentIndex += 1;
                }
            }
            return items;


    }
    function fetchListedNft()public view returns(MarketItem[] memory){
            uint totalItemCount = tokenId.current();
            uint itemCount = 0;
            uint currentIndex = 0;

            for (uint i = 0; i < totalItemCount; i++) {
                if (idToMarketItem[i + 1].seller == msg.sender) {
                itemCount += 1;
                }
            }

            MarketItem[] memory items = new MarketItem[](itemCount);
            for (uint i = 0; i < totalItemCount; i++) {
                if (idToMarketItem[i + 1].seller == msg.sender) {
                uint currentId = i + 1;
                MarketItem storage currentItem = idToMarketItem[currentId];
                items[currentIndex] = currentItem;
                currentIndex += 1;
                }
            }
            return items;


    }

    function resellToken(uint256 tokenID , uint256 price)public payable{
        require(idToMarketItem[tokenID].owner == msg.sender ,"only item owner can perform this action");
        require(price == listingPrice,"Price Must Be Equal To Listing Price");
        idToMarketItem[tokenID].sold=false;
        idToMarketItem[tokenID].price=price;
        idToMarketItem[tokenID].seller=payable(msg.sender);
        idToMarketItem[tokenID].owner=payable(address(this));
        itemsSold.decrement();
        _transfer(msg.sender, address(this), tokenID);

    }

    function cancelLisiting(uint256 tokenID)public {
        require(idToMarketItem[tokenID].owner == msg.sender ,"only owner can perform this");
        require(idToMarketItem[tokenID].sold == false , "Cancel item when it not solved Yet");
        idToMarketItem[tokenID].owner= msg.sender;
        idToMarketItem[tokenID].seller=address(0);
        idToMarketItem[tokenID].sold=true;
        itemsSold.decrement();
        _transfer(address(this), msg.sender, tokenID);

    }


    function getListingPrice() public view returns(uint256){
        return listingPrice;
    }

}