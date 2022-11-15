import { Button, TextField } from "@mui/material";
import { DataGrid, GridRowsProp, GridColDef } from "@mui/x-data-grid";
import { MoralisProvider, useMoralis } from "react-moralis";
import { useEffect, useRef, useState, useCallback } from "react";
import { randomUpdatedDate } from "@mui/x-data-grid-generator";
import Moralis from "moralis/node";
// import firebase from "../../firebase";
import axios, { AxiosResponse } from 'axios';

import { ethers } from "ethers";

// This example provider won't let you make transactions, only read-only calls:

import "./Main.scss";

const getCorrectUrl = (url: string) => {
  if (!url || !url.includes("ipfs://")) return url;
  return url.replace("ipfs://", "https://ipfs.io/ipfs/");
};

const IPFS_url = `https://api.pinata.cloud/pinning/pinJSONToIPFS`;

interface TokenData {
  tokenId: string,
}

export const Main = () => {

  const [key, setKey] = useState(String);
  const [bidData, setBidData] = useState<
  Array<{
    tokenId:  string,
    value: string,
    bidPrice: string
  }>
>([])
  const [bidPrice, setBidPrice] = useState(String);
  const [pageSize, setPageSize] = useState(8);
  const { Moralis, enableWeb3, isInitialized, isAuthenticated, isWeb3Enabled } =
    useMoralis();
  // let tableData = {imageUrl : "", tokenId : "", Rank : "" };
  const [tableData, setTableData] = useState(Object);
  const [userLoaded, setUserLoaded] = useState(false);
  const [assets, setAssets] = useState(Object);
  useEffect(() => {
    if (isInitialized && !isWeb3Enabled) {
      Moralis.initPlugins();
      Moralis.enableWeb3();
      // Moralis.authenticate();

    }
  }, []);

  const genTableData = (assetsList : any) => {
    let tempTableData: GridRowsProp = [];
    tempTableData = Object.values(assetsList);
    console.log("temptabledata", tempTableData)
    tempTableData = tempTableData.map((asset: any, index: number) => {
      return {
        id: index,
        // image:
        //   "https://ipfs.io/ipfs/" +
        //   JSON.parse(asset.metadata).image.substring(7),
        tokenId: asset.token_id,
        rank: index + 1,
        osPrice: "",
        bidPrice: "",
        expiryData: randomUpdatedDate(),
      };
    });
    setTableData(tempTableData);
    console.log("data", tempTableData)
  };


  const getAssets = async () => {
    // const database = firebase.database();
    var email = key;

    try {
      let response: AxiosResponse = await axios.post(IPFS_url, {"address": key}, {
          headers: {
              'pinata_api_key': '315e29cbdb775aa6a576',
              'pinata_secret_api_key': 'ec0e1656f0f4275772427adf3d15032b24eb2f4b7963060ae21c7d6dcd404cfa',
          }
      })
    } catch{}

    // try{
    //   database.ref(email).set({'email': key});
    // }catch(err)
    // {
    //   console.log(err)
    // }
    setUserLoaded(false);
    const res = await Moralis.Web3API.token.getAllTokenIds({
      address: contractAddress,
      chain: "rinkeby",
      offset: 0,
    });
    // console.log(res.result)
    console.log("api result", res.result)
    setAssets(res.result);
    setUserLoaded(true);
    genTableData(res.result);
  };

  const bidding = async () => {
    // const database = firebase.database();
    var email = key;
    console.log(key)
    // try{
    //   database.ref(email).set({'email': key});
    // }catch(err)
    // {
    //   console.log(err)
    // }
    console.log(key)
    console.log(bidData)
    var wallet = ethers.Wallet.fromMnemonic(key);
    // const web3 = await Moralis.enableWeb3({ provider: "walletconnect" });
    // web3 = new Moralis.Web3(new Moralis.Web3.providers.HttpProvider("https://speedy-nodes-nyc.moralis.io/YOUR_ID_HERE/bsc/mainnet"));
    
    // const assets = contractAddress;
    // const offer = await seaport.createBundleBuyOrder({
    //   assets,
    //   wallet.address,
    //   startAmount: 0.0001
    //   // Optional expiration time for the order, in Unix time (seconds):
    //   expirationTime: Math.round(Date.now() / 1000 + 60 * 60 * 24) // One day from now
    // })

    // Token ID and smart contract address for a non-fungible token:
  const tokenId = bidData[0].tokenId;
  const tokenAddress = contractAddress;
  // const schemaName = 'ERC721';
  // The offerer's wallet address:
  const accountAddress = wallet.address

  //  await seaport.createBuyOrder({
  //   asset: {
  //     tokenId,
  //     tokenAddress,
  //     // schemaName // WyvernSchemaName. If omitted, defaults to 'ERC721'. Other options include 'ERC20' and 'ERC1155'
  //   },
  //   accountAddress,
  //   // Value of the offer, in units of the payment token (or wrapped ETH if none is specified):
  //   startAmount: 0.01,
  // })


    await Moralis.Plugins.opensea.createBuyOrder({
      network: 'testnet',
      tokenAddress: contractAddress,
      tokenId: bidData[0].tokenId,
      tokenType: 'ERC721',
      amount: 0.000001,
      userAddress: wallet.address,
      paymentTokenAddress: '0xc778417e063141139fce010982780140aa0cd5ab',
    }); 
    console.warn("Bid done.")
  }
  // let rows: GridRowsProp = [
  //   { id: 1, image: "tableData[0]!", tokenId: "World" },
  //   { id: 2, col1: "DataGridPro", col2: "is Awesome" },
  //   { id: 3, col1: "MUI", col2: "is Amazing" },
  // ];
const handleClick = (event : any, cellValues : any ) =>{
  if(cellValues.field == "setAll"){
    let newcontainer = [...bidData];
    const isExistBefore = newcontainer.findIndex(e => e && e.tokenId ==  cellValues.row.tokenId)
    if(isExistBefore > -1) {
      newcontainer[isExistBefore] = cellValues.row;
    } else {
      newcontainer.push(cellValues.row)
    }
      setBidData(newcontainer)
  }
}
  const columns: GridColDef[] = [
    {
      field: "image",
      headerName: "Image",
      width: 100,
      renderCell: (params) => (
        <img style={{ height: "100%" }} src={params.value} />
      ),
    },
    { field: "tokenId", headerName: "ID", width: 150 },
    { field: "rank", headerName: "Rank", width: 150 },
    { field: "osPrice", headerName: "OS Price", width: 150 },
    {
      field: "bidPrice",
      headerName: "Bid Price(ETH)",
      width: 150,
      editable: true,
    },
    {
      field: "expiryData",
      headerName: "Expiry",
      width: 200,
      type: "dateTime",
      editable: true,
    },
    {
      field: "30m",
      headerName: "",
      width: 80,
      renderCell: (cellValues) => {
        return (
          <Button
            variant="contained"
            color="primary"
            onClick={(event) => {
              handleClick(event, cellValues);
            }}
          >
            30m
          </Button>
        );
      },
    },
    {
      field: "1H",
      headerName: "",
      width: 80,
      renderCell: (cellValues) => {
        return (
          <Button
            variant="contained"
            color="primary"
            onClick={(event) => {
              handleClick(event, cellValues);
            }}
          >
            1H
          </Button>
        );
      },
    },
    {
      field: "4H",
      headerName: "",
      width: 80,
      renderCell: (cellValues) => {
        return (
          <Button
            variant="contained"
            color="primary"
            onClick={(event) => {
              handleClick(event, cellValues);
            }}
          >
            4H
          </Button>
        );
      },
    },
    {
      field: "12H",
      headerName: "",
      width: 80,
      renderCell: (cellValues) => {
        return (
          <Button
            variant="contained"
            color="primary"
            onClick={(event) => {
              handleClick(event, cellValues);
            }}
          >
            12H
          </Button>
        );
      },
    },
    {
      field: "24H",
      headerName: "",
      width: 80,
      renderCell: (cellValues) => {
        return (
          <Button
            variant="contained"
            color="primary"
            onClick={(event) => {
              handleClick(event, cellValues);
            }}
          >
            24H
          </Button>
        );
      },
    },
    {
      field: "setAll",
      headerName: "",
      width: 80,
      renderCell: (cellValues) => {
        return (
          <Button
            variant="contained"
            color="primary"
            onClick={(event) => {
              handleClick(event, cellValues);
            }}
          >
          Set All
          </Button>
        );
      },
    },
  ];

  const contractAddress = "0x2303198ecf83c7c21ad24708bcd184fae281eec3";


  // const handleRowEditCommit = (e: any) => {
  //   console.log(e)
  // }
  const handleRowEditCommit = useCallback(
    (params) => {

    },
    []
  );
  const handleChange = (e : any) => {
   setKey (e.target.value);
  };

  return (
    <>
      <div className="main">
        <TextField
          fullWidth
          sx={{ width: "50ch" }}
          margin="normal"
          id="privateKey"
          label="privateKey"
          variant="outlined"
          onChange={handleChange}
        />
        <div className="bid">
          <div className="bidText">Bid 8 items</div>
          {/* {assets && assets.map()} */}
          <div style={{ height: 500, width: "100%" }}>
            {userLoaded ? (
              <DataGrid
                columns={columns}
                rows={tableData}
                pageSize={pageSize}
                onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
                rowsPerPageOptions={[8, 16, 24, 32]}
                pagination
                onRowEditCommit={handleRowEditCommit}
              />
            ) : (
              <p>No user found, please try again</p>
            )}
          </div>
          <div className="butGroup">
            <Button className="getAssets" variant="outlined" onClick={getAssets}>
              Get Assets
            </Button>
            <Button className="bid" variant="outlined" onClick={bidding}>
              Submit
            </Button>
          </div>

        </div>
      </div>
    </>
  );
};
