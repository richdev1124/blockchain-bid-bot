import logo from './logo.svg';
import './App.css';
import { MoralisProvider, useMoralis } from "react-moralis";
import { Main } from './Component/Main/Main';

function App() {
  return (
    <div className="App">
      <MoralisProvider
        appId="HRI1D1PQpYQYv9QcYw9vZapOMBLAwEaCGvWwEqSf"
        serverUrl={"https://vyaaoxfolifj.usemoralis.com:2053/server"}
      >
      <Main/>
      </MoralisProvider>
    </div>
  );
}

export default App;
