pragma solidity ^0.8.0;
import "../../node_modules/@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "../../node_modules/@openzeppelin/contracts/access/Ownable.sol";

contract luckySevenERC20 is ERC20("LuckySeven", "L7"), Ownable {
    enum choices {
        below_seven,
        seven,
        above_seven
    }
    constructor(){
       _mint(address(this), 10000);
    }

    function mint(
        address player,
        uint256 amount
    ) public onlyOwner {
        _mint(player, amount);
    }

    event output(choices playerChoice, choices computerChoice, bool result);

    function getLucky(choices userChoice, uint256 bet) public {
        require(balanceOf(address(this)) >= 2 * bet, "Not enough pool money");
        require(bet > 0, "Atleast a wei must be sent");
        require(balanceOf(msg.sender) >= bet, "Not enough balance");
        bool result;
        choices computerChoice;
        uint256 computerNumber = uint256(
            keccak256(
                abi.encodePacked(blockhash(block.number), block.timestamp)
            )
        ) % 14;
        computerChoice = computerNumber<7? choices.below_seven:computerNumber<7?choices.seven:choices.above_seven;
        if (userChoice == computerChoice) {
            result = true;
            _transfer(address(this), msg.sender, bet);
        } else {
            transfer(address(this), bet);
        }
        emit output(userChoice, computerChoice, result);
    }
}
