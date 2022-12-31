import React, { Component } from "react";
import Web3 from "web3";
import "./App.css";
import luckySevenERC20 from "../abis/luckySevenERC20.json";

class App extends Component {
  async componentWillMount() {
    console.log("I ama here!!");
    await this.loadWeb3();
    await this.loadBlockchainData();
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      window.alert("Non-Ethereum browser detected. Try metamask");
    }
  }
  async loadBlockchainData() {
    const web3 = window.web3;
    const accounts = await web3.eth.getAccounts();
    this.setState({ account: accounts[0] });

    const networkId = await web3.eth.net.getId();
    const networkData = luckySevenERC20.networks[networkId];
    if (networkData) {
      const abi = luckySevenERC20.abi;
      const address = networkData.address;
      const contract = new web3.eth.Contract(abi, address);
      this.setState({ contract:contract, address:address });
      const owner = await contract.methods.owner().call();
      const contractTokens = await this.state.contract.methods
        .balanceOf(this.state.address)
        .call({ from: this.state.account });
      const playerTokens = await this.state.contract.methods
        .balanceOf(this.state.account)
        .call({ from: this.state.account });
      this.setState({
        owner: owner,
        contractTokens: contractTokens,
        playerTokens: playerTokens,
      });
    } else {
      window.alert("smart contract not deployed to detected network.");
    }
  }
  async callMint(receiverAddress, receiverTokens) {
    const result = await this.state.contract.methods
      .mint(receiverAddress, receiverTokens)
      .send({ from: this.state.account });

    console.log(result);
  }
  async getChoice(choice) {
    console.log(choice);
    if (
      this.state.bet.value === 0 ||
      this.state.bet.value === "" ||
      this.state.bet.value === undefined
    ) {
      window.alert("Enter bet amount");
    } else {
      const res = await this.state.contract.methods
        .getLucky(choice, this.state.bet.value)
        .send({ from: this.state.account });
      let playerChoice = res.events.output.returnValues.playerChoice;
      let computerChoice = res.events.output.returnValues.computerChoice;
      let result = res.events.output.returnValues.result;
      let stringResult=""
      if (result===true){
        stringResult = "win"
      } else {
        stringResult = "lose"
      }
      this.setState({
        playerChoice: playerChoice,
        computerChoice: computerChoice,
        result: stringResult,
      });
    }
    this.getLatestBalance()
  }
 async getLatestBalance() {
    const contractTokens = await this.state.contract.methods
    .balanceOf(this.state.address)
    .call({ from: this.state.account });
  const playerTokens = await this.state.contract.methods
    .balanceOf(this.state.account)
    .call({ from: this.state.account });
  this.setState({
    contractTokens: contractTokens,
    playerTokens: playerTokens,
  });
 }
  constructor(props) {
    super(props);
    this.state = {
      account: "",
      address:"",
      contract: null,
      owner: "",
      contractTokens: "",
      playerTokens: "",
      playerChoice: "",
      computerChoice: "",
      result: "",
    };
  }
  render() {
    return (
      <div className="center1">
        <div>
          <nav className="navbar navbar-dark fixed-top bg-light flex-md-nowrap p-0 shadow">
            <a className="navbar-brand col-sm-3 col-md-2 mr-0 ">Lucky Seven</a>
            <span id="account" className="nav-item navbar-nav ">
              {this.state.account}
            </span>
          </nav>
        </div>
        <div>&nbsp;</div>
        <div>&nbsp;</div>
        <div className="col-md-6 col-md-offset-4">
          <form
            onSubmit={(event) => {
              event.preventDefault();
              const receiverAddress = this.receiverAddress.value;
              const receiverTokens = this.receiverTokens.value;
              this.callMint(receiverAddress, receiverTokens);
            }}
          >
            <div className="rowC">
             
              <div className="custom">
                <input
                  type="text"
                  className="form-control"
                  id="receiverAddress"
                  aria-describedby="mintHelp"
                  placeholder="Receiver address"
                  ref={(receiverAddress) =>
                    (this.receiverAddress = receiverAddress)
                  }
                />
              </div>
              <div className="custom">
                <input
                  type="text"
                  className="form-control"
                  id="receiverTokens"
                  aria-describedby="mintHelp"
                  size="500"
                  placeholder="Receiver tokens"
                  ref={(receiverTokens) =>
                    (this.receiverTokens = receiverTokens)
                  }
                />
              </div>
              <div className="col-md-2 custom">
                <button type="submit" className="btn btn-primary">
                  Mint
                </button>
              </div>
            </div>
          </form>
          <div className="custom">
            <input
              type="text"
              className="form-control"
              id="bet"
              aria-describedby="mintHelp"
              size="50"
              placeholder="Enter bet"
              ref={(bet) => (this.state.bet = bet)}
            />
          </div>
          <div className="rowC ">
            <div className="custom">
              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  const choice = 0;
                  this.getChoice(choice);
                }}
              >
                <button className="bn5">
                  <img
                    src="/images/less_seven.png"
                    width="100"
                    alt="Less_Than_Seven"
                  />
                </button>
              </form>
            </div>
            <div className="custom">
              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  const choice = 1;
                  this.getChoice(choice);
                }}
              >
                <button className="bn5">
                  <img src="/images/seven.png" width="100" alt="Seven" />
                </button>
              </form>
            </div>
            <div className="custom">
              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  const choice = 2;
                  this.getChoice(choice);
                }}
              >
                <button className="bn5">
                  <img
                    src="/images/greater_seven.png"
                    width="100"
                    alt="Greater_Than_Seven"
                  />
                </button>
              </form>
            </div>
          </div>
        </div>
        <div className="center col-md-6 col-md-offset-4">
            <table border={2}>
                <tbody>
                <tr><td><span>User choice </span></td><td><span>{this.state.playerChoice}</span></td></tr>
                <tr><td><span>Computer choice </span></td><td><span>{this.state.computerChoice}</span></td></tr>
                <tr><td><span>Result </span> </td><td><span>{this.state.result}</span></td></tr>
                <tr><td><span>Player Balance  </span></td><td><span>{this.state.playerTokens}</span></td></tr>
                <tr><td><span>Computer Balance </span></td><td><span>{this.state.contractTokens}</span></td></tr>
                </tbody>
            </table>
          
          
         
          
         
        </div>
      </div>
    );
  }
}
export default App;
