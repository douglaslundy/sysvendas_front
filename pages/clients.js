import { Grid } from "@mui/material";
import Clients from "../src/components/clients";
import { parseCookies } from 'nookies';

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

export async function getServerSideProps(context) {

  const { 'sysvendas.token': token } = parseCookies(context);
  
  if(!token){
    return {
      redirect: {
        destination: '/login',
        permanent: false, 
      }
    }
  }
  return {
    props: {}, // will be passed to the page component as props
  }
}