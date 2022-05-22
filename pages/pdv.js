import { Grid} from "@mui/material";
import { parseCookies } from 'nookies'
import Pdv from "../src/components/pdv";
const Tables = () => {
  return (
    <Grid container spacing={0}>
      <Grid item xs={12} lg={12}>
        <Pdv />
      </Grid>
    </Grid>
  );
};

export default Tables;
