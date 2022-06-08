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
import InputSelectProduct from "../inputs/inputSelectProduct";
import InputSelectClient from "../inputs/inputSelectClient";
import QTD from "../../components/inputs/textFields/stock-qtd";
import { useSelector, useDispatch } from 'react-redux';
import { getId } from "../helpers/formatt/getIdFromSelect";
import { getCurrency, setCurrency } from "../helpers/formatt/currency";
import { addProductCartFetch, getListProductsCart, deleteProductFromCart } from "../../store/fetchActions/cart";
import { getAllProducts } from "../../store/fetchActions/product";
import { convertToBrlCurrency } from "../helpers/formatt/currency";
import AlertModal from "../messagesModal";
import { addAlertMessage, changeTitleAlert } from "../../store/ducks/Layout";
import { getTotal } from "../helpers/checkout";
import Select from '../inputs/selects';
import Currency from '../inputs/textFields/currency';
import { getAllClients } from "../../store/fetchActions/client";
import { addSale } from "../../store/fetchActions/sale";

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}));

// $table -> integer('id_user');
// $table -> integer('id_client');
// $table -> timestamp('sale_date');
// $table ->enum('paied', ['yes', 'no']);
// $table ->enum('type_sale', ['in_cash', 'on_term']);
// $table -> timestamp('due_date') -> nullable();
// $table -> timestamp('pay_date') -> nullable();
// $table -> integer('chek') -> nullable() ->default (0);
// $table -> integer('cash') -> nullable() ->default (0);
// $table -> integer('card') -> nullable() ->default (0);
// $table -> integer('total_sale') ->default (0);

// id_user
// id_client
// paied ? yes | no
// type_sale ? in_cash |on_term
// chek
// cash
// card
// total_sale


export default () => {

    const dispatch = useDispatch();
    const { productsCart } = useSelector(state => state.cart);
    const { products } = useSelector(state => state.products);
    const { clients } = useSelector(state => state.clients);

    const [formCart, setFormCart] = useState({
        product: '',
        qtd: 1
    });

    const [formSale, setFormSale] = useState({        
        id_pay_metod: "cash",
        id_client: null,
        pay_value: 0,
        type_sale: 'in_cash',
        total_sale: 0,
        check: 0,
        cash: 0,
        card: 0

    });

    const { product, qtd } = formCart;
    const { id_pay_metod, id_client, pay_value, type_sale, total_sale, check, cash, card } = formSale;

    useEffect(() => {
        dispatch(getListProductsCart());
        dispatch(getAllProducts());
        dispatch(getAllClients());
    }, []);

    useEffect(() => {
        setFormSale({ ...formSale, ['total_sale']: getTotal(productsCart) })
    }, [productsCart]);

    useEffect(() => {
        id_pay_metod == "on_term" ? setFormSale({ ...formSale, 'paied': 'no', 'type_sale': 'on_term', cash: 0, card: 0, check: 0 }) :
            setFormSale({ ...formSale, paied: 'yes', id_client: null,  type_sale: 'in_cash', pay_value: 0, cash: 0, card: 0, check: 0 });
    }, [id_pay_metod])

    const changeItem = ({ target }) => {
        setFormCart({ ...formCart, [target.name]: target.value });
    };

    const changeSale = ({ target }) => {
        setFormSale({ ...formSale, [target.name]: target.value });
    };

    const changePayValue = ({ target }) => {
        setFormSale({ ...formSale, ['pay_value']: target.value, [id_pay_metod]: target.value });
    };

    const getProduct = ({ target }) => {
        setFormCart({ ...formCart, ['product']: products.filter((prod) => prod.id == getId(target.value)) });
    }
    const getClient = ({ target }) => {
        setFormSale({ ...formSale, ['id_client']: getId(target.value) });
    }

    const cleanForm = () => {
        setFormCart({
            product: '',
            qtd: 1
        });

        setFormSale({
            id_pay_metod: "cash",
            pay_value: 0,
            type_sale: 'in_cash',
            total_sale: 0,
            check: 0,
            cash: 0,
            card: 0
        });
    }

    const addProdutCart = () => {
        product[0] ? dispatch(addProductCartFetch(formCart, cleanForm)) : dispatch(addAlertMessage('Selecione o produto que deseja inserir no carrinho!'));
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
        'id': "cash",
        'name': 'dinheiro'
    }, {
        'id': "card",
        'name': 'cartao'
    }, {
        'id': "check",
        'name': 'cheque'
    }, {
        'id': "on_term",
        'name': 'a prazo'
    }];

    const confirmSale = () => {
        dispatch(changeTitleAlert(`Venda realizada com sucesso!`));
        dispatch(addSale(formSale, cleanForm));      
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

                        {type_sale !== 'on_term' &&
                            <Currency value={pay_value}
                                label={'Valor Pago'}
                                name={'pay_value'}
                                changeItem={changePayValue}
                                wd={"90%"}
                            />
                        }
                        {type_sale == 'on_term' &&
                            <InputSelectClient
                                label="Clientes"
                                name="client"
                                products={clients}
                                changeItem={getClient}
                                wd={"90%"}
                            />
                        }

                        <Button onClick={confirmSale} color="secondary" size="medium" variant="contained">
                            <FeatherIcon icon="save" width="20" height="20" />
                            CONFIRMAR
                        </Button>

                    </Box>

                </BaseCard >
            </Box>

        </>
    );
};



















