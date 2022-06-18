import React, { useState, useEffect, useContext } from 'react';
import AlertModal from '../../messagesModal'
import { useDispatch, useSelector } from 'react-redux';
import Modal from '@mui/material/Modal';
import {
    Grid,
    Typography,
    Box,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Button,
    styled,
    TableContainer,
    TablePagination,
} from "@mui/material";

import BaseCard from "../../baseCard/BaseCard";
import FeatherIcon from "feather-icons-react";

import { showClient } from '../../../store/ducks/clients';
import { turnModalGetSales } from '../../../store/ducks/Layout';
import { convertToBrlCurrency } from '../../helpers/formatt/currency';

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}));


const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: "90%",
    height: "98%",
    bgcolor: 'background.paper',
    border: '0px solid #000',
    boxShadow: 24,
    p: 4,
    overflow: "scroll",
};

export default function (props) {

    const { salesPerClient } = useSelector(state => state.sales);
    const { client } = useSelector(state => state.clients);
    const { isOpenModalGetSales } = useSelector(state => state.layout);
    const [totalSale, setTotalSale] = useState(0);
    const dispatch = useDispatch();

    const cleanForm = () => {
        dispatch(turnModalGetSales());
        dispatch(showClient({}));
    }

    const handleClose = () => {
        cleanForm();
    };

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10); const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    return (
        <div>
            {props.children}
            <Modal
                keepMounted
                open={isOpenModalGetSales}
                onClose={handleClose}
                aria-labelledby="keep-mounted-modal-title"
                aria-describedby="keep-mounted-modal-description"
            >
                <Box sx={style}>

                    <AlertModal />

                    <Grid container spacing={0}>
                        <Grid item xs={12} lg={12}>
                            <BaseCard title={client && client.id ? `Listagem de Vendas / ${client.full_name}` : "Listagem de vendas / Selecione o cliente na pagina anterior"}>

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
                                                        Data da venda
                                                    </Typography>
                                                </TableCell>

                                                <TableCell>
                                                    <Typography color="textSecondary" variant="h6">
                                                        Tipo da venda
                                                    </Typography>
                                                </TableCell>

                                                <TableCell>
                                                    <Typography color="textSecondary" variant="h6">
                                                        Total
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
                                            {
                                                salesPerClient &&
                                                salesPerClient
                                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                                    .map((sale, index) => (
                                                        <StyledTableRow key={sale.id} hover>
                                                            <>

                                                                <TableCell>
                                                                    <Box
                                                                        sx={{
                                                                            display: "flex",
                                                                            alignItems: "left",
                                                                        }}
                                                                    >
                                                                        <Box>
                                                                            <Typography
                                                                                variant="h6"
                                                                                sx={{
                                                                                    fontWeight: "600",
                                                                                }}
                                                                            >
                                                                                {sale.client != null ? sale.client.full_name.toUpperCase() : 'VENDA NO BALCÃO'}
                                                                            </Typography>

                                                                            <Typography
                                                                                color="textSecondary"
                                                                                sx={{
                                                                                    fontSize: "13px",
                                                                                }}
                                                                            >
                                                                                {sale.sale_date}
                                                                            </Typography>
                                                                        </Box>
                                                                    </Box>
                                                                </TableCell>




                                                                <TableCell align="center">
                                                                    <Box
                                                                        sx={{
                                                                            display: "flex",
                                                                        }}
                                                                    >
                                                                        <Box>
                                                                            <Typography
                                                                                variant="h6"
                                                                                sx={{
                                                                                    fontWeight: "600",
                                                                                }}
                                                                            >
                                                                                {sale.type_sale == "in_cash" ? "A Vista" : "A Prazo"}
                                                                            </Typography>
                                                                            <Typography
                                                                                color="textSecondary"
                                                                                sx={{
                                                                                    fontSize: "13px",
                                                                                }}
                                                                            >
                                                                                {sale.paied == "yes" ? "Recebido" : "A Receber"}
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
                                                                                R$ {sale.total_sale}
                                                                            </Typography>
                                                                            <Typography
                                                                                color="textSecondary"
                                                                                sx={{
                                                                                    fontSize: "12px",
                                                                                }}
                                                                            >
                                                                                {/* {sale.phone} */}
                                                                            </Typography>
                                                                        </Box>
                                                                    </Box>
                                                                </TableCell>

                                                                <TableCell align="center">
                                                                    <Box sx={{ "& button": { mx: 1 } }}>

                                                                        <Button title="Visualiar venda" onClick={() => HandleViewsale(sale)} color="primary" size="medium" variant="contained">
                                                                            <FeatherIcon icon="eye" width="20" height="20" />
                                                                        </Button>

                                                                        <Button title="Imprimir venda" onClick={() => { alert('estamos desenvolvendo essa funcionalidade') }} color="error" size="medium" variant="contained">
                                                                            <FeatherIcon icon="printer" width="20" height="20" />
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
                                        count={salesPerClient ? salesPerClient.length : 0}
                                        page={page}
                                        onPageChange={handleChangePage}
                                        rowsPerPage={rowsPerPage}
                                        onRowsPerPageChange={handleChangeRowsPerPage}
                                    />
                                </TableContainer>

                                <h5>Total a Pagar: {convertToBrlCurrency(totalSale)}</h5>

                            </BaseCard>
                        </Grid>
                    </Grid>

                </Box>
            </Modal>
        </div>
    );
}