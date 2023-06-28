const {expect}= require("chai")
const {ethers}= require("hardhat")

describe("NFT Marketplace",()=>{
    let NftMarket , nftMarket , listingPrice ,ContractOnwer, buyerAddress ,buyerAddress2 , NftmarketAddress;

    const auctionPrice = ethers.utils.parseUnits("100","ether");

    beforeEach(async()=>{
        NftMarket = await ethers.getContractFactory("NFTMarketplace");
        nftMarket = await NftMarket.deploy();
        await nftMarket.deployed();
        NftmarketAddress =  nftMarket.address;
        [ContractOnwer , buyerAddress , buyerAddress2] = await ethers.getSigners();
        listingPrice = await nftMarket.getListingPrice();
        listingPrice = listingPrice.toString();
    })

    const mintAnsList = async(tokenURI , auctionPrice)=>{
        const transaction = await nftMarket.createToken(tokenURI,auctionPrice,{value:listingPrice});
        const receipt = await transaction.wait();
        const tokenID = await receipt.events[0].args.tokenId;
        return tokenID;
    }

    describe("mint and list",()=>{
        const tokenURI = "https://sample/";
        it("should revert if price is zero",async()=>{
            const tx = mintAnsList(tokenURI,0);
            expect(tx).to.be.reverted;
        })
        it("it should create an NFT with the correct Owner tokenURI" ,async()=>{
            const tokenID = await mintAnsList(tokenURI,auctionPrice);
            const mintedTokenURI = await nftMarket.tokenURI(tokenID);
            const ownerAddress = await nftMarket.ownerOf(tokenID);
            expect(ownerAddress).to.equal(NftmarketAddress);
            expect(mintedTokenURI).to.equal(tokenURI);
        })
        it("should emit an event after successfully listing an NFT",async()=>{
            const tx =  await nftMarket.createToken(tokenURI,auctionPrice,{value: listingPrice});
            const receipt = await tx.wait()
            const tokenID = receipt.events[0].args.tokenId;
            await expect(tx).to.emit(nftMarket,"MarketItemCreated").withArgs(tokenID,ContractOnwer.address,NftmarketAddress,auctionPrice,false)
        })
    });

    describe("Execute sale of marketplace" ,async()=>{
        const tokenURI = "https://sample/";

        it("should resvert if the auction price in wrong",async()=>{
            const newNft = await mintAnsList(tokenURI,auctionPrice);
            await expect(nftMarket.connect(buyerAddress).sale(newNft,{value:20})).to.be.reverted
        });
        it("buy a token and chek the owenr is correct",async()=>{
            const newNft = await mintAnsList(tokenURI,auctionPrice);
            const oldOwner = await nftMarket.ownerOf(newNft);

            expect(oldOwner).to.equal(NftmarketAddress);
            await nftMarket.connect(buyerAddress).sale(newNft,{value:auctionPrice});

            const newOwner = await nftMarket.ownerOf(newNft);

            expect(newOwner).to.equal(buyerAddress.address)
        })
    });

    describe("Resale of marketplace",async()=>{
        const tokenURI = "https://sample/";

        it("should revert if the wrong owner want to sell",async()=>{
            const newNft = await mintAnsList(tokenURI,auctionPrice);
            await nftMarket.connect(buyerAddress).sale(newNft,{value:auctionPrice});
            await expect(nftMarket.resellToken(newNft,auctionPrice,{value:listingPrice})).to.be.reverted;
            await expect(nftMarket.connect(buyerAddress).resellToken(newNft,auctionPrice,{value:0})).to.be.reverted;


        });

        it("buy a new token and resell it",async()=>{
            const newNft = await mintAnsList(tokenURI,auctionPrice);
            await nftMarket.connect(buyerAddress).sale(newNft,{value:auctionPrice});

            const tokenOwner = await nftMarket.ownerOf(newNft);
            expect(tokenOwner).to.equal(buyerAddress.address);

            await nftMarket.connect(buyerAddress).resellToken(newNft,listingPrice,{value:listingPrice})
            const newtokenOwner = await nftMarket.ownerOf(newNft);

            expect(newtokenOwner).to.equal(NftmarketAddress)
        })
    });

    describe("fetch marketplace items",async()=>{
        const tokenURI = "https://sample/";

        it("should fetch the correct number of unsold item",async()=>{
            await mintAnsList(tokenURI,auctionPrice);
            await mintAnsList(tokenURI,auctionPrice);
            await mintAnsList(tokenURI,auctionPrice);

            let unsoldItem = await nftMarket.fetchMarketItem();
            expect(unsoldItem.length).to.equal(3);
        });
        it("should fetch the correct number of  item user purchase",async()=>{
            let nftToken = await mintAnsList(tokenURI,auctionPrice);
            await mintAnsList(tokenURI,auctionPrice);


            await nftMarket.connect(buyerAddress).sale(nftToken, {value:auctionPrice});           

            let buyerTotal= await nftMarket.connect(buyerAddress).fetchMyNft();
            expect(buyerTotal.length).to.equal(1);
        });

        it("should fetch correct number of items listed by user",async()=>{
            await mintAnsList(tokenURI,auctionPrice);
            await mintAnsList(tokenURI,auctionPrice);
            await mintAnsList(tokenURI,auctionPrice);

            await nftMarket.connect(buyerAddress).createToken(tokenURI,auctionPrice,{value:listingPrice});
            let ownerOfListing = await nftMarket.fetchListedNft()
            expect(ownerOfListing.length).to.equal(3)
        })
    });

      describe("Ansar Test",async()=>{
        const tokenURI = "https://sample/";

        it("testing the functionality for front end",async()=>{

            let nftToken = await mintAnsList(tokenURI,auctionPrice);
            await mintAnsList(tokenURI,auctionPrice);
            let token2=   await mintAnsList(tokenURI,auctionPrice);
            let token3=   await mintAnsList(tokenURI,auctionPrice);


            await nftMarket.connect(buyerAddress).sale(nftToken, {value:auctionPrice});           

            let buyerTotal= await nftMarket.connect(buyerAddress).fetchMyNft();
            expect(buyerTotal.length).to.equal(1);

            await nftMarket.connect(buyerAddress2).sale(token2, {value:auctionPrice});
            await nftMarket.connect(buyerAddress2).sale(token3, {value:auctionPrice});

            let buyer2Total = await nftMarket.connect(buyerAddress2).fetchMyNft();
            expect(buyer2Total.length).to.equal(2);

        })

      })
})