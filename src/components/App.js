import { Component } from 'react';
import logo from '../logo.svg';
import Web3 from 'web3';
import './App.css';
import Navbar from './Navbar.js';

class App extends Component {
  
  async componentDidMount() {
    await this.loadWeb3();
    await this.loadBlockchainData();
  }

  async loadWeb3() {
    if(window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
    }

    else if(window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    }

    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  }

  async loadBlockchainData() {
    const web3 = window.web3;

    //Load Accounts
    const accounts = await web3.eth.getAccounts();
    this.setState({ account: accounts[0]});

    this.setState({loading: false});
  }

  constructor(props) {
    super(props);
    this.state = {
      loading: true
    };
  }
  
  render() {
    return ( 
      <div>
        <Navbar account = { this.state.account } />
        { this.state.loading 
          ? <div id="loader" className="text-center mt-5"><p>Loading...</p></div>
          : <div>YEETBOI</div>
        }
      </div>
      
    );
  }
  
}

export default App;
