import React, { useState, useEffect } from "react";
import { Button, Card, CardContent, Typography } from "@mui/material";

const App = () => {
  const [ethUsd, setEthUsd] = useState<string | number>("Loading...");
  const [ethBtc, setEthBtc] = useState<string | number>("Loading...");

  useEffect(() => {
    const fetchPrices = async () => {
      const { ethUsd, ethBtc } = await fetchEthereumPrices();
      setEthUsd(ethUsd);
      setEthBtc(ethBtc);
    };

    fetchPrices();

    const interval = setInterval(fetchPrices, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchEthereumPrices = async () => {
    try {
      const response = await fetch(
        "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd,btc"
      );
      const data = await response.json();
      return {
        ethUsd: data.ethereum.usd,
        ethBtc: data.ethereum.btc,
      };
    } catch (error) {
      console.error("Error fetching Ethereum prices:", error);
      return { ethUsd: "N/A", ethBtc: "N/A" };
    }
  };

  return (
    <Card sx={{ minWidth: 275, padding: 2 }}>
      <CardContent>
        <Typography variant="h5">Ethereum Prices</Typography>
        <Typography variant="h4">${ethUsd} USD</Typography>
        <Typography variant="h4">{ethBtc} BTC</Typography>
        <Button variant="contained" onClick={() => window.location.reload()}>
          Refresh
        </Button>
      </CardContent>
    </Card>
  );
};

export default App;
