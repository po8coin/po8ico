/* eslint-disable */
import React, { Component } from 'react';
import PO8TokenJson from '../build/contracts/PO8Token.json';

import getWeb3 from './utils/getWeb3';

/*components*/
import { Layout } from "./modules/components/layout/layout";
/*styles*/
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
        storageValue: 0,
        web3: null,
        accounts: []
    };
  }

  componentWillMount() {
    // Get network provider and web3 instance.
    // See utils/getWeb3 for more info.

    getWeb3
    .then(results => {
      this.setState({
        web3: results.web3
      });

      // Instantiate contract once web3 provided.
      //this.instantiateContract();
      this.getAccounts();
    })
    .catch((err) => {
      console.log('Error finding web3.' + err.message);
    })
  }


  getAccounts() {
      this.state.web3.eth.getAccounts((error, accounts) => {
            let newAccounts = [...this.state.accounts];
            for (let x = 0; x < accounts.length; x++) {
                newAccounts.push({address:accounts[x]});
            }
            newAccounts.forEach((account) => {
                account.etherBalance = this.state.web3.fromWei(
                    this.state.web3.eth.getBalance(account.address)
                );
            });

            const contract = require('truffle-contract');
            const Po8 = contract(PO8TokenJson);
            Po8.setProvider(this.state.web3.currentProvider);

            var Po8Instance;
            Po8.deployed().then((instance) => {
                 Po8Instance = instance;
                 return Po8Instance;
            }).then((instance) => {

                newAccounts.forEach((account, index) => {
                    Po8Instance.balanceOf.call(account.address).then ((result) => {
                        newAccounts[index].tokenBalance = result;
                        this.setState({
                            accounts: newAccounts
                        });
                    });
                });
                return instance;
            });

            /**/
      });
  }

  render() {
    return (
      <div className="App">

          {
              this.state.accounts.map((account, index) => {
                  return(
                      <p key={index.toString()}>
                          {account.address}
                          &nbsp;
                          {account.etherBalance.toString()} Ether
                          &nbsp;

                          {account.tokenBalance ? account.tokenBalance.toString() : 'e'} PO8
                      </p>
                  );
              })
          }

      </div>
    );
  }
}

export default App;
