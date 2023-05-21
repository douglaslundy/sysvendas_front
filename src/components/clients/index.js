import React, { useState, useEffect, useContext } from "react";
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
    styled,
    TableContainer,
    TablePagination,
    TextField
} from "@mui/material";

import BaseCard from "../baseCard/BaseCard";
import FeatherIcon from "feather-icons-react";
import ClientModal from "../modal/client";
import PendingSalesPerClient from "../modal/pedingSalesPerClient";
import AllSalesPerClient from "../modal/allSalesPerClient";

import { useSelector, useDispatch } from 'react-redux';
import { getAllClients, inactiveClientFetch } from "../../store/fetchActions/client";
import { getAllSalesPerClient } from "../../store/fetchActions/sale";
import { showClient } from "../../store/ducks/clients";
import { changeTitleAlert, turnModal, turnModalGetPendingSales } from "../../store/ducks/Layout";
import ConfirmDialog from "../confirmDialog";
import { convertToBrlCurrency } from "../helpers/formatt/currency";
import AlertModal from "../messagesModal";

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
    const [confirmDialog, setConfirmDialog] = useState({
        isOpen: false,
        title: 'Deseja realmente excluir',
        subTitle: 'Esta ação não poderá ser desfeita',
    });

    const dispatch = useDispatch();
    const { clients, client } = useSelector(state => state.clients);
    const [searchValue, setSearchValue] = useState("");
    const [allClients, setAllClients] = useState(clients);

    useEffect(() => {
        dispatch(getAllClients());
    }, []);

    useEffect(() => {
        // setAllClients(searchValue ? [...clients.filter(cli => cli.full_name.toLowerCase().indexOf(searchValue) > -1)] : clients);
        setAllClients(searchValue ? [...clients.filter(cli => cli.full_name.toString().includes(searchValue.toString()))] : clients);
    }, [clients]);

    useEffect(() => {
        const removeAccents = str => {
            return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        };

        const filteredClients = clients.filter(cli => {
            const search = removeAccents(searchValue.toString().trim().toLowerCase());

            if (!search) {
                return true; // Retorna todos os clientes se nenhum termo de pesquisa for fornecido
            }

            const fullName = removeAccents(cli.full_name.toString().trim().toLowerCase());
            const idMatch = cli.id.toString() === search;
            const cpfMatch = cli.cpf_cnpj && cli.cpf_cnpj.toString() === search; // Nova condição para pesquisa por CPF
            const fullNameMatch = fullName.includes(search);

            return idMatch || cpfMatch || fullNameMatch; // Inclui a pesquisa por CPF na condição de retorno
        });

        setAllClients(filteredClients);
    }, [searchValue]);



    const HandleGetSales = async client => {
        dispatch(getAllSalesPerClient(client, 'no'));
        dispatch(showClient(client));
    }

    const HandleGetAllSales = async client => {
        dispatch(getAllSalesPerClient(client, 'all'));
        dispatch(showClient(client));
    }

    const HandleEditClient = async client => {
        dispatch(showClient(client));
        dispatch(turnModal());
    }

    const HandleInactiveClient = async client => {
        setConfirmDialog({ ...confirmDialog, isOpen: true, title: `Deseja Realmente excluir o cliente ${client.full_name}`, confirm: inactiveClientFetch(client) })
        dispatch(changeTitleAlert(`O cliente ${client.full_name} foi inativado com sucesso!`))
    }

    const searchClients = ({ target }) => {
        setSearchValue(target.value.toLowerCase());
    }

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    return (
        <BaseCard title={`Você possui ${allClients.length} Clientes Cadastrados`}>
            <AlertModal />
            <Box sx={{
                '& > :not(style)': { m: 2 },
                'display': 'flex',
                'justify-content': 'stretch'
            }}>
                <TextField
                    sx={{ width: "85%" }}
                    label="Pesquisar cliente: código / nome / CPF ou CNPJ"
                    name="search"
                    autoComplete="off"
                    value={searchValue}
                    onChange={searchClients}
                />

                {client &&
                    <>
                        <PendingSalesPerClient />
                        <AllSalesPerClient />
                    </>
                }

                <ClientModal>
                    <Fab onClick={() => { dispatch(turnModal()) }} color="primary" aria-label="add">
                        <FeatherIcon icon="user-plus" />
                    </Fab>
                </ClientModal>
            </Box>

            <TableContainer>

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
                                    Nome / Código - CPF / CNPJ
                                </Typography>
                            </TableCell>
                            <TableCell>
                                <Typography color="textSecondary" variant="h6">
                                    Endereço
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
                        {allClients
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((client, index) => (
                                <StyledTableRow key={client.id} hover>
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
                                                        {client.full_name ? client.full_name.substring(0, 35).toUpperCase() : ''}
                                                    </Typography>
                                                    <Typography
                                                        color="textSecondary"
                                                        sx={{
                                                            fontSize: "13px",
                                                        }}
                                                    >
                                                        {client.id ? (client.cpf_cnpj ? client.id + ' - ' + client.cpf_cnpj : client.id) : ''}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </TableCell>

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
                                                        {client.street && client.number ? client.street.substring(0, 35).toUpperCase() + ', ' + client.number : ''}
                                                    </Typography>
                                                    <Typography
                                                        color="textSecondary"
                                                        sx={{
                                                            fontSize: "13px",
                                                        }}
                                                    >
                                                        {client.district && client.city ? client.district.substring(0, 30).toUpperCase() + ', ' + client.city.substring(0, 30).toUpperCase() : ''}
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
                                                        {client.fantasy_name ? client.fantasy_name.substring(0, 30).toUpperCase() : ''}
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
                                            <Typography variant="h6">{convertToBrlCurrency(client.debit_balance)}</Typography>
                                        </TableCell>

                                        <TableCell align="center">
                                            <Box sx={{ "& button": { mx: 1 } }}>

                                                <Button title="Todas as vendas" onClick={() => { HandleGetAllSales(client) }} color="primary" size="medium" variant="contained">
                                                    <FeatherIcon icon="layers" width="20" height="20" />
                                                </Button>

                                                <Button title="Receber vendas" onClick={() => { HandleGetSales(client) }} color="primary" size="medium" variant="contained">
                                                    <FeatherIcon icon="dollar-sign" width="20" height="20" />
                                                </Button>

                                                <Button title="Editar cliente" onClick={() => { HandleEditClient(client) }} color="success" size="medium" variant="contained">
                                                    <FeatherIcon icon="edit" width="20" height="20" />
                                                </Button>

                                                <Button title="Excluir cliente" onClick={() => { HandleInactiveClient(client) }} color="error" size="medium" variant="contained">
                                                    <FeatherIcon icon="trash" width="20" height="20" />
                                                </Button>


                                            </Box>
                                        </TableCell>
                                    </>

                                </StyledTableRow>
                            ))}
                    </TableBody>
                </Table>
                <TablePagination
                    component="div"
                    count={allClients ? allClients.length : 0}
                    page={page}
                    onPageChange={handleChangePage}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </TableContainer>
            <ConfirmDialog
                confirmDialog={confirmDialog}
                setConfirmDialog={setConfirmDialog} />

        </BaseCard >
    );
};
