import React, { Component } from 'react';
import usdtLogo from '../USDT-logo.png';
import './App.css';
import Web3 from 'web3';
import USDTMock from '../abis/USDTMock.json'
import 'bootstrap/dist/css/bootstrap.css'

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
      <>
        <nav className='navbar navbar-dark bg-dark shadow-lg '>
          <h1 className='navbar-brand ms-2'>USDTM Wallet</h1>
        </nav>

        <div class="container m-x4 my-4">
          <div class="row justify-content-center">
            <div class="col-md-6">

              <div class="card">
                <div className="d-flex justify-content-center align-items-center">
                  <img src={usdtLogo}  width="150"  alt="description" />
                </div>
               <div class="card-body">
               <h1 class=" card-title text-center font-bold">{this.state.balance} USDTM</h1>
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
                  <button type="submit" className="btn btn-outline-light btn-block">Send</button>
                  </div>
                </form>
                   <table class="table mt-4">
                   <thead>
                    <tr>
                      <th scope="col">Recipient</th>
                      <th scope="col">Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    { this.state.transactions.map((tx, key) => {
                      return (
                        <tr key={key}>
                          <td>{tx.returnValues.to}</td>
                          <td>{window.web3.utils.fromWei(tx.returnValues.value.toString(), 'Mwei')}</td>
                        </tr>
                      )
                    }) }
                  </tbody>
                  </table>
                </div>
        </div>
      </div>
    </div>
  </div>


      </>
    );
  }
}

export default App;
