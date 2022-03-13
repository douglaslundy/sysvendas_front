import { Grid } from "@mui/material";
import Clients from "../src/components/clients";

const Tables = () => {
  return (
    <Grid container spacing={0}>
      <Grid item xs={12} lg={12}>
        <Clients />
      </Grid>
    </Grid>
  );
};

export default Tables;




