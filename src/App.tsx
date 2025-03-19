import React, { useState, useEffect } from "react";
import { Button, Card, CardContent, Typography } from "@mui/material";

const App = () => {
  const [ethPrice, setEthPrice] = useState<string | number>("Loading...");

  useEffect(() => {
    const fetchPrice = async () => {
      const price = await fetchEthereumPrice();
      setEthPrice(price);
    };

    fetchPrice();

    const interval = setInterval(fetchPrice, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchEthereumPrice = async () => {
    try {
      const response = await fetch(
        "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd"
      );
      const data = await response.json();
      return data.ethereum.usd;
    } catch (error) {
      console.error("Error fetching Ethereum price:", error);
      return "N/A";
    }
  };

  return (
    <Card sx={{ minWidth: 275, padding: 2 }}>
      <CardContent>
        <Typography variant="h5">Ethereum Price</Typography>
        <Typography variant="h4">${ethPrice}</Typography>
        <Button variant="contained" onClick={() => window.location.reload()}>
          Refresh
        </Button>
      </CardContent>
    </Card>
  );
};

export default App;