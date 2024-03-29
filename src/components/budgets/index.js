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

import Receipt from "../modal/budgetReceipt";
import { getAllBudgets, sendBudgetToCart } from "../../store/fetchActions/budget";
import { changeTitleAlert, turnModal, turnModalGetSale } from "../../store/ducks/Layout";
import { showBudget } from "../../store/ducks/budget";
import salePDF from "../../reports/sale";
import { convertToBrlCurrency } from "../helpers/formatt/currency";
import { parseISO, format } from 'date-fns';
import BudgetModal from "../modal/budget";
import ConfirmDialog from "../confirmDialog";
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

    const { budgets, budget } = useSelector(state => state.budgets);
    const dispatch = useDispatch();
    const [searchValue, setSearchValue] = useState("");
    const [allBudgets, setAllBudgets] = useState(budgets);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10); const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const [confirmDialog, setConfirmDialog] = useState({
        isOpen: false,
        title: 'Deseja Devolver este orçamento ao carrinho',
        subTitle: 'Esta ação não poderá ser desfeita'
    });

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };


    const HandleViewBudget = async budget => {
        dispatch(showBudget(budget));
        dispatch(turnModalGetSale());
    }

    const searchBudgets = ({ target }) => {
        setSearchValue(target.value.toLowerCase());
    }

    const confirmSale = async (budget) => {
        dispatch(showBudget(budget));
        dispatch(turnModal());
    }

    const HandleSendBudgetToCart = async budget => {
        setConfirmDialog({ ...confirmDialog, isOpen: true, title:`Deseja devolver o orçamento ${budget.id} ao carrinho?`, confirm: sendBudgetToCart(budget) }),
        dispatch(changeTitleAlert(`O orçamento ${budget.id} foi devolvido para o carrinho com sucesso!`))
    }

    

    useEffect(() => {
        dispatch(getAllBudgets());
    }, []);

    useEffect(() => {
        setAllBudgets(searchValue ? [...budgets.filter(bud => bud && bud.id && bud.id.toString().includes(searchValue.toString()))] : budgets);
    }, [budgets]);

    useEffect(() => {
        setAllBudgets([...budgets.filter(bud => bud && bud.id && bud.id.toString().includes(searchValue.toString()) || bud.client && bud.client.full_name.toString().includes(searchValue.toString()))]);
    }, [searchValue]);


    return (
        <BaseCard title={`Encontramos ${allBudgets && allBudgets.length} Orçamentos realizados no período informado`}>
             <AlertModal />

            {/* <BasicDatePicker /> */}
            <TextField
                sx={{ width: "85%" }}
                label="Pesquisar orçamento: código / cliente"
                name="search"
                value={searchValue}
                onChange={searchBudgets}
            />

            {budget && budget.id &&
                <>
                    <Receipt />
                    <BudgetModal />
                </>
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
                                    Cliente / Vendedor
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
                    {allBudgets.length >= 1 ?
                        <TableBody>
                            {allBudgets &&
                                allBudgets
                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map((budget, index) => (
                                        <StyledTableRow key={budget.id} hover>
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
                                                                {budget.id != null ? budget.id : ''}
                                                            </Typography>

                                                            <Typography
                                                                color="textSecondary"
                                                                sx={{
                                                                    fontSize: "13px",
                                                                }}
                                                            >
                                                                {budget && budget.created_at && format(parseISO(budget.created_at), 'dd/MM/yyyy HH:mm:ss')}
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
                                                                {budget.client != null ? budget.client.full_name.substring(0, 35).toUpperCase() : 'VENDA NO BALCÃO'}
                                                            </Typography>

                                                            <Typography
                                                                color="textSecondary"
                                                                sx={{
                                                                    fontSize: "13px",
                                                                }}
                                                            >
                                                                {budget.user && budget.user.id + ' - ' + budget.user.name.substring(0, 30).toUpperCase()}
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
                                                                {convertToBrlCurrency(budget.total_sale)}
                                                            </Typography>
                                                            <Typography
                                                                color="textSecondary"
                                                                sx={{
                                                                    fontSize: "12px",
                                                                }}
                                                            >
                                                                {/* {budget.phone} */}
                                                            </Typography>
                                                        </Box>
                                                    </Box>
                                                </TableCell>

                                                <TableCell align="center">
                                                    <Box sx={{ "& button": { mx: 1 } }}>

                                                        <Button title="Visualiar venda" onClick={() => HandleViewBudget(budget)} color="primary" size="medium" variant="contained">
                                                            <FeatherIcon icon="eye" width="20" height="20" />
                                                        </Button>

                                                        <Button title="Imprimir venda" onClick={() => salePDF(budget)} color="secondary" size="medium" variant="contained">
                                                            <FeatherIcon icon="printer" width="20" height="20" />
                                                        </Button>

                                                        <Button title="Realizar venda" onClick={() => confirmSale(budget)} color="success" size="medium" variant="contained">
                                                            <FeatherIcon icon="dollar-sign" width="20" height="20" />
                                                        </Button>

                                                        <Button title="Devolver este orçamento ao Carrinho" onClick={() => HandleSendBudgetToCart(budget)} color="success" size="medium" variant="contained">
                                                            <FeatherIcon icon="shopping-cart" width="20" height="20" />
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
                    count={allBudgets ? allBudgets.length : 0}
                    page={page}
                    onPageChange={handleChangePage}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </TableContainer>

            <ConfirmDialog
                confirmDialog={confirmDialog}
                setConfirmDialog={setConfirmDialog}
            />

        </BaseCard >
    );
};