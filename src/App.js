import React, { useEffect, useState, useCallback } from 'react';
import Web3 from 'web3';
import EZLottery from "./EZLottery.json";
import { Button, Paper, Typography, Box, AppBar, Toolbar } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import './App.css';
import myImage1 from './gambling.png';
import myImage2 from './rolete.png';

let web3, contract;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    backgroundColor: '#f5f5f5',
    backgroundImage: `url(${myImage2})`,
    backgroundSize: 'cover',
    [theme.breakpoints.down('sm')]: {
      height: 'auto',
      padding: theme.spacing(2),
    },
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    width: '100%',
    height: 'auto',
    margin: 'auto',
    [theme.breakpoints.down('sm')]: {
      width: '100%',
    },
  },
  button: {
    marginTop: theme.spacing(1),
  },
  title: {
    flexGrow: 1,
  },
  image: {
    width: '200px', 
    height: 'auto', 
    border: '2px solid black',
    [theme.breakpoints.down('sm')]: {
      width: '100%',
    },
  }
}));

function App() {
  const classes = useStyles();
  const [account, setAccount] = useState("");
  const [isMetaMaskInstalled, setMetaMaskInstalled] = useState(false);

  const connectWallet = useCallback(async () => {
    if (!window.ethereum) {
      console.log("Please install MetaMask");
      return;
    }
    
    web3 = new Web3(window.ethereum);
    try {
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      setAccount(accounts[0]);

      const contractAddress = "0x3Fd5FCcE475a20B55CB7d5fD49A6fC9367Ab8D38"; // replace with your contract's address
      contract = new web3.eth.Contract(EZLottery.abi, contractAddress);
    } catch (e) {
      console.error("User denied account access");
    }
  }, []);

  useEffect(() => {
    setMetaMaskInstalled(typeof window.ethereum !== 'undefined');
    connectWallet();
  }, [connectWallet]);

  async function mintTicket() {
    try {
      await contract.methods.mintTicket().send({ from: account, value: web3.utils.toWei("0.01", "ether") });
    } catch (e) {
      console.error("Error minting ticket", e);
    }
  }

  const buttonLabel = account 
    ? `${account.slice(0, 6)}...${account.slice(-4)}`
    : 'Connect to MetaMask';

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            EZ Lottery
          </Typography>
          {isMetaMaskInstalled ? (
            <Button variant="contained" style={{ backgroundColor: 'green', color: 'white' }} onClick={connectWallet}>
              {buttonLabel}
            </Button>
          ) : (
            <Typography variant="body1">
              Please install MetaMask
            </Typography>
          )}
        </Toolbar>
      </AppBar>
      <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" height="100vh">
        <Paper className={classes.paper}>
          <Typography variant="h4">EZ Lottery</Typography>
            <img src={myImage1} alt="NFT Placeholder" className={classes.image} />
          <Typography variant="h6">Price: 0.01 Matic</Typography>
          <Button
            className={classes.button}
            variant="contained"
            color="primary"
            onClick={mintTicket}
          >
            Mint Ticket
          </Button>
        </Paper>
      </Box>
    </div>
  );  
}

export default App;
