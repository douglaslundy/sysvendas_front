import React, { useState, useEffect, useContext } from 'react';
import AlertModal from '../../messagesModal'
import { useDispatch, useSelector } from 'react-redux';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Phone from '../../inputs/textFields/phone';
import Currency from '../../inputs/textFields/currency';
import CpfCnpj from '../../inputs/textFields/cpfCnpj';

import {
    Grid,
    Stack,
    TextField,
    Alert,
    Button,
} from "@mui/material";

import BaseCard from "../../baseCard/BaseCard";

import { showClient } from '../../../store/ducks/clients';
import { editClientFetch, addClientFetch } from '../../../store/fetchActions/client';
import { turnModal, changeTitleAlert } from '../../../store/ducks/Layout';


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

export default function ClientModal(props) {


    const [form, setForm] = useState({
        full_name: "",
        surname: "",
        email: "",
        cpf_cnpj: "",
        phone: "",
        im: "",
        ie: "",
        fantasy_name: "",
        obs: "",
        limit: "",
    });
    const { client } = useSelector(state => state.clients);
    const { isOpenModal } = useSelector(state => state.layout);
    const dispatch = useDispatch();

    const { full_name, surname, cpf_cnpj, email, phone, im, ie, fantasy_name, obs, limit } = form;
    const [texto, setTexto] = useState();

    const changeItem = ({ target }) => {
        setForm({ ...form, [target.name]: target.value });
    };

    const cleanForm = () => {
        setForm({
            full_name: "",
            surname: "",
            email: "",
            cpf_cnpj: "",
            phone: "",
            im: "",
            ie: "",
            fantasy_name: "",
            obs: "",
            limit: "",
        });
        setTexto('');
        dispatch(turnModal());
        dispatch(showClient({}));
    }


    const handleSaveData = async () => {
        client && client.id ? handlePutData() : handlePostData()
    }

    const handlePostData = async () => {

        dispatch(changeTitleAlert(`O cliente ${form.full_name} foi Cadastrado com sucesso!`));
        dispatch(addClientFetch(form, cleanForm));
    };

    const handlePutData = async () => {

        dispatch(changeTitleAlert(`O cliente ${form.full_name} foi atualizado com sucesso!`));
        dispatch(editClientFetch(form, cleanForm));
    };

    const handleClose = () => {
        cleanForm();
    };

    useEffect(() => {

        if (client && client.id)
            setForm(client);

    }, [client]);

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
                            <BaseCard title={client && client.id ? "Editar Cliente" : "Cadastrar Cliente"}>
                                {texto &&
                                    <Alert variant="filled" severity="warning">
                                        {texto}
                                    </Alert>
                                }

                                <br />

                                {/* <FormGroup > */}
                                <Stack spacing={3}>
                                    <TextField
                                        id="full_name"
                                        label="Nome"
                                        variant="outlined"
                                        name="full_name"
                                        value={full_name ? full_name : ''}
                                        onChange={changeItem}
                                        required
                                    />
                                    <TextField
                                        id="surname"
                                        label="Apelido"
                                        variant="outlined"
                                        name="surname"
                                        value={surname ? surname : ''}
                                        onChange={changeItem}
                                    />
                                    <TextField
                                        id="email"
                                        label="@Email"
                                        variant="outlined"
                                        type="email"
                                        name="email"
                                        value={email ? email : ''}
                                        onChange={changeItem}
                                        required
                                    />
                                    
                                    <CpfCnpj value={cpf_cnpj}
                                        label={'CPF / CNPJ'}
                                        name={'cpf_cnpj'}
                                        changeItem={changeItem}
                                     />

                                    <Phone value={phone}
                                        label={'Telefone'}
                                        name={'phone'}
                                        changeItem={changeItem}
                                    />

                                    <TextField
                                        id="im"
                                        label="Inscrição Municipal"
                                        variant="outlined"
                                        name="im"
                                        value={im ? im : ''}
                                        onChange={changeItem}
                                    />
                                    <TextField
                                        id="ie"
                                        label="Inscrição Estadual"
                                        variant="outlined"
                                        name="ie"
                                        value={ie ? ie : ''}
                                        onChange={changeItem}
                                    />

                                    <TextField
                                        id="fantasy_name"
                                        label="Nome Fantasia"
                                        variant="outlined"
                                        name="fantasy_name"
                                        value={fantasy_name ? fantasy_name : ''}
                                        onChange={changeItem}
                                    />

                                    <Currency value={limit}
                                        label={'Limite'}
                                        name={'limit'}
                                        changeItem={changeItem}
                                    />

                                    <TextField
                                        id="obs"
                                        label="OBS"
                                        multiline
                                        rows={4}
                                        value={obs ? obs : ''}
                                        name="obs"
                                        onChange={changeItem}
                                    />
                                </Stack>
                                {/* </FormGroup> */}
                                <br />
                                <Box sx={{ "& button": { mx: 1 } }}>
                                    <Button onClick={handleSaveData} variant="contained" mt={2}>
                                        Gravar
                                    </Button>

                                    <Button onClick={() => { cleanForm() }} variant="outlined" mt={2}>
                                        Cancelar
                                    </Button>
                                </Box>
                            </BaseCard>
                        </Grid>
                    </Grid>

                </Box>
            </Modal>
        </div>
    );
}