import React, { useState, useEffect, useContext } from "react";
import {
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

import BaseCard from "../baseCard/BaseCard";
import FeatherIcon from "feather-icons-react";

// import { useSelector, useDispatch } from 'react-redux';
import { getAllSales } from "../../store/fetchActions/sale";
import { useDispatch, useSelector } from "react-redux";

import Receipt from "../modal/salesReceipt";
import { turnModalGetSale } from "../../store/ducks/Layout";


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
    
    const { sales } = useSelector(state => state.sales);
    const dispatch = useDispatch();
    const [sale, setSale] = useState();

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10); const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    useEffect(() => {
        dispatch(getAllSales());
    }, []);

    const HandleViewSale = sale => {
        dispatch(turnModalGetSale());
        setSale(sale);
    }

    return (
        <BaseCard title="Vendas">

            {sale &&
                <Receipt sale={sale} />
            }

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
                                    Cliente / Data da venda
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
                        {sales &&
                        sales
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

                                                {/* <Receipt sale={sale}>
                                                    <Button onClick={() => { dispatch(turnModal()) }} color="primary" size="medium" variant="contained">
                                                        <FeatherIcon icon="eye" width="20" height="20" />
                                                    </Button>
                                                </Receipt> */}

                                                <Button title="Visualiar venda" onClick={() => HandleViewSale(sale)} color="primary" size="medium" variant="contained">
                                                    <FeatherIcon icon="eye" width="20" height="20" />
                                                </Button>

                                                <Button title="Imprimir venda" onClick={() => {alert('estamos desenvolvendo essa funcionalidade')  }} color="error" size="medium" variant="contained">
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
                    count={sales ? sales.length : 0}
                    page={page}
                    onPageChange={handleChangePage}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </TableContainer>

        </BaseCard >
    );
};
