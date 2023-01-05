pragma solidity ^0.8.0;

import "../../node_modules/@openzeppelin/contracts/token/ERC721/ERC721.sol";
contract luckyCardsNFT is ERC721("LuckyCard","EN") {
    string[] public cards;
    mapping(string=>bool) _cardExists;
    uint public totalNFTs = 0;
    function mint(string memory card) public {
        require(!_cardExists[card],"cardId exists");
        cards.push(card);
        _mint(msg.sender, totalNFTs);
        totalNFTs++;
    }
}