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
import BaseCard from "../baseCard/BaseCard";
import FeatherIcon from "feather-icons-react";
import InputSelect from "../../components/inputs/inputSelect";
import QTD from "../../components/inputs/textFields/stock-qtd";
import { useSelector, useDispatch } from 'react-redux';
import { getId } from "../helpers/formatt/getIdFromSelect";
import { summedPercentage } from "../helpers/functions/percent";
import { getCurrency, setCurrency } from "../helpers/formatt/currency";
import { addProductCartFetch, getListProductsCart, deleteProductFromCart } from "../../store/fetchActions/cart";
import { getAllProducts } from "../../store/fetchActions/product";
import { convertToBrlCurrency } from "../helpers/formatt/currency";
import AlertModal from "../messagesModal";
import { addAlertMessage, changeTitleAlert } from "../../store/ducks/Layout";
import { blue } from "@mui/material/colors";
import { getTotal } from "../helpers/checkout";

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
    const { productsCart } = useSelector(state => state.cart);
    const { products } = useSelector(state => state.products);

    const [form, setForm] = useState({
        product: '',
        qtd: 1
    });
    const { product, qtd } = form;
    const [total, setTotal] = useState(0);

    useEffect(() => {
        dispatch(getListProductsCart());
        dispatch(getAllProducts());
    }, []);

    useEffect(() => {
        setTotal(getTotal(productsCart))
    }, [productsCart]);

    const changeItem = ({ target }) => {
        setForm({ ...form, [target.name]: target.value });
    };

    const getProduct = ({ target }) => {
        setForm({ ...form, ['product']: products.filter((prod) => prod.id == getId(target.value)) });
    }

    const cleanForm = () => {
        setForm({
            product: '',
            qtd: 1
        });
    }

    const addProdutCart = () => {
        product[0] ? dispatch(addProductCartFetch(form, cleanForm)) : dispatch(addAlertMessage('Selecione o produto que deseja inserir no carrinho!'));
        product[0] ? dispatch(changeTitleAlert(`${product[0].name} foi inserido no carrinho!`)) : '';
    }

    const HandleDeleteProduct = product => {
        dispatch(deleteProductFromCart(product));
        dispatch(changeTitleAlert(`${product.product.name} foi retirado do carrinho!`))
    }

    // Pagination of products
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    // deletar depois 

    const payMetods = [{
        'id': '1',
        'name': 'cartao'
    }, {
        'id': '2',
        'name': 'cheque'
    }, {
        'id': '3',
        'name': 'dinheiro'
    }]

    return (
        <>
            <AlertModal />
            <BaseCard title="Adicionar Produto">
                <Box sx={{
                    '& > :not(style)': { m: 2 },
                    'display': 'flex',
                    'justify-content': 'stretch'
                }}
                >
                    <InputSelect
                        label="Produtos"
                        name="product"
                        products={products}
                        changeItem={getProduct}
                        wd={"55%"}
                    />

                    <QTD
                        sx={{ width: "30%" }}
                        label="QTD"
                        name="qtd"
                        value={qtd ? qtd : 1}
                        changeItem={changeItem}
                    />

                    <Fab onClick={() => addProdutCart()} color="primary" aria-label="add">
                        <FeatherIcon icon="send" />
                    </Fab>

                </Box>

            </BaseCard >

            <Box sx={{
                '& > :not(style)': { m: 2 },
                'display': 'flex',
                justifyContent: "space-evenly",
                alignItems: "flex-start",
            }}>

                <BaseCard title="Ponto De Venda">
                    <Box
                        sx={{
                            '& > :not(style)': { m: 2 },
                            'display': 'flex',
                            'justify-content': 'stretch',
                            'minWidth': "50Em"
                        }}
                    >

                        <TableContainer>
                            <Table
                                aria-label="simple table"
                                sx={{
                                    mt: 0,
                                    whiteSpace: "nowrap",
                                }}
                            >
                                <TableHead>
                                    <TableRow>

                                        <TableCell>
                                            <Typography variant="h4">
                                                Produto
                                            </Typography>
                                        </TableCell>

                                        <TableCell>
                                            <Typography variant="h4">
                                                Preço
                                            </Typography>
                                        </TableCell>

                                        <TableCell>
                                            <Typography variant="h4">
                                                QTD
                                            </Typography>
                                        </TableCell>

                                        <TableCell align="left">
                                            <Typography variant="h4">
                                                Total
                                            </Typography>
                                        </TableCell>

                                        <TableCell align="center">
                                            <Typography variant="h4">
                                                Ações
                                            </Typography>
                                        </TableCell>

                                    </TableRow>
                                </TableHead>

                                <TableBody>
                                    {productsCart
                                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        .map((product, index) => (
                                            <StyledTableRow key={product.id} hover>
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
                                                                    {product.product.name.toUpperCase()}
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
                                                                    {convertToBrlCurrency(getCurrency(product.product.sale_value))}
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
                                                                    {getCurrency(product.qtd)}
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
                                                                    {convertToBrlCurrency(getCurrency(product.product.sale_value * product.qtd / 100))}
                                                                </Typography>
                                                            </Box>
                                                        </Box>
                                                    </TableCell>


                                                    <TableCell align="center">
                                                        <Box sx={{ "& button": { mx: 1 } }}>

                                                            {/* <Button onClick={() => { HandleEditProduct(product) }} color="primary" size="medium" variant="contained">
                                                                <FeatherIcon icon="edit" width="20" height="20" />
                                                            </Button> */}

                                                            <Button onClick={() => { HandleDeleteProduct(product) }} color="error" size="medium" variant="contained">
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
                                count={productsCart.length}
                                page={page}
                                onPageChange={handleChangePage}
                                rowsPerPage={rowsPerPage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                            />
                        </TableContainer>

                    </Box>
                </BaseCard >

                <BaseCard title="Total">
                    <Box sx={{
                        '& > :not(style)': { m: 2 },
                        'display': 'grid',
                        'minWidth': 300,
                        // 'justify-content': 'stretch'
                    }}
                    >
                        <h4>{convertToBrlCurrency(total)}</h4>
                        <hr />
                        <InputSelect
                            label="Meios de Pagamento"
                            name="product"
                            products={payMetods}
                            changeItem={changeItem}
                        />

                        <Button onClick={() => { HandleDeleteProduct(product) }} color="secondary" size="medium" variant="contained">
                            <FeatherIcon icon="save" width="20" height="20" />
                            Confirmar
                        </Button>

                    </Box>

                </BaseCard >
            </Box>

        </>
    );
};



















