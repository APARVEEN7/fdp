pragma solidity ^0.8.0;

import "../../node_modules/@openzeppelin/contracts/token/ERC721/ERC721.sol";
contract certificateNFT is ERC721("XavierFDP","Xavier") {
    struct participent {
        string name;
        string affiliation;
    }    
    mapping(uint32=>participent) public pariticipents;
    mapping(uint32=>bool) public pariticipentExsists;
    uint[] public ids;
    uint public numberOfNFTs=0;
    event certificateMinted(uint32 id, string name, string affiliation);
    function mint(string memory name, string memory affiliation) public {
        uint32 id = uint32(uint256(keccak256(abi.encodePacked(name,affiliation))));
        require(!pariticipentExsists[id],"id exists");
        pariticipentExsists[id] = true;
        pariticipents[id].name = name;
        pariticipents[id].affiliation = affiliation;
        ids.push(id);
        numberOfNFTs++;
        _mint(msg.sender, id);
        emit certificateMinted(id, name, affiliation);
    }
}