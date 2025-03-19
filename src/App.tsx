import { Card, CardContent, Typography } from "@mui/material";

const App = () => {
  return (
    <Card sx={{ minWidth: 275, padding: 2 }}>
      <CardContent>
        <Typography variant="h5">Hello, this is my ETH extension!</Typography>
      </CardContent>
    </Card>
  );
};

export default App;