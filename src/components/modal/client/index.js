import React, { useState, useEffect } from 'react';
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
        zip_code: "",
        city: "",
        street: "",
        number: "",
        district: "",
        complement: ""
    });

    const { client } = useSelector(state => state.clients);
    const { isOpenModal } = useSelector(state => state.layout);
    const dispatch = useDispatch();

    const { full_name, surname, cpf_cnpj, email, phone, im, ie, fantasy_name, obs, limit, zip_code, city, street, number, district, complement } = form;
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
            zip_code: "",
            city: "",
            street: "",
            number: "",
            district: "",
            complement: ""
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
                                        label={full_name && full_name.length > 0 ? `Nome Completo: ${100 - full_name.length} caracteres restantes` : 'Nome Completo'}
                                        variant="outlined"
                                        name="full_name"
                                        value={full_name ? full_name : ''}
                                        onChange={changeItem}
                                        required
                                        inputProps={{
                                            style: {
                                                textTransform: "uppercase"
                                            },
                                               maxLength: 100
                                          }}
                                    />
                                    <TextField
                                        id="surname"
                                        label={surname && surname.length > 0 ? `Apelido: ${50 - surname.length} caracteres restantes` : 'Apelido'}
                                        variant="outlined"
                                        name="surname"
                                        value={surname ? surname : ''}
                                        onChange={changeItem}
                                        inputProps={{
                                            style: {
                                                textTransform: "uppercase"
                                            },
                                               maxLength: 50
                                          }}
                                    />
                                    <TextField
                                        label={email && email.length > 0 ? `@Email: ${100 - email.length} caracteres restantes` : '@Email'}
                                        variant="outlined"
                                        type="email"
                                        name="email"
                                        value={email ? email : ''}
                                        onChange={changeItem}
                                        required
                                        inputProps={{
                                            style: {
                                                textTransform: "uppercase"
                                            },
                                               maxLength: 100
                                          }}
                                    />

                                    <CpfCnpj
                                        value={cpf_cnpj}
                                        label={'CPF / CNPJ'}
                                        name={'cpf_cnpj'}
                                        required={'required'}
                                        changeItem={changeItem}
                                    />

                                    <Phone value={phone}
                                        label={'Telefone'}
                                        name={'phone'}
                                        changeItem={changeItem}
                                    />


                                    <Box sx={{
                                        '& > :not(style)': { mb: 0 },
                                        'display': 'flex',
                                        'justify-content': 'space-between'
                                    }}
                                    >

                                        <TextField
                                            id="zip_code"
                                            label={zip_code && zip_code.length > 0 ? `CEP: ${10 - zip_code.length} caracteres restantes` : 'CEP'}
                                            variant="outlined"
                                            name="zip_code"
                                            value={zip_code ? zip_code : ''}
                                            onChange={changeItem}
                                            sx={{ width: '26%', mr: 2 }}
                                            inputProps={{
                                                style: {
                                                    textTransform: "uppercase"
                                                },
                                                maxLength: 10
                                            }}
                                        />
                                        <TextField
                                            id="street"label={street && street.length > 0 ? `Rua: ${100 - street.length} caracteres restantes` : 'Rua'}
                                            variant="outlined"
                                            name="street"
                                            value={street ? street : ''}
                                            onChange={changeItem}
                                            sx={{ width: '66%', mr: 2 }}
                                            inputProps={{
                                                style: {
                                                    textTransform: "uppercase"
                                                },
                                                maxLength: 100
                                            }}
                                        />
                                        <TextField
                                            id="number"label={number && number.length > 0 ? `Nº: ${6 - number.length} caracteres restantes` : 'Nº'}
                                            variant="outlined"
                                            name="number"
                                            value={number ? number : ''}
                                            onChange={changeItem}
                                            sx={{ width: '16%' }}
                                            inputProps={{
                                                style: {
                                                    textTransform: "uppercase"
                                                },
                                                maxLength: 6
                                            }}
                                        />
                                    </Box>

                                    <Box sx={{
                                        '& > :not(style)': { mb: 0 },
                                        'display': 'flex',
                                        'justify-content': 'space-between'
                                    }}
                                    >
                                        
                                        <TextField
                                            id="complement"
                                            label={complement && complement.length > 0 ? `Complemento: ${50 - complement.length} caracteres restantes` : 'Complemento'}
                                            variant="outlined"
                                            name="complement"
                                            value={complement ? complement : ''}
                                            onChange={changeItem}
                                            sx={{ width: '36%', mr: 2 }}
                                            inputProps={{
                                                style: {
                                                    textTransform: "uppercase"
                                                },
                                                maxLength: 50
                                            }}
                                        />
                                        <TextField
                                            id="district"
                                            label={district && district.length > 0 ? `Bairro: ${100 - district.length} caracteres restantes` : 'Bairro'}
                                            variant="outlined"
                                            name="district"
                                            value={district ? district : ''}
                                            onChange={changeItem}
                                            sx={{ width: '36%', mr: 2 }}
                                            inputProps={{
                                                style: {
                                                    textTransform: "uppercase"
                                                },
                                                maxLength: 100
                                            }}
                                        />
                                        <TextField
                                            id="city"
                                            label={city && city.length > 0 ? `Cidade: ${30 - city.length} caracteres restantes` : 'Cidade'}
                                            variant="outlined"
                                            name="city"
                                            value={city ? city : ''}
                                            onChange={changeItem}
                                            sx={{ width: '36%'}}
                                            inputProps={{
                                                style: {
                                                    textTransform: "uppercase"
                                                },
                                                maxLength: 30
                                            }}
                                        />
                                    </Box>
                                    {/* <TextField
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
                                    /> */}

                                    <TextField
                                        id="fantasy_name"
                                        label={fantasy_name && fantasy_name.length > 0 ? `Nome Fantasia: ${50 - fantasy_name.length} caracteres restantes` : 'Nome Fantasia'}
                                        variant="outlined"
                                        name="fantasy_name"
                                        value={fantasy_name ? fantasy_name : ''}
                                        onChange={changeItem}
                                        inputProps={{
                                            style: {
                                                textTransform: "uppercase"
                                            },
                                            maxLength: 50
                                        }}
                                    />

                                    <Currency value={limit}
                                        label={'Limite'}
                                        name={'limit'}
                                        changeItem={changeItem}
                                    />

                                    <TextField
                                        id="obs"
                                        label={obs && obs.length > 0 ? `OBS: ${500 - obs.length} caracteres restantes` : 'OBS'}
                                        multiline
                                        rows={4}
                                        value={obs ? obs : ''}
                                        name="obs"
                                        onChange={changeItem}
                                        inputProps={{
                                            style: {
                                                textTransform: "uppercase"
                                            },
                                            maxLength: 500
                                        }}
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