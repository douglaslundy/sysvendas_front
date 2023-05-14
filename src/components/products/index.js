import React, { useState, useEffect } from "react";
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
import { getAllCategoriesToSelect } from "../../store/fetchActions/categorie";
import BaseCard from "../baseCard/BaseCard";
import FeatherIcon from "feather-icons-react";
import ProductModal from "../modal/product";
import Select from '../inputs/selects';
import { useSelector, useDispatch } from 'react-redux';
import { getAllProducts, inactiveProductFetch } from "../../store/fetchActions/product";
import { showProduct } from "../../store/ducks/products";
import { changeTitleAlert, turnModal } from "../../store/ducks/Layout";
import ConfirmDialog from "../confirmDialog";
import { convertToBrlCurrency, convertToDecimal } from "../helpers/formatt/currency";

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
    const { products } = useSelector(state => state.products);
    const [searchValue, setSearchValue] = useState();
    const [allProducts, setAllProducts] = useState(products);
    const [idCategory, setIdCategory] = useState(0);


    const { categories } = useSelector(state => state.categories);

    useEffect(() => {
        dispatch(getAllProducts());
    }, []);

    useEffect(() => {
        searchProductPerParameter();
    }, [products, idCategory]);

    const HandleEditProduct = async product => {
        dispatch(showProduct(product));
        dispatch(turnModal());
    }

    const HandleInactiveProduct = async product => {
        setConfirmDialog({ ...confirmDialog, isOpen: true, title: `Deseja Realmente inativar o produto ${product.name}`, confirm: inactiveProductFetch(product) })
        dispatch(changeTitleAlert(`O produto ${product.name} foi inativado com sucesso!`));
    }

    const searchProducts = ({ target }) => {
        setSearchValue(target.value.toLowerCase());
        searchProductPerParameter();
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

    const changeItem = ({ target }) => {
        setIdCategory(target.value);
    }

    const searchProductPerParameter = () => {
        const data = idCategory !== 0 ? [...products.filter(item => item.id_category === idCategory)] : [...products];
        setAllProducts(searchValue ? [...data.filter(item => item.name.toLowerCase().indexOf(searchValue) > -1)] : data);
    }

    return (
        <BaseCard title={`Você possui ${allProducts.length} Produtos Cadastrados`}>
            <Box sx={{
                '& > :not(style)': { m: 2 },
                'display': 'flex',
                'justify-content': 'stretch'
            }}>
                <TextField
                    sx={{ width: "55%" }}
                    label="Pesquisar produto"
                    name="search"
                    value={searchValue}
                    onChange={searchProducts}
                />
                <Select value={idCategory}
                    label={'Filtrar por categoria'}
                    name={'Filtro'}
                    store={categories}
                    getAllSelects={getAllCategoriesToSelect}
                    changeItem={changeItem}
                    wd={"30%"}
                    valueDefault={"TODAS"}
                    valueNull={"SEM CATEGORIA"}
                />
                <ProductModal products={products}>
                    <Fab onClick={() => { dispatch(turnModal()) }} color="primary" aria-label="add">
                        <FeatherIcon icon="plus" />
                    </Fab>
                </ProductModal>

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
                            <TableCell align="left">
                                <Typography color="textSecondary" variant="h6">
                                    Código
                                </Typography>
                            </TableCell>

                            <TableCell>
                                <Typography color="textSecondary" variant="h6">
                                    Nome
                                </Typography>
                            </TableCell>

                            <TableCell>
                                <Typography color="textSecondary" variant="h6">
                                    Estoque
                                </Typography>
                            </TableCell>

                            <TableCell>
                                <Typography color="textSecondary" variant="h6">
                                    Valor
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
                        {allProducts
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((product) => (
                                <StyledTableRow key={product.id} hover>
                                    <>
                                        <TableCell>
                                            <Typography variant="h6"> {product.bar_code}</Typography>
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
                                                        {product.name.toUpperCase()}
                                                    </Typography>
                                                    <Typography
                                                        color="textSecondary"
                                                        sx={{
                                                            fontSize: "13px",
                                                        }}
                                                    >
                                                        {product.category ? product.category.name : ''}
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
                                                        {product.stock ? (convertToDecimal(product.stock) / convertToDecimal(product.reason)) : 0}

                                                        {/* <Button title="Entrada no estoque" onClick={() => { HandleEditProduct(product) }} color="primary" size="medium" variant="contained">
                                                            {product.stock ? product.stock / product.reason : 0}
                                                        </Button> */}

                                                    </Typography>
                                                    <Typography
                                                        color="textSecondary"
                                                        sx={{
                                                            fontSize: "13px",
                                                        }}
                                                    >
                                                        {product.unity ? product.unity.name : ''}
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
                                                        {convertToBrlCurrency(product.sale_value)}
                                                    </Typography>
                                                    <Typography
                                                        color="textSecondary"
                                                        sx={{
                                                            fontSize: "13px",
                                                        }}
                                                    >
                                                        {convertToBrlCurrency(product.cost_value)}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </TableCell>

                                        <TableCell align="center">
                                            <Box sx={{ "& button": { mx: 1 } }}>

                                                <Button title="Editar produto" onClick={() => { HandleEditProduct(product) }} color="primary" size="medium" variant="contained">
                                                    <FeatherIcon icon="edit" width="20" height="20" />
                                                </Button>

                                                <Button title="Inativar produto" onClick={() => { HandleInactiveProduct(product) }} color="error" size="medium" variant="contained">
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
                    count={allProducts.length}
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



















