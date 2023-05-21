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
    TextField,
} from "@mui/material";

import BaseCard from "../baseCard/BaseCard";
import FeatherIcon from "feather-icons-react";

import { useDispatch, useSelector } from "react-redux";

import Receipt from "../modal/salesReceipt";
import { getAllSales } from "../../store/fetchActions/sale";
import { turnModalGetSale } from "../../store/ducks/Layout";
import { showSale } from "../../store/ducks/sales";
import salesPDF from "../../reports/sales";
import BasicDatePicker from "../inputs/datePicker";
import { convertToBrlCurrency, getCurrency } from "../helpers/formatt/currency";
import { parseISO, format } from 'date-fns';


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

    const { sales, sale } = useSelector(state => state.sales);
    const dispatch = useDispatch();

    const [searchValue, setSearchValue] = useState("");
    const [allSales, setAllSales] = useState(sales);

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10); const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const searchSales = ({ target }) => {
        setSearchValue(target.value.toLowerCase());
    }


    const HandleViewSale = async sale => {
        dispatch(showSale(sale));
        dispatch(turnModalGetSale());
    }

    useEffect(() => {
        dispatch(getAllSales());
    }, []);

    useEffect(() => {
        setAllSales(searchValue ? [...sales.filter(sale => sale.id.toString().includes(searchValue.toString()))] : sales);
    }, [sales]);

    // useEffect(() => {
    //     const filteredSales = sales.filter(sale => {
    //       const saleId = sale.id.toString().toLowerCase();
    //       const clientName = sale.client?.full_name.toLowerCase() || '';
    //       const search = searchValue.toString().toLowerCase().trim();

    //     //   return saleId.includes(search) || clientName.includes(search);
    //       return saleId === search || clientName.includes(search);
    //     });

    //     setAllSales(filteredSales);
    //   }, [searchValue]);


    useEffect(() => {
        const removeAccents = str => {
            return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        };

        const filteredSales = sales && sales.filter(sale => {
            const saleId = sale.id.toString();
            const clientName = sale.client?.full_name || '';
            const search = removeAccents(searchValue.toString().trim().toLowerCase());

            const normalizedClientName = removeAccents(clientName.toLowerCase());

            return saleId === search || normalizedClientName.includes(search);
        });

        setAllSales(filteredSales);
    }, [searchValue]);


    return (
        <BaseCard title={`Encontramos ${sales && sales.length} Vendas realizadas no período informado`}>

            {/* <BasicDatePicker /> */}

            <TextField
                sx={{ width: "85%" }}
                label="Pesquisar venda: código / cliente"
                name="search"
                value={searchValue}
                onChange={searchSales}
            />

            {sale && sale.id &&
                <Receipt />
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
                                    Código / Data
                                </Typography>
                            </TableCell>

                            <TableCell>
                                <Typography color="textSecondary" variant="h6">
                                    Cliente / CPF / CNPJ
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
                        {allSales &&
                            allSales
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
                                                            {sale && sale.id}
                                                        </Typography>

                                                        <Typography
                                                            color="textSecondary"
                                                            sx={{
                                                                fontSize: "13px",
                                                            }}
                                                        >
                                                            {sale && sale.created_at && format(parseISO(sale.created_at), 'dd/MM/yyyy HH:mm:ss')}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            </TableCell>

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
                                                            {sale.client != null ? sale.client.full_name.substring(0, 35).toUpperCase() : 'VENDA NO BALCÃO'}
                                                        </Typography>

                                                        <Typography
                                                            color="textSecondary"
                                                            sx={{
                                                                fontSize: "13px",
                                                            }}
                                                        >
                                                            {sale.client && sale.client.cpf_cnpj && sale.client.cpf_cnpj}
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
                                                            {sale.paied == "yes" ? <FeatherIcon icon="thumbs-up" color="#0b02f7" width="20" height="20" /> : <FeatherIcon icon="thumbs-down" color="#f7020e" width="20" height="20" />}
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
                                                            {/* {convertToBrlCurrency(getCurrency(setCurrency(sale.total_sale) - setCurrency(sale.discount)))} */}
                                                            {convertToBrlCurrency(getCurrency(sale.total_sale - sale.discount))}
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

                                                    <Button title="Visualiar venda" onClick={() => HandleViewSale(sale)} color="primary" size="medium" variant="contained">
                                                        <FeatherIcon icon="eye" width="20" height="20" />
                                                    </Button>

                                                    <Button title="Imprimir venda" onClick={() => salesPDF(sale)} color="error" size="medium" variant="contained">
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
                    count={allSales ? allSales.length : 0}
                    page={page}
                    onPageChange={handleChangePage}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </TableContainer>

        </BaseCard >
    );
};