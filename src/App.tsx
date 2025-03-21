import React, { useState, useEffect } from "react";
import { Card, CardContent, Typography, CircularProgress, Box } from "@mui/material";

const App = () => {
  const [ethUsd, setEthUsd] = useState<string | number>("Loading...");
  const [ethBtc, setEthBtc] = useState<string | number>("Loading...");
  const [ethUsdChange, setEthUsdChange] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchPrices();
    const interval = setInterval(fetchPrices, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchPrices = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(
        "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd,btc&include_24hr_change=true"
      );
      if (!response.ok) throw new Error("Failed to fetch prices");
      
      const data = await response.json();
      setEthUsd(formatPrice(data.ethereum.usd));
      setEthBtc(data.ethereum.btc.toFixed(8));
      setEthUsdChange(data.ethereum.usd_24h_change);
    } catch (error) {
      setError("Error fetching prices. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  return (
    <Box 
      display="flex" 
      justifyContent="center" 
      alignItems="center" 
      minHeight="100vh" 
      bgcolor="#121212" 
    >
      <Card sx={{ minWidth: 300, maxWidth: 400, padding: 3, textAlign: "center", bgcolor: "#1E1E1E", color: "white" }}>
        <CardContent>
          <Typography variant="h5" gutterBottom color="primary">
            Ethereum Prices
          </Typography>
          {loading ? (
            <CircularProgress color="secondary" />
          ) : error ? (
            <Typography color="error">{error}</Typography>
          ) : (
            <>
              <Typography variant="h4" sx={{ marginBottom: 2 }}>
                <Box display="flex" alignItems="center">
                  {ethUsd}
                  <Typography
                    variant="h6"
                    sx={{
                      marginLeft: 1,
                      color: ethUsdChange !== null && ethUsdChange < 0 ? "red" : "green",
                    }}
                  >
                    {ethUsdChange !== null ? "(" + ethUsdChange.toFixed(2) + "%)" : "N/A"}
                  </Typography>
                </Box>
              </Typography>
              <Typography variant="h4" sx={{ marginBottom: 2 }}>{ethBtc} BTC</Typography>
            </>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default App;
