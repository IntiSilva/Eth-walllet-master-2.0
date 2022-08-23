import React, { Component } from 'react';
import usdtLogo from '../USDT-logo.png';
import './App.css';
import Web3 from 'web3';
import USDTMock from '../abis/USDTMock.json'

class App extends Component {
  async componentWillMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  }

  async loadBlockchainData() {
    const web3 = window.web3
    const accounts = await web3.eth.getAccounts();
    this.setState({ account: accounts[0] })
    const usdtTokenAddress = "0xA5DBd563f934CDDA5BE8d25ab6d6872fEf4d8947" // Replace token address here it's in the .json file of the token, ctrl+f and search "links"
    const usdtTokenMock = new web3.eth.Contract(USDTMock.abi, usdtTokenAddress)
    this.setState({ usdtTokenMock: usdtTokenMock })
    const balance = await usdtTokenMock.methods.balanceOf(this.state.account).call()
    this.setState({ balance: web3.utils.fromWei(balance.toString(), 'Mwei') })
    const transactions = await usdtTokenMock.getPastEvents('Transfer', { fromBlock: 0, toBlock: 'latest', filter: { from: this.state.account } })
    this.setState({ transactions: transactions })
  }

  transfer(recipient, amount) {
    this.state.usdtTokenMock.methods.transfer(recipient, amount).send({ from: this.state.account })
  }

  constructor(props) {
    super(props)
    this.state = {
      account: '',
      USDTMock: null,
      balance: 0,
      transactions: []
    }

    this.transfer = this.transfer.bind(this)
  }

  render() {
    return (
      <div>
        <div className="container-fluid p-2 bg-dark shadow ">
        <p class="h1 text-start text-light fs-5 mr-8">
          USDTM Wallet
        </p>
        </div>
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex justify-content-center">
              <div className="content mr-auto ml-auto" style={{ width: "400px" }}>
                  <img src={usdtLogo} class="rounded mx-auto d-block" width="150" alt="description" />
                <h1 class="text-lg-center">{this.state.balance} USDTM</h1>
                <form onSubmit={(event) => {
                  event.preventDefault()
                  const recipient = this.recipient.value
                  const amount = window.web3.utils.toWei(this.amount.value, 'Mwei')
                  this.transfer(recipient, amount)
                }}>
                  <div className="form-group mr-sm-2">
                    <input
                      id="recipient"
                      type="text"
                      ref={(input) => { this.recipient = input }}
                      className="form-control"
                      placeholder="Recipient Address"
                      required />
                  </div>
                  <div className="form-group mr-sm-2">
                    <input
                      id="amount"
                      type="text"
                      ref={(input) => { this.amount = input }}
                      className="form-control"
                      placeholder="Amount"
                      required />
                  </div>
                  <div class = "text-center mt-1">
                  <button type="submit" className="btn btn-primary btn-block">Send</button>
                  </div>
                </form>
                <table className="table">
                  <thead>
                    <tr>
                      <th scope="col">Recipient</th>
                      <th scope="col">Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    { this.state.transactions.map((tx, key) => {
                      return (
                        <tr key={key} >
                          <td>{tx.returnValues.to}</td>
                          <td>{window.web3.utils.fromWei(tx.returnValues.value.toString(), 'Mwei')}</td>
                        </tr>
                      )
                    }) }
                  </tbody>
                </table>
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
