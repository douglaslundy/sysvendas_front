import React, { useState, useEffect } from 'react';
import AlertModal from '../../messagesModal'
import { useDispatch, useSelector } from 'react-redux';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';

import {
    Grid,
    Stack,
    TextField,
    Alert,
    Button,
} from "@mui/material";

import BaseCard from "../../baseCard/BaseCard";

import * as yup from 'yup'

import { showClient } from '../../../store/ducks/clients';
import { editClientFetch, addClientFetch } from '../../../store/fetchActions';
import { turnModal, turnAlert, changeTitleAlert } from '../../../store/ducks/Layout';


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
    const { isOpenModal} = useSelector(state => state.layout);
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
        if (!(await validate())) return;
        client && client.id ? handlePutData() : handlePostData()
    }

    const handlePostData = async () => {
        
        console.log("no modal entrou na rota add Cliente ")
        dispatch(addClientFetch(form));       
        dispatch(changeTitleAlert(`O cliente ${form.full_name} foi Cadastrado com sucesso!`));
        cleanForm();                
        dispatch(turnAlert());
    };

    const handlePutData = async () => {
        
        console.log(" no modal entrou entrou na rota add Cliente " + client.id)
        dispatch(editClientFetch(form));
        dispatch(changeTitleAlert(`O cliente ${form.full_name} foi atualizado com sucesso!`));
        cleanForm();                
        dispatch(turnAlert());
    };

    const handleClose = () => {
        cleanForm();
    };


    async function validate() {
        let schema = yup.object().shape({

            limit: yup.number("Limit deve ser um campo numerico")
            .required("O Campo limit é obrigatório")
            .positive("Limit deve ser um campo positivo"),

            full_name: yup.string("O Campo nome deve ser uma String")
                .required("O Campo Nome é obrigatório")
                .min(6, "Campo deve possuir o minimo de ${min} caracteres"),           
        })
        try {
            // limpa mensagem de erro de fazer a validação, de modo que so exiba as mensagens atuais
            setTexto('');
            await schema.validate({
                full_name,
                surname,
                email,
                limit,
            })
            return true;

        } catch (err) {
            setTexto(err.errors);
            return false;
        }
    }

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
                                    <TextField
                                        id="cpf_cnpj"
                                        label="CPF / CPNJ"
                                        variant="outlined"
                                        name="cpf_cnpj"
                                        value={cpf_cnpj ? cpf_cnpj : ''}
                                        onChange={changeItem}
                                    />
                                    <TextField
                                        id="phone"
                                        label="Telefone"
                                        variant="outlined"
                                        name="phone"
                                        value={phone ? phone : ''}
                                        onChange={changeItem}
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

                                    <TextField
                                        id="limit"
                                        label="Limite"
                                        variant="outlined"
                                        name="limit"
                                        type="number"
                                        value={limit ? limit : ''}
                                        onChange={changeItem}
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