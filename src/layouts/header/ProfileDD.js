import React, { useContext } from "react";
import FeatherIcon from "feather-icons-react";
import Image from "next/image";
import userimg from "../../../assets/images/users/user3.jpg";
import {
  Box,
  Menu,
  Typography,
  Link,
  Button,
  Divider,
  ListItemButton,
  ListItemText,
} from "@mui/material";

import { useDispatch } from "react-redux";
import { AuthContext } from "../../contexts/AuthContext";
import { logoutFetch } from "../../store/fetchActions/auth";
import UserModal from "../../components/modal/user";
import CompanyModal from "../../components/modal/company";
import { turnUserModal } from "../../store/ducks/Layout";
import { turnCompanyModal } from "../../store/ducks/Layout";
import { getUserFetch } from "../../store/fetchActions/user";
import { getCompanyFetch } from "../../store/fetchActions/company";

function logout(dispatch) {
  dispatch(logoutFetch());
}

const ProfileDD = () => {
  const [anchorEl4, setAnchorEl4] = React.useState(null);

  const handleClick4 = (event) => {
    setAnchorEl4(event.currentTarget);
  };

  const handleClose4 = () => {
    setAnchorEl4(null);
  };

  const dispatch = useDispatch();

  const { username } = useContext(AuthContext);
  const { user } = useContext(AuthContext);
  const { company } = useContext(AuthContext);
  
  const HandleEditUser = async user => {
    dispatch(getUserFetch(user));
    dispatch(turnUserModal());
}

  const HandleEditCompany = async company => {
    dispatch(getCompanyFetch(company));
    dispatch(turnCompanyModal());
}

  return (
    <>
    <UserModal />
    <CompanyModal />
      <Button
        aria-label="menu"
        color="inherit"
        aria-controls="profile-menu"
        aria-haspopup="true"
        onClick={handleClick4}
      >
        <Box display="flex" alignItems="center">
          <Image
            src={userimg}
            alt={userimg}
            width="30"
            height="30"
            className="roundedCircle"
          />
          <Box
            sx={{
              display: {
                xs: "none",
                sm: "flex",
              },
              alignItems: "center",
            }}
          >
            <Typography
              color="textSecondary"
              variant="h5"
              fontWeight="400"
              sx={{ ml: 1 }}
            >
              Olá,
            </Typography>
            <Typography
              variant="h5"
              fontWeight="700"
              sx={{
                ml: 1,
              }}
            >
              {username?.toUpperCase()}
            </Typography>
            <FeatherIcon icon="chevron-down" width="20" height="20" />
          </Box>
        </Box>
      </Button>
      <Menu
        id="profile-menu"
        anchorEl={anchorEl4}
        keepMounted
        open={Boolean(anchorEl4)}
        onClose={handleClose4}
        sx={{
          "& .MuiMenu-paper": {
            width: "385px",
          },
        }}
      >
        <Box>
          <ListItemButton>
            <ListItemText primary="Meus Dados" onClick={() => HandleEditUser(user)} />
          </ListItemButton>

          <ListItemButton>
            <ListItemText primary="Dados da Empresa" onClick={() => HandleEditCompany(company)} />
          </ListItemButton>

          <Divider />
          <Box p={2}>
            <Link to="/">
              <Button fullWidth variant="contained" color="primary" onClick={() => logout(dispatch)}>
                Logout
              </Button>
            </Link>
          </Box>
        </Box>
      </Menu>
    </>
  );
};

export default ProfileDD;