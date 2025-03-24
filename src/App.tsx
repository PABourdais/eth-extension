import React, { useState, useEffect } from "react";
import { CardContent, Typography, CircularProgress, Box, Button, useMediaQuery } from "@mui/material";
import Tooltip from "@mui/material/Tooltip";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const App = () => {
  const [ethUsd, setEthUsd] = useState<string | number>("Loading...");
  const [ethBtc, setEthBtc] = useState<string | number>("Loading...");
  const [ethUsdChange, setEthUsdChange] = useState<number | null>(null);
  const [ethBtcChange, setEthBtcChange] = useState<number | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

  const theme = createTheme({
    palette: {
      mode: prefersDarkMode ? "dark" : "light",
    },
  });

  useEffect(() => {
    try {
      const savedData = localStorage.getItem("ethData");
      if (savedData) {
        const { ethUsd, ethBtc, ethUsdChange, ethBtcChange, lastUpdated, timestamp } = JSON.parse(savedData);
        const isDataFresh = Date.now() - timestamp < 30000;
        if (isDataFresh) {
          setEthUsd(ethUsd);
          setEthBtc(ethBtc);
          setEthUsdChange(ethUsdChange);
          setEthBtcChange(ethBtcChange);
          setLastUpdated(lastUpdated)
          setLoading(false);
          return;
        }
      }
    } catch (error) {
      console.warn("LocalStorage is not available or data is corrupted.");
    }
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
      const formattedEthUsd = formatPrice(data.ethereum.usd);
      const formattedEthBtc = data.ethereum.btc.toFixed(8);
      const ethUsdChangeValue = data.ethereum.usd_24h_change;
      const ethBtcChangeValue = data.ethereum.btc_24h_change;

      setEthUsd(formattedEthUsd);
      setEthBtc(formattedEthBtc);
      setEthUsdChange(ethUsdChangeValue);
      setEthBtcChange(ethBtcChangeValue);
      setLastUpdated(new Date().toLocaleString());

      localStorage.setItem(
        "ethData",
        JSON.stringify({
          ethUsd: formattedEthUsd,
          ethBtc: formattedEthBtc,
          ethUsdChange: ethUsdChangeValue,
          ethBtcChange: ethBtcChangeValue,
          timestamp: Date.now(),
        })
      );
    } catch (error) {
      setError(error instanceof Error ? error.message : "An unexpected error occurred.");
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
    <ThemeProvider theme={theme}>
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        flexDirection="column" 
        minHeight="100vh" 
        sx={{ 
          width: 600,
          bgcolor: theme.palette.background.paper,
         }}
      >
        <Box 
          sx={{ 
            minWidth: 450,
            maxWidth: 600,
            padding: 3, 
            textAlign: "center", 
            bgcolor: theme.palette.background.paper,
            color: theme.palette.text.primary,
          }}
        >
          <CardContent>
            <Typography variant="h5" gutterBottom color="primary" sx={{ marginBottom: 4 }}>
              Ethereum Prices
            </Typography>
            {loading ? (
              <CircularProgress color="secondary" />
            ) : error ? (
              <Typography color="error">{error}</Typography>
            ) : (
              <>
                <Typography variant="h4" sx={{ marginBottom: 2 }}>
                  <Box display="flex" justifyContent="center" alignItems="center">
                    {ethUsd}
                    <Typography
                      variant="body2"
                      sx={{
                        marginLeft: 1,
                        color: ethUsdChange !== null && ethUsdChange < 0 ? "red" : "green",
                      }}
                    >
                      {ethUsdChange !== null ? "(" + ethUsdChange.toFixed(2) + "%)" : "N/A"}
                    </Typography>
                  </Box>
                </Typography>
                <Typography variant="h4" sx={{ marginBottom: 2 }}>
                  <Box display="flex"  justifyContent="center" alignItems="center">
                    ₿{ethBtc}
                    <Typography
                      variant="body2"
                      sx={{
                        marginLeft: 1,
                        color: ethBtcChange !== null && ethBtcChange < 0 ? "red" : "green",
                      }}
                    >
                      {ethBtcChange !== null ? "(" + ethBtcChange.toFixed(2) + "%)" : "N/A"}
                    </Typography>
                  </Box>
                </Typography>
              </>
            )}
            <Button 
              variant="contained" 
              color="primary" 
              onClick={fetchPrices} 
              disabled={loading}
              sx={{ marginTop: 2 }}
              aria-label="Refresh Ethereum prices"
            >
              Refresh Data
            </Button>
            <Typography 
              variant="body2" 
              color="gray" 
              sx={{ marginTop: 1 }}
            >
              Last updated: {lastUpdated || "Fetching..."}
          </Typography>
          </CardContent>
        </Box>
        <Typography 
          variant="body2" 
          color="gray" 
          sx={{ marginTop: 1 }}
        >
          Developed by Pierre-Alexandre Bourdais
        </Typography>
        <Tooltip title="Visit CoinGecko for cryptocurrency data" arrow>
          <Typography 
            variant="body2" 
            color="gray" 
            sx={{ marginTop: 1, marginBottom: 2 }}
          >
            Powered by <a href="https://www.coingecko.com/" target="_blank" style={{ color: "#007bff", textDecoration: "none" }} rel="noreferrer" aria-label="Visit CoinGecko website">CoinGecko API</a>
          </Typography>
        </Tooltip>
      </Box>
    </ThemeProvider>
  );
};

export default App;