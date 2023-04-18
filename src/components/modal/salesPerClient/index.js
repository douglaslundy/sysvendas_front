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
import { changeTitleAlert, turnModalGetSale, turnModalGetSales } from '../../../store/ducks/Layout';
import { convertToBrlCurrency, getCurrency, setCurrency } from '../../helpers/formatt/currency';
import { toPaySalesFetch } from '../../../store/fetchActions/sale';
import ConfirmDialog from "../../confirmDialog";

import salesPDF from '../../../reports/sales';


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

    const { salesPerClient } = useSelector(state => state.sales);
    const { client } = useSelector(state => state.clients);
    const { isOpenModalGetSales } = useSelector(state => state.layout);
    const [totalSale, setTotalSale] = useState(0);

    const dispatch = useDispatch();
    const [sale, setSale] = useState();

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
        troco: 0
        // check: 0,
        // card: 0
    });

    const { id_sales: salesToPay, cash, discount, payable, troco } = form;
    // const [troco, setTroco] = useState(0);

    const changeItem = ({ target }) => {
        setForm({ ...form, [target.name]: target.value })
    }

    useEffect(() => {
        setForm({...form, troco: setCurrency(cash) - setCurrency(payable)});
    } ,[cash])

    useEffect(() => {
        setForm({...form, payable: getCurrency(totalSale - setCurrency(discount ? discount : 0))});
    } ,[discount, totalSale])

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
            // check: 0,
            // card: 0
        });
        dispatch(turnModalGetSales());
        dispatch(showClient({}));
    }

    const handleClose = () => {
        cleanForm();
    };

    const HandleToPay = () => {
        if (setCurrency(cash) < (setCurrency(payable) - setCurrency(discount))) {
            setWarning("O Valor inserido precisa ser igual ou maior ao valor total a pagar");
        } else {
            setConfirmDialog({ ...confirmDialog, isOpen: true, title: `Você tem certeza que deseja baixar estas vendas?`, subTitle: 'Esta ação não poderá ser desfeita', confirm: toPaySalesFetch(form, cleanForm) })
            dispatch(changeTitleAlert("Vendas recebidas com sucesso dimais da conta"));
        }
    };

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10); const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const HandleViewSale = sale => {
        dispatch(turnModalGetSale());
        setSale(sale);
    }

    return (
        <div>
            {sale &&
                <Receipt sale={sale} />
            }

            {props.children}
            <Modal
                keepMounted
                open={isOpenModalGetSales}
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
                                                        Data da venda
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
                                                                                {sale.created_at}
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
                                                                                {sale.paied == "yes" ? "Recebido" : "A Receber"}
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

                                                                        <Button title="Visualiar venda" onClick={() => HandleViewSale(sale)} color="primary" size="medium" variant="contained">
                                                                            <FeatherIcon icon="eye" width="20" height="20" />
                                                                        </Button>

                                                                        <Button title="Imprimir venda" onClick={() => { salesPDF(sale) }} color="error" size="medium" variant="contained">
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

                                <h3>Total de vendas selecionadas: {convertToBrlCurrency(getCurrency(totalSale))}</h3>
                                
                                <h4>Desconto: {convertToBrlCurrency(getCurrency(setCurrency(discount ? discount : 0)))}</h4>
                                <h3>Total a Pagar: {convertToBrlCurrency(getCurrency(setCurrency(payable ? payable: 0)))}</h3>
                                <h4>Troco: {troco && troco > 0 ? convertToBrlCurrency(getCurrency(troco)) : convertToBrlCurrency(0)}</h4>
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
                                <Currency value={discount}
                                    disabled={!totalSale > 0}
                                    label={'Desconto'}
                                    name={'discount'}
                                    changeItem={changeItem}
                                    wd={"30%"}
                                />
                                <Currency value={cash}
                                    disabled={!totalSale > 0}
                                    label={'Dinheiro'}
                                    name={'cash'}
                                    changeItem={changeItem}
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