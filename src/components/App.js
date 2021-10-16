import DStorage from '../abis/DStorage.json'
import { Component } from 'react';
import logo from '../logo.svg';
import Web3 from 'web3';
import './App.css';
import Navbar from './Navbar.js';
import Main from './Main';

const ipfsClient = require('ipfs-http-client');
const { CID } = require('ipfs-http-client');
const ipfs = ipfsClient.create({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' });

console.log("IPFS INSTANCE: ", ipfs);

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
      //Load files & sort by newest
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

  //Get file from user

  captureFile = event => {
    event.preventDefault();

    const file = event.target.files[0];
    const reader = new window.FileReader();

    reader.readAsArrayBuffer(file);
    reader.onloadend = () => {
      this.setState({
        buffer: Buffer(reader.result),
        type: file.type,
        name: file.name
      })
      console.log('buffer', this.state.buffer)
    }
  }

  //Upload file

  async uploadFile(description) {
    console.log('Submitting file to IPFS...');

    //Add file to IPFS
    
    const file = await ipfs.add(this.state.buffer);
    console.log(file);
    
    this.setState({ loading: true });

    if(this.state.type === '') {
      this.setState({ type: 'none' });
    }

    this.state.dstorage.methods.uploadFile(file.cid.toString(), file.size, this.state.type, this.state.name, description).send({ from: this.state.account }).on('transactionHash', (hash) => {
      this.setState({
        loading: false,
        type: null,
        name: null
      })
      window.location.reload()
    }).on('error', (e) => {
      window.alert('Error')
      console.error(e);
      this.setState({loading: false})
    })
  }



  constructor(props) {
    super(props);
    this.state = {
      account: '',
      dstorage: null,
      files: [],
      loading: true,
      buffer: null,
      type: null,
      name: null
    };
    this.uploadFile = this.uploadFile.bind(this);
    this.captureFile = this.captureFile.bind(this);
  }
  
  render() {
    return ( 
      <div>
        <Navbar account = { this.state.account } />
        { this.state.loading 
          ? <div id="loader" className="text-center mt-5"><p>Loading...</p></div>
          : <Main
              files={this.state.files}
              captureFile={this.captureFile}
              uploadFile={this.uploadFile}
            />
        }
      </div>
      
    );
  }
  
}

export default App;
