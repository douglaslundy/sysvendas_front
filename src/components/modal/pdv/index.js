import React, { useState, useEffect } from 'react';
import AlertModal from '../../messagesModal'
import { useDispatch, useSelector } from 'react-redux';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import InputSelectClient from '../../inputs/inputSelectClient';
import Currency from '../../inputs/textFields/currency';
import { getAllClients } from '../../../store/fetchActions/client';
import { addSale } from '../../../store/fetchActions/sale';
import ConfirmDialog from '../../confirmDialog';

import {
    Grid,
    Button,
} from "@mui/material";

import BaseCard from "../../baseCard/BaseCard";
import { turnModal, changeTitleAlert } from '../../../store/ducks/Layout';


const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: "70%",
    height: "78%",
    // width: "90%",
    // height: "98%",
    bgcolor: 'background.paper',
    border: '0px solid #000',
    boxShadow: 24,
    p: 4,
    overflow: "scroll",
};

export default function PdvModal(props) {
    const [confirmDialog, setConfirmDialog] = useState({
        isOpen: false,
        title: 'Deseja realmente excluir',
        subTitle: 'Esta ação não poderá ser desfeita',
    });

    const { clients } = useSelector(state => state.clients);
    const [client, setClient] = useState([]);

    const { isOpenModal, isOpenAlert } = useSelector(state => state.layout);
    const dispatch = useDispatch();

    const [formSale, setFormSale] = useState({
        // id_pay_metod: "cash",
        id_client: null,
        pay_value: 0,
        // type_sale: '',
        // total_sale: 0,
        paied: "yes",
        check: 0,
        cash: 0,
        card: 0,
    });
    const { id_pay_metod, pay_value, type_sale, total_sale } = formSale;

    const changeItem = ({ target }) => {
        setForm({ ...form, [target.name]: target.value.toUpperCase() });
    };

    const cleanForm = () => {
        setFormSale({
            total_sale: "",
        });
        // setTexto('');
        dispatch(turnModal());
    }


    const handleSaveSale = async () => {
        setConfirmDialog({ ...confirmDialog, isOpen: true, title: `Você tem certeza que deseja finalizar esta venda?`, subTitle: 'Esta ação não poderá ser desfeita', confirm: addSale(formSale, cleanForm) });
        dispatch(changeTitleAlert(`Venda realizada com sucesso!`));
    };


    const handleClose = () => {
        cleanForm();
    };

    const changePayValue = ({ target }) => {
        setFormSale({ ...formSale, pay_value: target.value, [id_pay_metod]: target.value });
    };

    useEffect(() => {
        dispatch(getAllClients());
    }, []);

    useEffect(() => {
        setFormSale({ ...formSale, id_client: client?.id });
    }, [client]);

    useEffect(() => {
        setFormSale({ ...formSale, ...props.formSale })
    }, [props.formSale]);

    return (
        <div>
            {props.children}
            <Modal
                keepMounted
                open={isOpenModal}
                onClose={handleClose}
                aria-labelledby="keep-mounted-modal-title"
                aria-describedby="keep-mounted-modal-description"
            >
                <Box sx={style}>

                    <AlertModal />

                    <Grid container spacing={0}>
                        <Grid item xs={12} lg={12}>
                            <BaseCard title={`Finalizar Venda ${type_sale == 'in_cash' ? 'A VISTA' : 'A PRAZO'} no total de R$ ${total_sale}`}>
                                {/* {texto &&
                                    <Alert variant="filled" severity="warning">
                                        {texto}
                                    </Alert>
                                } */}

                                <br />

                                {/* <FormGroup > */}
                                {/* <Stack spacing={3}> */}
                                <Box sx={{
                                    '& > :not(style)': { m: 2 },
                                    'display': 'grid',
                                    'minWidth': 300,
                                    // 'justify-content': 'stretch'
                                }}
                                >

                                    <InputSelectClient
                                        label="Selecione o cliente"
                                        name="client"
                                        clients={clients}
                                        setClient={setClient}
                                        wd={"90%"}
                                    />

                                    {type_sale !== 'on_term' &&
                                        <>
                                            <Currency
                                                value={pay_value}
                                                label="Dinheiro"
                                                name="pay_value"
                                                changeItem={changePayValue}
                                                wd="90%"
                                            />                                           
                                        </>
                                    }
                                </Box>
                                {/* </Stack> */}
                                {/* </FormGroup> */}
                                <br />
                                <Box sx={{ "& button": { mx: 1 } }}>
                                    <Button onClick={handleSaveSale} variant="contained" mt={2}>
                                        Gravar
                                    </Button>

                                    <Button onClick={() => { cleanForm() }} variant="outlined" mt={2}>
                                        Cancelar
                                    </Button>
                                </Box>
                                <ConfirmDialog
                                    confirmDialog={confirmDialog}
                                    setConfirmDialog={setConfirmDialog} />
                            </BaseCard>
                        </Grid>
                    </Grid>

                </Box>
            </Modal>
        </div >
    );
}