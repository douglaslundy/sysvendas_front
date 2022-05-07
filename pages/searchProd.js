import { Grid} from "@mui/material";
import ShowProduct from "../src/components/showProduct";
import { parseCookies } from 'nookies'
const Tables = () => {
  return (
    <Grid container spacing={0}>
      <Grid item xs={12} lg={12}>
        <ShowProduct />
      </Grid>
    </Grid>
  );
};

export default Tables;
