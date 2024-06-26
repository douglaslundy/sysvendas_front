import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { styled } from '@mui/material/styles';
import { parseISO, format } from 'date-fns';

import {
    Button,
    Typography,
    Table,
    TableBody,
    TableHead,
    TableRow,
    TableCell,
    TableContainer,
} from "@mui/material";
import FeatherIcon from "feather-icons-react";

import { turnModalGetSale } from '../../../store/ducks/Layout';
import { changeDotToComma, convertToBrlCurrency } from '../../helpers/formatt/currency';
import salePDF from '../../../reports/sale';
import { showBudget } from '../../../store/ducks/budget';


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
    width: "60%",
    height: "98%",
    bgcolor: 'background.paper',
    border: '0px solid #000',
    boxShadow: 24,
    p: 4,
    overflow: "scroll",
};

export default function SalesReceipt(props) {

    const dispatch = useDispatch();
    const { isOpenModalGetSale } = useSelector(state => state.layout);
    const { budget } = useSelector(state => state.budgets);
    const { id, created_at, total_sale, client, itens } = budget;

    const handleClose = () => {
        dispatch(turnModalGetSale());
        dispatch(showBudget({}));
    };

    return (
        <div>
            {props.children}
            <Modal
                keepMounted
                open={isOpenModalGetSale}
                onClose={handleClose}
                aria-labelledby="keep-mounted-modal-title"
                aria-describedby="keep-mounted-modal-description"
            >
                <Box sx={style}>

                    <h1>Orçamento</h1>
                    <hr />
                    <h3>JR Ferragens - Data : {created_at && format(parseISO(created_at), 'dd/MM/yyyy HH:mm:ss')}</h3>
                    <h5>Orçamento Nº: {id}</h5>
                    <hr />
                    <h3>CLIENTE: {client != null ? client.full_name : 'VENDA NO BALCÃO'}</h3>
                    <hr />

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
                                        <Typography sx={{ fontWeight: "600" }} variant="h6">
                                            Código
                                        </Typography>
                                    </TableCell>

                                    <TableCell>
                                        <Typography sx={{ fontWeight: "600" }} variant="h6">
                                            Descrição
                                        </Typography>
                                    </TableCell>

                                    <TableCell>
                                        <Typography sx={{ fontWeight: "600" }} variant="h6">
                                            Preço Unitario
                                        </Typography>
                                    </TableCell>

                                    <TableCell>
                                        <Typography sx={{ fontWeight: "600" }} variant="h6">
                                            Qtd
                                        </Typography>
                                    </TableCell>

                                    <TableCell align="center">
                                        <Typography sx={{ fontWeight: "600" }} variant="h6">
                                            Total
                                        </Typography>
                                    </TableCell>

                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {itens && itens
                                    .map((item, index) => (
                                        <StyledTableRow key={index} hover>
                                            <>
                                                <TableCell>

                                                    <Typography
                                                        sx={{
                                                            fontSize: "12px",
                                                        }}
                                                    >
                                                        {item.bar_code}
                                                    </Typography>
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
                                                                {item.name}
                                                            </Typography>

                                                        </Box>
                                                    </Box>
                                                </TableCell>

                                                <TableCell>
                                                    <Typography variant="h6">{convertToBrlCurrency(item.item_value)}</Typography>
                                                </TableCell>

                                                <TableCell>
                                                    <Typography
                                                        sx={{
                                                            fontSize: "13px",
                                                            fontWeight: "600",
                                                        }}
                                                    >
                                                        {changeDotToComma(item.qtd)}
                                                    </Typography>
                                                </TableCell>

                                                <TableCell>
                                                    <Typography
                                                        variant="h6" sx={{
                                                            fontWeight: "600"
                                                        }} >
                                                        {convertToBrlCurrency(item.item_value * item.qtd)}</Typography>
                                                </TableCell>

                                            </>

                                        </StyledTableRow>
                                    ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <h5>Total:  {convertToBrlCurrency(total_sale)}</h5>
                    
                    <Box sx={{ "& button": { mx: 1, mt: 5 } }}>
                        <Button onClick={() => { handleClose() }} variant="outlined" mt={2}>
                            <FeatherIcon icon="skip-back" width="20" height="20" />
                        </Button>
                        <Button title="Imprimir venda" onClick={() => salePDF(budget)} color="error" size="medium" variant="contained">
                            <FeatherIcon icon="printer" width="20" height="20" />
                        </Button>
                    </Box>

                </Box>
            </Modal>
        </div>
    );
}