import { Grid } from "@mui/material";
import Sales from "../src/components/sales";
import { parseCookies } from 'nookies';

const Tables = () => {
  return (
    <Grid container spacing={0}>
      <Grid item xs={12} lg={12}>
        <Sales />
      </Grid>
    </Grid>
  );
};

export default Tables;
