import twitterLogo from './assets/twitter-logo.svg';
import './App.css';
import { useEffect, useState } from 'react';
import idl from './idl.json';
import { Connection, PublicKey, clusterApiUrl } from '@solana/web3.js';
import { Program, Provider, web3 } from '@project-serum/anchor';

const { SystemProgram, Keypair } = web3;

let baseAccount = Keypair.generate();

const programID = new PublicKey(idl.metadata.address);

const network = clusterApiUrl('devnet');

const opts = {
  preflightCommitment: "processed"
}

// Constants
const TWITTER_HANDLE = 'didierganthier_';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

const TEST_GIFS = [
	'https://i.giphy.com/media/eIG0HfouRQJQr1wBzz/giphy.webp',
	'https://media3.giphy.com/media/L71a8LW2UrKwPaWNYM/giphy.gif?cid=ecf05e47rr9qizx2msjucl1xyvuu47d7kf25tqt2lvo024uo&rid=giphy.gif&ct=g',
	'https://media4.giphy.com/media/AeFmQjHMtEySooOc8K/giphy.gif?cid=ecf05e47qdzhdma2y3ugn32lkgi972z9mpfzocjj6z1ro4ec&rid=giphy.gif&ct=g',
	'https://i.giphy.com/media/PAqjdPkJLDsmBRSYUp/giphy.webp',
]

const App = () => {

  // State
  const [walletAddress, setWalletAddress] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [gifList, setGifList] = useState([]);

  const checkIfWalletIsConnected = async () => {
    try {
      const { solana } = window;

      if (solana) {
        if (solana.isPhantom) {
          console.log('Phantom Wallet found!');

          const response = await solana.connect({ onlyIfTrusted: true });
          console.log(
            'Connected with Public Key: ',
            response.publicKey.toString()
          )

          setWalletAddress(response.publicKey.toString())
        }
      } else {
        alert('Solana object not found! Get a Phantom Wallet 👻');
      }
    } catch (error) {
      console.error(error);
    }
  }

  const connectWallet = async () => {
    const { solana } = window;

    if(solana){
      const response = await solana.connect();
      console.log('Connected with Public Key: ', response.publicKey.toString());
      setWalletAddress(response.publicKey.toString());
    }
  };

  const sendGif = async () => {
    if(inputValue.length > 0){
      console.log('Gif link: ', inputValue);
      setGifList([...gifList, inputValue]);
      setInputValue('')
    } else {
      console.log('Empty input. Try again.')
    }
  }

  const onInputChange = (event) => {
    const { value } = event.target;
    setInputValue(value);
  }
  
  const getProvider = () => {
    const connection = new Connection(network, opts.preflightCommitment);
    const provider = new Provider(
      connection, window.solana, opts.preflightCommitment,
    );
  }

  const renderNotConnecteContainer = () => (
    <button className='cta-button connect-wallet-button' onClick={connectWallet}>
      Connect to Wallet
    </button>
  )

  const renderConnectedContainer = () => (
    <div className='connected-container'>
      <form onSubmit={(event) => {
        event.preventDefault();
        sendGif();
      }}>
        <input type="text" placeholder='Enter gif link!' value={inputValue} onChange={onInputChange}/>
        <button type='submit' className='cta-button submit-gif-button'>Submit</button>
      </form>
      <div className='gif-grid'>
        {gifList.map(gif => (
          <div className='gif-item' key={gif}>
            <img src={gif} alt={gif}/>
          </div>
        ))}
      </div>
    </div>
  );

  useEffect(() => {
    const onLoad = async () => {
      await checkIfWalletIsConnected();
    };
    window.addEventListener('load', onLoad);
    return () => window.removeEventListener('load', onLoad);
  }, []);

  useEffect(() => {
    if(walletAddress) {
      setGifList(TEST_GIFS);
    }
  },[walletAddress])

  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header">🖼 GIF Portal</p>
          <p className="sub-text">
            View your GIF collection in the metaverse ✨
          </p>
          {!walletAddress && renderNotConnecteContainer()}
          {walletAddress && renderConnectedContainer()}
        </div>
        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`built by @${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  );
};

export default App;
