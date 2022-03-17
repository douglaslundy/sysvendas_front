import { Grid} from "@mui/material";
import Units from "../src/components/units";

const Tables = () => {
  return (
    <Grid container spacing={0}>
      <Grid item xs={12} lg={12}>
        <Units />
      </Grid>
    </Grid>
  );
};

export default Tables;
