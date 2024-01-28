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

import Select from '../inputs/selects';
import Receipt from "../modal/salesReceipt";
import { getAllSalesPerDate } from "../../store/fetchActions/sale";
import { addAlertMessage, turnModalGetSale } from "../../store/ducks/Layout";
import { showSale } from "../../store/ducks/sales";
import salePDF from "../../reports/sale";
import salesPDF from "../../reports/sales";
import BasicDatePicker from "../inputs/datePicker";
import { convertToBrlCurrency, getCurrency } from "../helpers/formatt/currency";
import { parseISO, format, setDate } from 'date-fns';
import AlertModal from "../messagesModal";
import { setDateToSearch } from "../helpers/formatt/date/setDateToSearch";


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
    const [payMethod, setPayMethod] = useState('all');

    const [dateBegin, setDateBegin] = useState(null);
    const [dateEnd, setDateEnd] = useState(null);
    const [isSearched, setIsSearched] = useState(null);

    const payMethods = [
        {
            'id': 'all',
            'name': 'Todas as vendas'
        },
        {
            'id': 'in_cash',
            'name': 'A Vista'
        },
        {
            'id': 'on_term',
            'name': 'A Prazo'
        },
        {
            'id': 'receivable',
            'name': 'A Prazo Pendentes'
        },
        {
            'id': 'received',
            'name': 'A prazo Recebidas'
        }
    ]

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

    const changePayMethod = ({ target }) => {
        setPayMethod(target.value)
    }


    const HandleViewSale = async sale => {
        dispatch(showSale(sale));
        dispatch(turnModalGetSale());
    }

    const getSalesPerDate = () => {
        setPayMethod('all');
        dispatch(getAllSalesPerDate(dateBegin, dateEnd));
        setIsSearched(true);
    }
    const resetGetSales = () => {
        dispatch(getAllSalesPerDate(setDateToSearch(1, 0), setDateToSearch(31, 11)));
        setDateBegin(null);
        setDateEnd(null);
        setPayMethod('all');
        setSearchValue('');
        setIsSearched(null);
    }
    const printerSales = () => {
        allSales.length <= 0
            ?
            dispatch(addAlertMessage('A busca não encontrou registros, você não realizou vendas no periodo informado!!!'))
            :
            salesPDF(allSales)
    }

    useEffect(() => {
        dispatch(getAllSalesPerDate(setDateToSearch(1, 0), setDateToSearch(31, 11)));
    }, []);

    useEffect(() => {
        setAllSales(searchValue ? [...sales.filter(sale => sale.id.toString().includes(searchValue.toString()))] : sales);
    }, [sales]);

    useEffect(() => {
        const removeAccents = (str) => {
            return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        };

        // Filtro com base no método de pagamento selecionado
        const filteredSalesByPayMethod = sales?.filter((sale) => {
            if (payMethod === 'all') {
                return true;
            } else if (payMethod === 'in_cash' || payMethod === 'on_term') {
                return sale.type_sale === payMethod;
            } else if (payMethod === 'received') {
                return sale.type_sale === 'on_term' && sale.paied === 'yes';
            } else if (payMethod === 'receivable') {
                return sale.type_sale === 'on_term' && sale.paied === 'no';
            }
            return false;
        });

        // Filtro com base no valor de pesquisa
        const filteredSalesBySearch = filteredSalesByPayMethod?.filter((sale) => {
            const saleId = sale.id.toString();
            const clientName = sale.client?.full_name || '';
            const search = removeAccents(searchValue.toString().trim().toLowerCase());

            const normalizedClientName = removeAccents(clientName.toLowerCase());

            return saleId === search || normalizedClientName.includes(search);
        });

        setAllSales(filteredSalesBySearch);
    }, [payMethod, searchValue]);

    return (
        <BaseCard title={isSearched ? `Encontramos ${allSales && allSales.length} Vendas realizadas no período informado` : ` ${allSales && allSales.length} Vendas realizadas em ${new Date().getFullYear()}`}>

            <AlertModal />

            <Box sx={{ mt: 1 }}>
                <BasicDatePicker
                    sx={{ mr: 2 }}
                    label="Data de Início"
                    name="date_begin"
                    value={dateBegin}
                    setValue={setDateBegin}
                />

                <BasicDatePicker
                    sx={{ mr: 2 }}
                    label="Data de Fim"
                    name="date_end"
                    value={dateEnd}
                    disabled={!dateBegin}
                    setValue={setDateEnd}
                />

                <Button title="Buscar" onClick={getSalesPerDate} disabled={!dateBegin} color="success" size="medium" variant="contained">
                    <FeatherIcon icon="search" width="45" height="45" />
                </Button>

                <Button title="Imprimir Vendas" onClick={printerSales} sx={{ ml: 2 }} color="secondary" size="medium" variant="contained">
                    <FeatherIcon icon="printer" width="45" height="45" />
                </Button>

                <Button title="Resetar Busca por data(s)" onClick={resetGetSales} sx={{ ml: 2 }} color="primary" size="medium" variant="contained">
                    <FeatherIcon icon="refresh-cw" width="45" height="45" />
                </Button>
            </Box>

            <Box sx={{
                '& > :not(style)': { mb: 0, mt: 2 },
                'display': 'flex',
                'justify-content': 'space-between'
            }}
            >

                <TextField
                    sx={{ width: "70%" }}
                    label="Pesquisar venda: código / cliente"
                    name="search"
                    autoComplete="off"
                    value={searchValue}
                    onChange={searchSales}
                />

                <Select
                    label="Filtrar"
                    name="payMethod"
                    value={payMethod}
                    store={payMethods}
                    changeItem={changePayMethod}
                    wd={"25%"}
                />
            </Box>

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
                                    Código
                                </Typography>
                                <Typography color="textSecondary" variant="h6">
                                    Data da venda
                                </Typography>
                            </TableCell>

                            <TableCell>
                                <Typography color="textSecondary" variant="h6">
                                    Cliente
                                </Typography>
                                <Typography color="textSecondary" variant="h6">
                                    Vendedor
                                </Typography>
                            </TableCell>

                            <TableCell>
                                <Typography color="textSecondary" align="center" variant="h6">
                                    Tipo da venda
                                </Typography>
                                <Typography color="textSecondary" align="center" variant="h6">
                                    Data do pagamento
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
                    {
                        allSales.length >= 1 ?

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
                                                                    {sale.user && sale.user.id + ' - ' + sale.user.name.substring(0, 30).toUpperCase()}
                                                                </Typography>
                                                            </Box>
                                                        </Box>
                                                    </TableCell>

                                                    <TableCell align="center">
                                                        <Box
                                                            sx={{
                                                                // display: "flex",
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
                                                                <Typography
                                                                    color="textSecondary"
                                                                    sx={{
                                                                        fontSize: "12px",
                                                                    }}
                                                                >
                                                                    {sale.paied == "yes" && sale.updated_at ? format(parseISO(sale.updated_at), 'dd/MM/yyyy HH:mm:ss') : ''}
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

                                                            <Button title="Imprimir venda" onClick={() => salePDF(sale)} color="secondary" size="medium" variant="contained">
                                                                <FeatherIcon icon="printer" width="20" height="20" />
                                                            </Button>

                                                        </Box>
                                                    </TableCell>
                                                </>

                                            </StyledTableRow>
                                        ))}
                            </TableBody>
                            :
                            <TableCell align="center">
                                Nenhum registro encontrado!
                            </TableCell>
                    }

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