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
} from "@mui/material";
import BaseCard from "../baseCard/BaseCard";
import FeatherIcon from "feather-icons-react";
import InputSelectProduct from "../inputs/inputSelectProduct";
import QTD from "../../components/inputs/textFields/stock-qtd";
import AlertModal from "../messagesModal";
import Select from '../inputs/selects';
import { useSelector, useDispatch } from 'react-redux';
import { getCurrency } from "../helpers/formatt/currency";
import { addProductCartFetch, getListProductsCart, deleteProductFromCart } from "../../store/fetchActions/cart";
import { getAllProducts } from "../../store/fetchActions/product";
import { convertToBrlCurrency } from "../helpers/formatt/currency";
import { addAlertMessage, changeTitleAlert, turnModal } from "../../store/ducks/Layout";
import { getTotal } from "../helpers/checkout";
import PdvModal from "../modal/pdv";

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

    const [formCart, setFormCart] = useState({
        // product: [],
        qtd: '',
    });


    const [formSale, setFormSale] = useState({
        id_pay_metod: "cash",
        type_sale: 'in_cash',
        total_sale: 0,
    });
    const [product, setProduct] = useState([]);
    const { qtd } = formCart;
    const { id_pay_metod, total_sale } = formSale;

    useEffect(() => {
        setFormCart({ product: product, qtd: product && product.id ? 1 : '' });
    }, [product]);

    useEffect(() => {
        setFormSale({ ...formSale, ['total_sale']: getTotal(productsCart) })
    }, [productsCart]);

    useEffect(() => {
        dispatch(getListProductsCart());
        dispatch(getAllProducts());
    }, []);


    useEffect(() => {
        id_pay_metod == "on_term" ? setFormSale({ ...formSale, 'paied': 'no', 'type_sale': 'on_term' }) :
            setFormSale({ ...formSale, 'paied': 'yes', 'type_sale': 'in_cash' });
    }, [id_pay_metod])

    const changeItem = ({ target }) => {
        setFormCart({ ...formCart, [target.name]: target.value });
    };

    const changeSale = ({ target }) => {
        setFormSale({ ...formSale, [target.name]: target.value });
    };

    const cleanForm = () => {
        setFormCart({
            product: [],
            qtd: 1
        });

        // setFormSale({
        //     id_pay_metod: "cash",
        //     pay_value: 0,
        //     type_sale: "in_cash",
        //     paied: "yes",
        //     total_sale: 0,
        //     check: 0,
        //     cash: 0,
        //     card: 0
        // });
    }

    const addProdutCart = () => {
        product ? dispatch(changeTitleAlert(`${product.name} foi inserido no carrinho!`)) : '';
        product ? dispatch(addProductCartFetch(formCart, cleanForm)) : dispatch(addAlertMessage('Selecione o produto que deseja inserir no carrinho!'));
    }

    const HandleDeleteProduct = product => {
        dispatch(deleteProductFromCart(product));
        dispatch(changeTitleAlert(`${product.product.name} foi removido do carrinho!`))
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
        'id': "cash",
        'name': 'a vista'
    },
    // {
    //     'id': "card",
    //     'name': 'cartao'
    // },
    // {
    //     'id': "check",
    //     'name': 'cheque'
    // },
    {
        'id': "on_term",
        'name': 'a prazo'
    }
    ];

    const confirmSale = () => {
        if (productsCart.length > 0) {
            dispatch(turnModal());
        } else {
            dispatch(addAlertMessage("Insira pelo menos um produto ao carrinho!"))
        }
    }

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
                    <InputSelectProduct
                        label="Selecione o produto"
                        name="product"
                        products={products}
                        setProduct={setProduct}
                        wd={"55%"}
                    />

                    <QTD
                        sx={{ width: "30%" }}
                        label="QTD"
                        name="qtd"
                        value={qtd}
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
                                                                    {convertToBrlCurrency(getCurrency(product.sale_value))}
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
                                                                    {convertToBrlCurrency(getCurrency(product.sale_value * product.qtd / 100))}
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
                    {/* <ConfirmDialog
                        confirmDialog={confirmDialog}
                        setConfirmDialog={setConfirmDialog} /> */}
                </BaseCard >

                <BaseCard title="Total">
                    <Box sx={{
                        '& > :not(style)': { m: 2 },
                        'display': 'grid',
                        'minWidth': 300,
                        // 'justify-content': 'stretch'
                    }}
                    >
                        <h4>{convertToBrlCurrency(total_sale)}</h4>
                        <hr />

                        <Select
                            value={id_pay_metod}
                            label="Meios de Pagamento"
                            name="id_pay_metod"
                            store={payMetods}
                            changeItem={changeSale}
                            wd={"90%"}
                        />
                        <PdvModal formSale={formSale}>
                            <Button onClick={confirmSale} color="secondary" size="medium" variant="contained">
                                <FeatherIcon icon="save" width="20" height="20" />
                                CONFIRMAR
                            </Button>
                        </PdvModal>
                    </Box>
                </BaseCard >
            </Box>

        </>
    );
};