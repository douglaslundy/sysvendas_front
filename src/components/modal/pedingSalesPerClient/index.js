import React, { useState, useEffect } from 'react';
import AlertModal from '../../messagesModal'
import { useDispatch, useSelector } from 'react-redux';
import Modal from '@mui/material/Modal';
import Switch from '@mui/material/Switch';
import Currency from '../../inputs/textFields/currency';
import {
    Grid,
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
    Alert,
    FormControlLabel,
} from "@mui/material";

import BaseCard from "../../baseCard/BaseCard";
import FeatherIcon from "feather-icons-react";
import Receipt from "../../modal/salesReceipt";
import { showClient } from '../../../store/ducks/clients';
import { changeTitleAlert, turnModalGetSale, turnModalGetPendingSales } from '../../../store/ducks/Layout';
import { changeDotToComma, convertToBrlCurrency, setCurrency } from '../../helpers/formatt/currency';
import { toPaySalesFetch } from '../../../store/fetchActions/sale';
import ConfirmDialog from "../../confirmDialog";
import { parseISO, format, set } from 'date-fns';

import Percent from '../../inputs/textFields/percent';
import { showSale } from '../../../store/ducks/sales';
import { discountPercentage, valueDecrescidFromPercent } from '../../helpers/functions/percent';
import salePDF from '../../../reports/sale';


const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}));

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: "90%",
    height: "98%",
    bgcolor: 'background.paper',
    border: '0px solid #000',
    boxShadow: 24,
    p: 4,
    overflow: "scroll",
};

