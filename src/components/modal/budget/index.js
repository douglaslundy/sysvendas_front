import React, { useState, useEffect } from 'react';
import AlertModal from '../../messagesModal'
import { useDispatch, useSelector } from 'react-redux';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import InputSelectClient from '../../inputs/inputSelectClient';
import Currency from '../../inputs/textFields/currency';
import Percent from '../../inputs/textFields/percent';
import { getAllClients } from '../../../store/fetchActions/client';
import { addSale } from '../../../store/fetchActions/sale';
import { changeBudgetToSale } from '../../../store/fetchActions/budget';
import ConfirmDialog from '../../confirmDialog';
import Select from '../../inputs/selects';

import { valueDecrescidFromPercent } from '../../helpers/functions/percent';

import {
    Grid,
    Button,
    TextField,
} from "@mui/material";

import BaseCard from "../../baseCard/BaseCard";
import { turnModal, changeTitleAlert } from '../../../store/ducks/Layout';
import { convertToBrlCurrency, getCurrency, setCurrency } from '../../helpers/formatt/currency';
import { showBudget } from '../../../store/ducks/budget';
import { getAllUsers } from '../../../store/fetchActions/user';


const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: "70%",
    height: "95%",
    // width: "90%",
    // height: "98%",
    bgcolor: 'background.paper',
    border: '0px solid #000',
    boxShadow: 24,
    p: 4,
    overflow: "scroll",
};

export default function BudgetModal(props) {
    const [confirmDialog, setConfirmDialog] = useState({
        isOpen: false,
        title: 'Deseja realmente excluir',
        subTitle: 'Esta ação não poderá ser desfeita',
    });

    const { clients } = useSelector(state => state.clients);
    const { budget } = useSelector(state => state.budgets);
    const [client, setClient] = useState([]);

    const { users } = useSelector(state => state.users);
    const [user, setUser] = useState([]);

    const { isOpenModal } = useSelector(state => state.layout);
    const dispatch = useDispatch();

    const [formSale, setFormSale] = useState({
        id_user: null,
        id_budget: budget.id ? budget.id : null,
        total_sale: budget.total_sale ? getCurrency(budget.total_sale) : null,
        id_client: null,
        pay_value: 0,
        paied: "yes",
        check: 0,
        cash: 0,
        card: 0,
        discount: 0,
        obs: budget.obs ? budget.obs : ""
    });
    const { id_pay_metod = "cash", pay_value, type_sale, discount, obs, total_sale } = formSale;
    const { id } = budget;

    const changeItem = ({ target }) => {
        setFormSale({ ...formSale, [target.name]: target.value.toUpperCase() });
    };

    const payMetods = [{
        'id': "cash",
        'name': 'a vista'
    },

    {
        'id': "on_term",
        'name': 'a prazo'
    }
    ];

    const changeSale = ({ target }) => {
        setFormSale({ ...formSale, [target.name]: target.value });
    };

    const cleanForm = () => {

        setFormSale({
            ...formSale,
            id_budget: null,
            id_client: null,
            id_user: null,
            pay_value: 0,
            paied: "yes",
            check: 0,
            cash: 0,
            card: 0,
            discount: 0,
            obs: ""
        });
        dispatch(showBudget({}))
        dispatch(turnModal());
    }

    const handleSaveSale = async () => {
        setConfirmDialog({ ...confirmDialog, isOpen: true, title: `Você tem certeza que deseja finalizar esta venda?`, subTitle: 'Esta ação não poderá ser desfeita', confirm: changeBudgetToSale(formSale, cleanForm) });
        dispatch(changeTitleAlert(`Venda realizada com sucesso!`));
    };

    const handleClose = () => {
        cleanForm();
    };

    const changePayValue = ({ target }) => {
        setFormSale({ ...formSale, pay_value: target.value, [id_pay_metod]: target.value });
    };

    const getTotalToPay = () => {
        return convertToBrlCurrency(valueDecrescidFromPercent(total_sale, discount));
    }

    useEffect(() => {
        dispatch(getAllClients());
        dispatch(getAllUsers());
    }, []);

    useEffect(() => {
        setFormSale({ ...formSale, id_client: client?.id });
    }, [client]);

    useEffect(() => {
        setFormSale({ ...formSale, id_user: user?.id });
    }, [user]);

    useEffect(() => {
        setFormSale({ ...formSale, ...props.formSale })
    }, [props.formSale]);

    useEffect(() => {
        setFormSale({ ...formSale, id_client: null });
    }, [isOpenModal]);

    useEffect(() => {
        id_pay_metod == "on_term" ?
            setFormSale({ ...formSale, 'paied': 'no', 'type_sale': 'on_term' })
            :
            setFormSale({ ...formSale, 'paied': 'yes', 'type_sale': 'in_cash' });

    }, [id_pay_metod])

    const title = `Efetivar a venda do orçamento ${id}`;

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
                            <BaseCard title={title}>


                                <h4>Total {convertToBrlCurrency(total_sale)}</h4>
                                {setCurrency(discount) > 0 &&
                                    <>
                                        <h5 style={{ color: "red" }}>Desconto {discount}</h5>
                                        <h3> Pagar {getTotalToPay()}</h3>
                                    </>
                                }
                                {setCurrency(pay_value) > 0 &&

                                    (setCurrency(discount) > 0 ? setCurrency(pay_value) - (setCurrency(total_sale) - setCurrency(discount)) : setCurrency(pay_value) - (setCurrency(total_sale)) > 0) &&

                                    <h5 style={{ color: "blue" }}>Troco {convertToBrlCurrency(getCurrency(
                                        setCurrency(discount) > 0
                                            ? setCurrency(pay_value) - getCurrency(setCurrency(valueDecrescidFromPercent(total_sale, discount)))
                                            : setCurrency(pay_value) - setCurrency(total_sale)))}</h5>
                                }

                                <Box sx={{
                                    '& > :not(style)': { m: 2 },
                                    'display': 'grid',
                                    'minWidth': 300,
                                }}
                                >

                                    <Select
                                        value={id_pay_metod}
                                        label="Meios de Pagamento"
                                        name="id_pay_metod"
                                        store={payMetods}
                                        changeItem={changeSale}
                                        wd={"90%"}
                                    />


                                    {isOpenModal == true &&
                                        <>
                                            <InputSelectClient
                                                id="sailor"
                                                label="Selecione o vendedor"
                                                name="user"
                                                value={budget.user}
                                                clients={users}
                                                setClient={setUser}
                                                wd={"90%"}
                                            />

                                            <InputSelectClient
                                                id="client"
                                                label="Selecione o cliente"
                                                name="client"
                                                value={budget.client}
                                                clients={clients}
                                                setClient={setClient}
                                                wd={"90%"}
                                            />
                                        </>
                                    }

                                    {type_sale !== 'on_term' && type_sale !== 'budget' &&
                                        <Percent
                                            value={discount}
                                            label="Desconto"
                                            name="discount"
                                            changeItem={changeItem}
                                            wd="90%"
                                        />
                                    }

                                    {type_sale !== 'on_term' && type_sale !== 'budget' &&
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

                                    <TextField
                                        value={obs}
                                        label={obs && obs.length > 0 ? `Resumo: ${200 - obs.length} caracteres restantes` : 'Obs'}
                                        name="obs"
                                        multiline
                                        onChange={changeItem}
                                        rows={2}
                                        sx={{ width: '90%' }}
                                        inputProps={{
                                            style: {
                                                textTransform: "uppercase"
                                            },
                                            maxLength: 200
                                        }}
                                    />


                                </Box>
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