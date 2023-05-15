import { Grid } from "@mui/material";
import { parseCookies } from 'nookies';
import Budgets from "../src/components/budgets";

const Tables = () => {
  return (
    <Grid container spacing={0}>
      <Grid item xs={12} lg={12}>
        <Budgets />
      </Grid>
    </Grid>
  );
};

export default Tables;
