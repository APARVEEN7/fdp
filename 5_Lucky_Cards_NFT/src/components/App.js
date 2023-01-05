import React, { Component } from "react";
import Web3 from "web3";
import "./App.css";
import luckyCardsNFT from "../abis/luckyCardsNFT.json";

class App extends Component {
  async componentWillMount() {
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
    const networkData = luckyCardsNFT.networks[networkId];
    if (networkData) {
      const abi = luckyCardsNFT.abi;
      const address = networkData.address;
      const contract = new web3.eth.Contract(abi, address);
      this.setState({ contract:contract, address:address });


      const totalSupply = await contract.methods.totalNFTs
      this.setState({ totalSupply:totalSupply });

      for (var i=0;i<totalSupply;i++){
        const card = await contract.methods.cards[i].call();
        this.setState({
            cards: [...this.state.cards,card]
        })
      }

    } else {
      window.alert("smart contract not deployed to detected network.");
    }
  }
  async callMint(card) {
    console.log("card"+card)
    const result = await this.state.contract.methods
      .mint(card)
      .send({ from: this.state.account });
      this.setState({
        cards: [...this.state.cards,card]
    })
    console.log("I am here 2")
  }
  

  constructor(props) {
    super(props);
    this.state = {
      account: "",
      address:"",
      contract: null,
      totalSupply:0,
      cards: []
    };
  }
  render() {
    return (
      <div>
        <div>
          <nav className="navbar navbar-dark fixed-top bg-light flex-md-nowrap p-0 shadow">
            <a className="navbar-brand col-sm-3 col-md-2 mr-0 ">Lucky Seven cards</a>
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
              const card = this.card.value;
              this.callMint(card);

            }}
          >
            <div className="rowC">             
              <div className="custom">
                <input
                  type="text"
                  className="form-control"
                  id="card"
                  aria-describedby="mintHelp"
                  placeholder="card"
                  ref={(card) =>
                    (this.card = card)
                  }
                />
              </div>
              <div className="col-md-2 custom">
                <button type="submit" className="btn btn-primary">
                  Mint NFT
                </button>
              </div>
            </div>
          </form>
          </div>
          <div className="row text-center" >
            {this.state.cards.map((card,key)=>{
              let cardColor;
              let cardType;
              let cardNumber;
                if(card[0]==1) {
                  cardColor = "#FF0000"
                } else {
                  cardColor = "#0000FF"
                }
                if (card[1]==0 && card[2]==0) {
                  cardType = "Diamond"
                }
                if (card[1]==0 && card[2]==1) {
                  cardType = "Spade"
                }
                if (card[1]==1 && card[2]==0) {
                  cardType = "Heart"
                }
                if (card[1]==1 && card[2]==1) {
                  cardType = "Club"
                }
                let arr = card.slice(3)
                cardNumber = parseInt(arr,2)
               return( <div key={key} className="col-md-3 mb-3"> 
                  <div className="card" style={{backgroundColor: cardColor}} > 
                  <div><span>{cardType}</span></div>
                  <div><span>{cardNumber}</span></div>
                  </div>
                    <div>{card}</div>
                </div>) 
            })}
          </div>
        </div> 
    );
  }
}
export default App;
