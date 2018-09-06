import './App.css'

import React, {Component} from 'react'
import Web3 from 'web3'

const jsonInterface = [{"constant":true,"inputs":[],"name":"investmentReceived","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"endTime","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"investmentRefunded","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"unpause","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"finalize","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"refund","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"paused","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"startTime","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"pause","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"isFinalized","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"investmentAmountOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"weiInvestmentObjective","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"isRefundingAllowed","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"invest","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[],"name":"weiTokenPrice","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_recipient","type":"address"}],"name":"destroyAndSend","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"crowdsaleToken","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"name":"_startTime","type":"uint256"},{"name":"_endTime","type":"uint256"},{"name":"_weiTokenPrice","type":"uint256"},{"name":"_weiInvestmentObjective","type":"uint256"}],"payable":true,"stateMutability":"payable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"name":"investor","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"LogInvestment","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"investor","type":"address"},{"indexed":false,"name":"numTokens","type":"uint256"}],"name":"LogTokenAssignment","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"investor","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Refund","type":"event"}];

const InvestmentAmountOf = (props) =>
  props.investmentAmountOf !== undefined &&
    <div style={{marginTop: 10}}>
      Invested Amount: {props.investmentAmountOf}
    </div>;

const Invest = (props) =>
  props.loadingInvest ?
    <div>{'Investing your hard earned money. Please wait...'}</div>
    :
    <div>
      <input
        type='text'
        onChange={props.onChangeInvest}
      />
    <span style={{marginLeft: 5, marginRight: 5}}>wei</span>
      <button onClick={props.callInvest}>
        Invest
      </button>
    </div>;

const ContractInterface = (props) =>
  props.loading ?
    <div>Retrieving Value</div>
    :
    <div>
      <div>Using account: {props.account}</div>
      <input
        style={{width: 300, marginRight: 5}}
        type='text'
        onChange={props.onChange}
      />
      <button onClick={props.callInvestmentAmountOf}>
        Investmented Amount
      </button>
      <InvestmentAmountOf {...props} />
      <Invest {...props} />
    </div>;

class App extends Component {

  state = { loading: false, loadingInvest: false };

  componentDidMount() {
    //const web3 = new Web3(new Web3.providers.HttpProvider("https://ropsten.infura.io/TOKEN"));
    //use the MetaMask Plugin if its available.
    const web3 = new Web3(window.web3.currentProvider);

    web3.eth.getAccounts()
      .then(accounts => {

        this.setState({account: accounts[0]});
        console.log(`Found account: ${accounts[0]}`);

        const contract = new web3.eth.Contract(jsonInterface, '0x921f25ae2441eb5b1bc2554f604e9539aad923fa', {
          from: accounts[0], // default from address
          gasPrice: '3000000'
        });

        this.setState({contract})
      });
  }

  onChange = (e) => {
    this.setState({value: e.target.value});
  }

  onChangeInvest = (e) => {
    this.setState({investValue: e.target.value});
  }

  onResultFromInvestmentAmountOf = (result) => {
    this.setState({investmentAmountOf: result, loading: false});
  }

  callInvestmentAmountOf = (result) => {
    const { contract, value, account } = this.state;

    this.setState({loading: true});

    contract.methods.investmentAmountOf(value)
      .call({
        from: account
      }, (error, result) => {
          this.onResultFromInvestmentAmountOf(result);
      });
  }

  onResultFromInvest = (result) => {
    //console.log(JSON.stringify(result));
    this.setState({loadingInvest: false});
  }

  callInvest = () => {
    const { contract, investValue, account } = this.state;

    this.setState({loadingInvest: true});

    contract.invest({
        from: account,
        gasPrice: '3000000',
        gas: 3000000,
        value: investValue
    }, (error, result) => {
          this.onResultFromInvest(result);
    });
  }

  render() {
    const { account } = this.state;

    return <div className="App">
      <div className="App-heading App-flex">
        <h2>Welcome to <span className="App-react">SimpleCrowdsale</span></h2>
      </div>
      <div className="App-instructions App-flex">
      {account == undefined ?
        <div>Connecting web3 to Provider...</div>
          :
          <ContractInterface
            {...this.state}
            onChange={this.onChange}
            onChangeInvest={this.onChangeInvest}
            callInvestmentAmountOf={this.callInvestmentAmountOf}
            callInvest={this.callInvest}
          />
      }
      </div>
    </div>
  }
}

export default App
