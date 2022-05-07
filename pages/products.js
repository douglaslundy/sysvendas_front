import { Grid} from "@mui/material";
import Products from "../src/components/products";
import { parseCookies } from 'nookies'

const Tables = () => {
  return (
    <Grid container spacing={0}>
      <Grid item xs={12} lg={12}>
        <Products />
      </Grid>
    </Grid>
  );
};

export default Tables;