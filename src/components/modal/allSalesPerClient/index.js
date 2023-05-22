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
    Modal,
} from "@mui/material";

import BaseCard from "../../baseCard/BaseCard";
import FeatherIcon from "feather-icons-react";

import { useDispatch, useSelector } from "react-redux";

import Select from '../../inputs/selects';
import Receipt from "../../modal/salesReceipt";
import { turnModalGetAllSales, turnModalGetSale } from "../../../store/ducks/Layout";
import { showSale } from "../../../store/ducks/sales";
import salesPDF from "../../../reports/sales";
import BasicDatePicker from "../../inputs/datePicker";
import { convertToBrlCurrency, getCurrency } from "../../helpers/formatt/currency";
import { parseISO, format } from 'date-fns';
import { showClient } from "../../../store/ducks/clients";


const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}));

export default function Sales(props) {

    const { salesPerClient, sale } = useSelector(state => state.sales);
    const { client } = useSelector(state => state.clients);
    const { isOpenModalGetAllSales } = useSelector(state => state.layout);
    const [totalSale, setTotalSale] = useState(0);

    const dispatch = useDispatch();

    const [searchValue, setSearchValue] = useState("");
    const [allSales, setAllSales] = useState(salesPerClient);
    const [payMethod, setPayMethod] = useState('all');

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
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const searchSales = ({ target }) => {
        setSearchValue(target.value.trim());
    };


    const changePayMethod = ({ target }) => {
        setPayMethod(target.value)
    }

    const HandleViewSale = async (sale) => {
        dispatch(showSale(sale));
        dispatch(turnModalGetSale());
    }

    const cleanForm = () => {
        dispatch(turnModalGetAllSales());
        dispatch(showClient({}));
    }

    const handleClose = () => {
        cleanForm();
    };

    useEffect(() => {
        setAllSales(salesPerClient);
    }, []);


    useEffect(() => {
        setAllSales(searchValue ? [...allSales.filter(sale => sale.id.toString().includes(searchValue.toString()))] : salesPerClient);
    }, [salesPerClient]);

    useEffect(() => {
        const filteredSalesByPayMethod = salesPerClient?.filter((sale) => {
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

        const filteredSalesBySearch = filteredSalesByPayMethod?.filter((sale) => {
            const saleId = sale.id.toString().toLowerCase();
            const search = searchValue.toString().trim().toLowerCase();

            return saleId.includes(search);
        });

        setAllSales(filteredSalesBySearch);
    }, [payMethod, searchValue]);





    return (
        <div>
            {sale && sale.id &&
                <Receipt />
            }

            {props.children}

            <Modal
                keepMounted
                open={isOpenModalGetAllSales}
                onClose={handleClose}
                aria-labelledby="keep-mounted-modal-title"
                aria-describedby="keep-mounted-modal-description"
                sx={{
                    overflow: 'auto' // Adicionado o overflow: auto para permitir o scroll
                }}
            >

                <BaseCard title={`Encontramos ${allSales && allSales.length} Vendas realizadas no período informado`}>

                    {/* <BasicDatePicker /> */}

                    <Box
                        sx={{
                            '& > :not(style)': { mb: 0 },
                            display: 'flex',
                            justifyContent: 'space-between'
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
                                            CPF / CNPJ
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
                                                            {sale.paied == "yes" ? format(parseISO(sale.updated_at), 'dd/MM/yyyy HH:mm:ss') : ''}
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

                                                            <Button title="Visualizar venda" onClick={() => HandleViewSale(sale)} color="primary" size="medium" variant="contained">
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

                        <Box sx={{ "& button": { mx: 1, mt: 5 } }}>
                            <Button onClick={() => { handleClose() }} variant="outlined" mt={2}>
                                Fechar
                            </Button>
                        </Box>

                        <TablePagination
                            component="div"
                            count={allSales && allSales.length}
                            page={page}
                            onPageChange={handleChangePage}
                            rowsPerPage={rowsPerPage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                            rowsPerPageOptions={[5, 10, 25, 50]}
                        />
                    </TableContainer>

                </BaseCard>
            </Modal>
        </div>
    );
}
