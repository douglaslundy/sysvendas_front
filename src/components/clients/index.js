import React, { useEffect } from "react";
import {
    Typography,
    Box,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Fab,
    Button, 
    styled 
} from "@mui/material";

import BaseCard from "../baseCard/BaseCard";
import FeatherIcon from "feather-icons-react";
import ClientModal from "../modal/client";

import { useSelector, useDispatch } from 'react-redux';
import { getAllClients, inactiveClientFetch } from "../../store/fetchActions/client";
import { showClient } from "../../store/ducks/clients";
import { changeTitleAlert, turnAlert, turnModal } from "../../store/ducks/Layout";
  
  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
      border: 0,
    },
  }));

export default () => {

    const dispatch = useDispatch();

    const { clients } = useSelector(state => state.clients);

    useEffect(() => {
        dispatch(getAllClients());
    }, []);

    const HandleEditClient = async client => {
        dispatch(showClient(client));
        dispatch(turnModal());
    }  

    const HandleInactiveClient = async client => {
        dispatch(inactiveClientFetch(client));
        dispatch(turnAlert());
        dispatch(changeTitleAlert(`O cliente ${client.full_name} foi inativado com sucesso!`))
    }

    return (
        <BaseCard title="Clientes">

            <ClientModal>
                <Fab onClick={() => { dispatch(turnModal()) }} color="primary" aria-label="add">
                    <FeatherIcon icon="user-plus" />
                </Fab>
            </ClientModal>
            <br />
         
            <Table
                aria-label="simple table"
                sx={{
                    mt: 3,
                    whiteSpace: "nowrap",
                }}
            >
                <TableHead>
                    <TableRow>
                        <TableCell>
                            <Typography color="textSecondary" variant="h6">
                                Nome / Apelido
                            </Typography>
                        </TableCell>
                        <TableCell>
                            <Typography color="textSecondary" variant="h6">
                                Empresa / Telefone
                            </Typography>
                        </TableCell>

                        <TableCell>
                            <Typography color="textSecondary" variant="h6">
                                Debito
                            </Typography>
                        </TableCell>

                        <TableCell align="center">
                            <Typography color="textSecondary" variant="h6">
                                Ações
                            </Typography>
                        </TableCell>

                    </TableRow>
                </TableHead>
                <TableBody>                                 
                    {clients.map((client) => (
                        <StyledTableRow  key={client.id} hover>
                            {client &&
                                <>
                                    <TableCell>
                                        <Box
                                            sx={{
                                                display: "flex",
                                                alignItems: "center",
                                            }}
                                        >
                                            <Box>
                                                <Typography
                                                    variant="h6"
                                                    sx={{
                                                        fontWeight: "600",
                                                    }}
                                                >
                                                    {client.full_name}
                                                </Typography>
                                                <Typography
                                                    color="textSecondary"
                                                    sx={{
                                                        fontSize: "13px",
                                                    }}
                                                >
                                                    {client.surname}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </TableCell>

                                    <TableCell>
                                        <Box
                                            sx={{
                                                display: "flex",
                                                alignItems: "left"
                                            }}
                                        >
                                            <Box>
                                                <Typography
                                                    variant="h6"
                                                    sx={{
                                                        fontWeight: "600",
                                                    }}
                                                >
                                                    {client.fantasy_name}
                                                </Typography>
                                                <Typography
                                                    color="textSecondary"
                                                    sx={{
                                                        fontSize: "12px",
                                                    }}
                                                >
                                                    {client.phone}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </TableCell>

                                    <TableCell>
                                        <Typography variant="h6">R$ {client.debit_balance}</Typography>
                                    </TableCell>

                                    <TableCell align="center">
                                        <Box sx={{ "& button": { mx: 1 } }}>

                                            <Button onClick={() => { HandleEditClient(client) }} color="primary" size="medium" variant="contained">
                                                <FeatherIcon icon="edit" width="20" height="20" />
                                                Editar
                                            </Button>

                                            <Button onClick={() => { HandleInactiveClient(client) }} color="error" size="medium" variant="contained">
                                                <FeatherIcon icon="trash" width="20" height="20" />
                                                Inativar
                                            </Button>


                                        </Box>
                                    </TableCell>
                                </>
                            }

                        </StyledTableRow >
                    ))}
                </TableBody>
            </Table>
            
        </BaseCard >
    );
};
