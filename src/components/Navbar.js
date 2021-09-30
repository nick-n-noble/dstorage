import { Component } from 'react';
import Identicon from 'identicon';
import logo from '../logo.svg';

class Navbar extends Component {
  render() {
    return (
      <nav className="navbar navbar-dark bg-dark p-0 text-monospace">
        <h3 className="text-white">
          <img src={logo} width="30" height="30" className="align-top" alt="" />
          DStorage
        </h3>
        <ul className="navbar-nav px-3">
          <b className="text-white px-3">{this.props.account}</b>
        </ul>
      </nav>
    );
  }
}

export default Navbar;