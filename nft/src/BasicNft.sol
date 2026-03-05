// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";

// my first nft contract!!
contract BasicNft is ERC721 {
    // throw this if it breaks
    error cantFindLinkError();

    // maps the token number to its web link
    mapping(uint256 => string) private links;

    // keeps track of how many we have created
    uint256 private counterStuff;

    // constructor runs at the beginning
    constructor() ERC721("Dogie", "DOG") {
        counterStuff = 0; // starting from 0!!
    }

    // call this to mint a new nft
    function mintNft(string memory theLink) public {
        // save the link in the mapping
        links[counterStuff] = theLink;

        // safely mint the nft to whoever called this
        _safeMint(msg.sender, counterStuff);

        // add 1 so the next one is different
        counterStuff = counterStuff + 1;
    }

    // function to view the link for a given id
    function tokenURI(
        uint256 theId
    ) public view override returns (string memory) {
        // check if nobody owns this picture yet
        if (ownerOf(theId) == address(0)) {
            // throw error
            revert cantFindLinkError();
        }

        // return the picture link
        return links[theId];
    }

    // reads the total counter
    function getTokenCounter() public view returns (uint256) {
        return counterStuff; // returns it
    }
}
