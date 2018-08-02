import './App.css'

import React, {Component} from 'react'
import Web3 from 'web3'

const jsonInterface = [{"constant":true,"inputs":[],"name":"investmentReceived","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"endTime","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"investmentRefunded","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"unpause","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"finalize","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"refund","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"paused","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"startTime","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"pause","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"isFinalized","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"investmentAmountOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"weiInvestmentObjective","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"isRefundingAllowed","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"invest","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[],"name":"weiTokenPrice","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_recipient","type":"address"}],"name":"destroyAndSend","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"crowdsaleToken","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"name":"_startTime","type":"uint256"},{"name":"_endTime","type":"uint256"},{"name":"_weiTokenPrice","type":"uint256"},{"name":"_weiInvestmentObjective","type":"uint256"}],"payable":true,"stateMutability":"payable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"name":"investor","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"LogInvestment","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"investor","type":"address"},{"indexed":false,"name":"numTokens","type":"uint256"}],"name":"LogTokenAssignment","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"investor","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Refund","type":"event"}];

const InvestmentAmountOf = (props) =>
  props.investmentAmountOf !== undefined &&
    <div style={{marginTop: 10}}>
      Invested Amount: {props.investmentAmountOf}
    </div>;

const ContractInterface = (props) =>
  props.loading ?
    <div>Retrieving Value</div>
    :
    <div>
      <input
        style={{width: 280}}
        type='text'
        onChange={props.onChange}
      />
      <button onClick={props.callInvestmentAmountOf}>
        Investmented Amount
      </button>
      <InvestmentAmountOf {...props} />
    </div>;

class App extends Component {

  state = { loading: false };

  componentDidMount() {
    const web3 = new Web3(new Web3.providers.HttpProvider("https://ropsten.infura.io/TOKEN"));

    //block: 3759861 - where the my SimpleCrowdsale contract is deployed
    web3.eth.getBlock("latest", (error, result) => {
      this.setState({latest: result});
      console.log(jsonInterface);

      const contract = new web3.eth.Contract(jsonInterface, '0x921f25ae2441eb5b1bc2554f604e9539aad923fa', {
        from: '0xe55dd325e5a541329a7dcda10bca89d0119ebc76', // default from address
        gasPrice: '3000000'
      });


      this.setState({contract})
    });
  }

  onChange = (e) => {
    this.setState({value: e.target.value});
  }

  onResultFromInvestmentAmountOf = (result) => {
    this.setState({investmentAmountOf: result, loading: false});
  }

  callInvestmentAmountOf = () => {
    const { contract, value } = this.state;

    this.setState({loading: true});

    contract.methods.investmentAmountOf(value)
      .call({
        from: '0xe55dd325e5a541329a7dcda10bca89d0119ebc76'
      }, (error, result) => {
          this.onResultFromInvestmentAmountOf(result);
      });
  }

  render() {
    const { latest } = this.state;

    return <div className="App">
      <div className="App-heading App-flex">
        <h2>Welcome to <span className="App-react">SimpleCrowdsale</span></h2>
      </div>
      <div className="App-instructions App-flex">
      {latest == undefined ?
        <div>Connecting web3 to Provider...</div>
          :
          <ContractInterface
            {...this.state}
            onChange={this.onChange}
            callInvestmentAmountOf={this.callInvestmentAmountOf}
          />
      }
      </div>
    </div>
  }
}

export default App
