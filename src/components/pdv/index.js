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
import ConfirmDialog from "../confirmDialog";
import QTD from "../../components/inputs/textFields/stock-qtd";
import AlertModal from "../messagesModal";
import Select from '../inputs/selects';
import Currency from '../inputs/textFields/currency';
import { useSelector, useDispatch } from 'react-redux';
import { getId } from "../helpers/formatt/getIdFromSelect";
import { getCurrency, setCurrency } from "../helpers/formatt/currency";
import { addProductCartFetch, getListProductsCart, deleteProductFromCart } from "../../store/fetchActions/cart";
import { getAllProducts } from "../../store/fetchActions/product";
import { convertToBrlCurrency } from "../helpers/formatt/currency";
import { addAlertMessage, changeTitleAlert } from "../../store/ducks/Layout";
import { getTotal } from "../helpers/checkout";
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

export default () => {

    const dispatch = useDispatch();
    const { productsCart } = useSelector(state => state.cart);
    const { products } = useSelector(state => state.products);
    const { clients } = useSelector(state => state.clients);

    const [formCart, setFormCart] = useState({
        product: [],
        qtd: ''
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

    const [confirmDialog, setConfirmDialog] = useState({
        isOpen: false,
    });

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
            setFormSale({ ...formSale, paied: 'yes', id_client: null, type_sale: 'in_cash', pay_value: 0, cash: 0, card: 0, check: 0 });
    }, [id_pay_metod])

    const changeItem = ({ target }) => {
        setFormCart({ ...formCart, [target.name]: target.value });
    };

    const changeSale = ({ target }) => {
        setFormSale({ ...formSale, [target.name]: target.value });
    };

    const changePayValue = ({ target }) => {
        setFormSale({ ...formSale, pay_value: target.value, [id_pay_metod]: target.value });
    };

    const getProduct = ({ target }) => {
        setFormCart({ ...formCart, ['product']: products.filter((prod) => prod.id == getId(target.value)), qtd: 1 });
    }
    const getClient = ({ target }) => {
        setFormSale({ ...formSale, ['id_client']: getId(target.value) });
    }

    const cleanForm = () => {
        setFormCart({
            product: [],
            qtd: 1
        });

        setFormSale({
            id_pay_metod: "cash",
            pay_value: 0,
            type_sale: "in_cash",
            paied: "yes",
            // total_sale: getTotal(productsCart),
            total_sale: 0,
            check: 0,
            cash: 0,
            card: 0
        });
        // setFormCart({...form, total_sale: 0})
    }

    const addProdutCart = () => {
        product[0] ? dispatch(changeTitleAlert(`${product[0].name} foi inserido no carrinho!`)) : '';
        product[0] ? dispatch(addProductCartFetch(formCart, cleanForm)) : dispatch(addAlertMessage('Selecione o produto que deseja inserir no carrinho!'));
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

            setConfirmDialog({ ...confirmDialog, isOpen: true, title: `Você tem certeza que deseja finalizar esta venda?`, subTitle: 'Esta ação não poderá ser desfeita', confirm: addSale(formSale, cleanForm) });
            dispatch(changeTitleAlert(`Venda realizada com sucesso!`));
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
                        changeItem={getProduct}
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
                    <ConfirmDialog
                        confirmDialog={confirmDialog}
                        setConfirmDialog={setConfirmDialog} />
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

                        {confirmDialog.isOpen == false &&
                            <InputSelectClient
                                label="Selecione o cliente"
                                name="client"
                                clients={clients}
                                changeItem={getClient}
                                wd={"90%"}
                            />
                        }

                        {type_sale !== 'on_term' &&
                            <Currency
                                value={pay_value}
                                label="Valor Pago"
                                name="pay_value"
                                changeItem={changePayValue}
                                wd="90%"
                            />
                        }
                        {/* {type_sale == 'on_term' && */}

                        {/* } */}

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