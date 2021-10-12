import DStorage from '../abis/DStorage.json'
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

    //Network ID
    const networkId = await web3.eth.net.getId();
    const networkData = DStorage.networks[networkId];
    if(networkData) {
      //Assign contract
      const dstorage = new web3.eth.Contract(DStorage.abi, networkData.address);
      this.setState({ dstorage });
      //Get files amount
      const filesCount = await dstorage.methods.fileCount().call();
      this.setState({ filesCount });
      //Load fikes & sort by newest
      for(var i = filesCount; i >= 1; i--) {
        const file = await dstorage.methods.files(i).call();
        this.setState({
          files: [...this.state.files, file]
        });
      }
      //console.log(this.state.files)
    } else {
      window.alert('DStorage contract not deployed to detected network.');
    }

    this.setState({loading: false});
  }

  constructor(props) {
    super(props);
    this.state = {
      account: '',
      dstorage: null,
      files: [],
      loading: true,
      type: null,
      name: null
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
