pragma solidity ^0.8.0;
contract simpleEtherTransfer {
    function etherTransfer(address payable receiver) public payable {
        receiver.transfer(msg.value);
    }
}