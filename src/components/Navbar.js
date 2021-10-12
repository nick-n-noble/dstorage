import { Component } from 'react';
import Identicon from 'identicon';
import logo from '../logo.svg';




class Navbar extends Component {
  
  shortAccountString() {
    let accountString;
    if(this.props.account) {
      accountString = this.props.account.substring(0,6) + '...' + this.props.account.substring(38,42);
    }
    else {
      accountString = '0x0';
    }
    return accountString;
  }

  
  render() {
    return (
      <nav className="navbar navbar-dark bg-dark p-0 text-monospace">
        <h3 className="text-white">
          <img src={logo} width="30" height="30" className="align-top" alt="" />
          DStorage
        </h3>
        <ul className="navbar-nav px-3">
          <b className="text-white px-3">
            {this.shortAccountString()}
          </b>
        </ul>
      </nav>
    );
  }
}

export default Navbar;