pragma solidity ^0.8.0;
import "../node_modules/@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract luckySevenERC20 is ERC20("LuckySeven", "L7") {
    enum choices {
        below_seven,
        seven,
        above_seven
    }

    function mint(
        uint256 amount,
        address[] memory players,
        uint256 playerAmount
    ) public {
        _mint(address(this), amount);
        for (uint256 i = 0; i < players.length; i++) {
            _mint(players[i], playerAmount);
        }
    }

    event output(choices userChoice, uint256 result);

    function getLucky(choices choice, uint256 bet) public {
        require(balanceOf(address(this)) >= 2 * bet, "Not enough pool money");
        require(bet > 0, "Atleast a wei must be sent");
        require(balanceOf(msg.sender) >= bet, "Not enough balance");
        uint256 result = uint256(
            keccak256(
                abi.encodePacked(blockhash(block.number), block.timestamp)
            )
        ) % 14;
        if (
            (result == 7 && choice == choices.seven) ||
            (result < 7 && choice == choices.below_seven) ||
            (result > 7 && choice == choices.above_seven)
        ) {
            _transfer(address(this),msg.sender,bet);
        } else {
            transfer(address(this), bet);
        }
        emit output(choice, result);
    }
}
