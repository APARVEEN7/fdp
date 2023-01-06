import React, { Component } from "react";
import Web3 from "web3";
import "./App.css";
import certificateNFT from "../abis/certificateNFT.json";
import genCanvas from "./cetificate";

class App extends Component {
  async componentWillMount() {
    await this.loadWeb3();
    await this.loadBlockchainData();
    await this.loadContractData();
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
    this.setState({ web3: web3, account: accounts[0] });

    const networkId = await web3.eth.net.getId();
    const networkData = certificateNFT.networks[networkId];
    if (networkData) {
      const abi = certificateNFT.abi;
      const address = networkData.address;
      const contract = new web3.eth.Contract(abi, address);
      this.setState({ contract: contract, address: address });
    } else {
      window.alert("smart contract not deployed to detected network.");
    }
  }

  async loadContractData() {
    let totalSupply = await this.state.contract.methods.numberOfNFTs().call();
    console.log(totalSupply);
    this.setState({ totalSupply: totalSupply });
    for (var i = 0; i < totalSupply; i++) {
      let NFTId = await this.state.contract.methods.ids(i).call();
      let data = await this.state.contract.methods.pariticipents(NFTId).call();
      let name = data.name;
      let affiliation = data.affiliation;
      this.setState({
        participant: [...this.state.participant, { NFTId, name, affiliation }],
      });
      this.genCan(name,affiliation,NFTId)
    }

  }
  async callMint(name, affiliation) {
    console.log("name" + name);
    const result = await this.state.contract.methods
      .mint(name, affiliation)
      .send({ from: this.state.account });
     let id = result.events.certificateMinted.returnValues.id
    this.setState({
      participant: [...this.state.participant, { id ,name, affiliation }],
    });
    this.genCan(name,affiliation,id)
  }
  async genCan(name,affiliation,id) {
    const canvas = this.refs.canvas1;
    const ctx = canvas.getContext("2d");
   genCanvas(canvas, ctx, name, affiliation,id);
  }
  constructor(props) {
    super(props);
    this.state = {
    web3: "",
      account: "",
      address: "",
      contract: null,
      totalSupply: 0,
      participant: [
        {
         id:"",
          name: "",
          affiliation: "",
        },
      ],
    };
  }
 

  render() {
    return (
      <div>
        <div>
          <nav className="navbar navbar-dark fixed-top bg-light flex-md-nowrap p-0 shadow">
            <a className="navbar-brand col-sm-3 col-md-2 mr-0 ">
              Certificate NFTs
            </a>
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
              const name = this.name.value;
              const affiliation = this.affiliation.value;
              this.callMint(name, affiliation);
            }}
          >
            <div className="rowC">
              <div className="custom">
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  aria-describedby="mintHelp"
                  placeholder="Name"
                  ref={(name) => (this.name = name)}
                />
              </div>
              <div className="custom">
                <input
                  type="text"
                  className="form-control"
                  id="affiliation"
                  aria-describedby="mintHelp"
                  placeholder="Affiliation"
                  ref={(affiliation) => (this.affiliation = affiliation)}
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
        <div className="row">
          {this.state.participant.map((participant, key) => {
            return (
              <div key={key}>
                <canvas
                  id="certificate1"
                  ref="canvas1"
                  width="420"
                  height="200"
                ></canvas>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}
export default App;