export default function (props) {

    const { salesPerClient, sale } = useSelector(state => state.sales);
    const { client } = useSelector(state => state.clients);
    const { isOpenModalGetPendingSales } = useSelector(state => state.layout);
    const [totalSale, setTotalSale] = useState(0);
    const [percent, setPercent] = useState();
    const [amountPaid, setAmountPaid] = useState();

    // variavel responsavel por perceber sempre que houver digitação no input percent
    // ou seja, o usuario inserir o valor percent para somar ou diminuir do valor original

    const dispatch = useDispatch();

    // const [salesToPay, setSalesToPay] = useState([]);
    const [waning, setWarning] = useState('');

    const [confirmDialog, setConfirmDialog] = useState({
        isOpen: false,
    });

    const [form, setForm] = useState({
        id_sales: [],
        id_client: client ? client.id : 0,
        cash: 0,
        discount: 0,
        payable: 0,
        troco: 0,
        card: 0,
        check: 0
    });

    const { id_sales: salesToPay, cash, card, check, discount, payable, troco } = form;

    const changeItem = ({ target }) => {
        setForm({ ...form, [target.name]: target.value })
    }

    const handleEditForm = (sale) => {
        // salesToPay.includes(sale.id) ? (setSalesToPay([...salesToPay.filter(s => s != sale.id)]), setTotalSale(totalSale - setCurrency(sale.total_sale))) : (setSalesToPay([...salesToPay, sale.id]), setTotalSale(totalSale + setCurrency(sale.total_sale)));

        salesToPay.includes(sale.id)

            ? (setForm({ ...form, id_sales: [...salesToPay.filter(s => s != sale.id)] }), setTotalSale(totalSale - (sale.total_sale - sale.discount)))

            : (setForm({ ...form, id_sales: [...salesToPay, sale.id] }), setTotalSale(totalSale + (sale.total_sale - sale.discount)))
    }

    const cleanForm = () => {
        setTotalSale(0);
        setForm({
            id_sales: [],
            id_client: client ? client.id : 0,
            cash: 0,
            card: 0,
            check: 0
        });
        dispatch(turnModalGetPendingSales());
        dispatch(showClient({}));
    }

    const handleClose = () => {
        cleanForm();
    };

    const HandleToPay = () => {
        if (setCurrency(amountPaid) < (payable - discount)) {
            setWarning("O Valor inserido precisa ser igual ou maior ao valor total a pagar");
        } else {
            setConfirmDialog({ ...confirmDialog, isOpen: true, title: `Você tem certeza que deseja baixar estas vendas?`, subTitle: 'Esta ação não poderá ser desfeita', confirm: toPaySalesFetch(form, cleanForm) })
            dispatch(changeTitleAlert("Vendas recebidas com sucesso"));
        }
    };

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(25); 
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const HandleViewSale = sale => {
        dispatch(showSale(sale));
        dispatch(turnModalGetSale());
    }

    // no inicio da função, altera a variavel isPercent, afim de acionar o useEffect para atualizar o input percent
    const changePercent = ({ target }) => {
        setPercent(target.value);
        const newValue = valueDecrescidFromPercent(totalSale, target.value ? target.value : 0);
        setForm({ ...form, totalSale: newValue, discount: changeDotToComma(totalSale - newValue) });
    }


    // funcção e acionada no useEffet, afim de alterar a porcentagem, sempre que o usuario alterar p valor de custo ou de venda, informando 
    // a porcentagem atualizada de lucro
    const changePercentPerValue = value => {
        setPercent(parseFloat(discountPercentage(totalSale, value)));
    }

    const changeValue = ({ target }) => {
        setForm({ ...form, [target.name]: target.value ? target.value : 0 })
    }

    useEffect(() => {
        setAmountPaid(parseFloat(parseFloat(setCurrency(cash)) + parseFloat(setCurrency(card)) + parseFloat(setCurrency(check))))
    }, [cash, check, card])


    useEffect(() => {
        setForm({ ...form, troco: setCurrency(amountPaid) - payable });
    }, [cash, card, check, payable, amountPaid])

    useEffect(() => {
        setForm({ ...form, payable: setCurrency(discount) > 0 ? (totalSale - setCurrency(discount) >= 0 ? totalSale - setCurrency(discount) : 0) : totalSale });
    }, [discount, totalSale])

    const changeDiscount = ({ target }) => {
        setForm({ ...form, discount: target.value })
        changePercentPerValue(target.value)
    }


    return (
        <div>
            {sale && sale.id &&
                <Receipt />
            }

            {props.children}
            <Modal
                keepMounted
                open={isOpenModalGetPendingSales}
                // onClose={handleClose}
                aria-labelledby="keep-mounted-modal-title"
                aria-describedby="keep-mounted-modal-description"
            >
                <Box sx={style}>

                    <AlertModal />

                    <Grid container spacing={0}>
                        <Grid item xs={12} lg={12}>
                            <BaseCard title={client && client.id ? `Listagem de Vendas / ${client.full_name}` : "Listagem de vendas / Selecione o cliente na pagina anterior"}>

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
                                                        Pagar
                                                    </Typography>
                                                </TableCell>

                                                <TableCell>
                                                    <Typography color="textSecondary" variant="h6">
                                                        Código
                                                    </Typography>
                                                </TableCell>

                                                <TableCell>
                                                    <Typography color="textSecondary" variant="h6">
                                                        Cliente / Data
                                                    </Typography>
                                                </TableCell>

                                                <TableCell>
                                                    <Typography color="textSecondary" variant="h6">
                                                        Tipo / Status
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
                                            {
                                                salesPerClient &&
                                                salesPerClient
                                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                                    .map((sale, index) => (
                                                        <StyledTableRow key={sale.id} hover>
                                                            <>

                                                                <TableCell align="center">
                                                                    <Box sx={{ "& button": { mx: 1 } }}>
                                                                        <FormControlLabel control={<Switch checked={salesToPay.includes(sale.id)}
                                                                            onClick={() => handleEditForm(sale)} />} />
                                                                    </Box>
                                                                </TableCell>

                                                                <TableCell>
                                                                    <Box sx={{ "& button": { mx: 1 } }}>
                                                                        {sale && sale.id}
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
                                                                                {sale.client != null ? sale.client.full_name.toUpperCase() : 'VENDA NO BALCÃO'}
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
                                                                                {convertToBrlCurrency(sale.total_sale - sale.discount)}
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

                                                                        <Button title="Imprimir venda" onClick={() => { salePDF(sale) }} color="error" size="medium" variant="contained">
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
                                        count={salesPerClient ? salesPerClient.length : 0}
                                        page={page}
                                        onPageChange={handleChangePage}
                                        rowsPerPage={rowsPerPage}
                                        onRowsPerPageChange={handleChangeRowsPerPage}
                                    />
                                </TableContainer>

                                <h3>Total de vendas selecionadas: {convertToBrlCurrency(totalSale)}</h3>

                                <h4 style={{ color: 'red' }}>Desconto: {convertToBrlCurrency(discount ? discount : 0)}</h4>
                                <h3>Total a Pagar: {convertToBrlCurrency(payable ? payable : 0)}</h3>
                                {
                                    amountPaid > 0 && <h5>Valor Pago:  {convertToBrlCurrency(amountPaid)}</h5>
                                }
                                <h4 style={{ color: 'blue' }}>Troco: {troco && troco > 0 ? convertToBrlCurrency(troco) : convertToBrlCurrency(0)}</h4>
                                <ConfirmDialog
                                    confirmDialog={confirmDialog}
                                    setConfirmDialog={setConfirmDialog} />

                            </BaseCard>

                            <Box sx={{
                                '& > :not(style)': { m: 2 },
                                // 'display': 'flex',
                                'justify-content': 'left'
                            }}
                            >
                                {/* <h5>{}</h5> */}
                                {waning &&
                                    <Alert variant="filled" severity="error">
                                        {waning}
                                    </Alert>
                                }
                                <Currency
                                    value={discount}
                                    disabled={!totalSale > 0}
                                    label={'Desconto em R$'}
                                    name={'discount'}
                                    changeItem={changeDiscount}
                                    wd={"30%"}
                                />
                                <Percent
                                    value={changeDotToComma(percent)}
                                    label="Desconto em %"
                                    name="discount"
                                    changeItem={changePercent}
                                    disabled={!totalSale > 0}
                                    wd="30%"
                                />
                            </Box>

                            <Box sx={{
                                '& > :not(style)': { m: 2 },
                                // 'display': 'flex',
                                'justify-content': 'left'
                            }}
                            >
                                <Currency
                                    value={cash}
                                    disabled={!totalSale > 0}
                                    label={'Dinheiro'}
                                    name={'cash'}
                                    changeItem={changeValue}
                                    wd={"30%"}
                                />
                                <Currency
                                    value={card}
                                    disabled={!totalSale > 0}
                                    label={'Cartão'}
                                    name={'card'}
                                    changeItem={changeValue}
                                    wd={"30%"}
                                />
                                <Currency
                                    value={check}
                                    disabled={!totalSale > 0}
                                    label={'Cheque'}
                                    name={'check'}
                                    changeItem={changeValue}
                                    wd={"30%"}
                                />
                            </Box>

                            <Box sx={{ "& button": { mx: 1, mt: 5 } }}>
                                <Button onClick={() => { handleClose() }} variant="outlined" mt={2}>
                                    Fechar
                                </Button>

                                {
                                    totalSale > 0 &&
                                    <Button onClick={() => { HandleToPay() }} color="success" variant="contained" mt={2}>
                                        Efetuar pagamento
                                    </Button>

                                }
                            </Box>
                        </Grid>
                    </Grid>

                </Box>
            </Modal>
        </div>
    );
}