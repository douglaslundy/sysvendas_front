import { Grid} from "@mui/material";
import ValueCategory from "../src/components/valueCategory";
import { parseCookies } from 'nookies'
const Tables = () => {
  return (
    <Grid container spacing={0}>
      <Grid item xs={12} lg={12}>
        <ValueCategory />
      </Grid>
    </Grid>
  );
};

export default Tables;
