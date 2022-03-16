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

import { showCategorie } from '../../../store/ducks/categories';
import { editCategorieFetch, addCategorieFetch } from '../../../store/fetchActions/categorie';
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

export default function CategorieModal(props) {

    const [form, setForm] = useState({
        name: "",
    });
    
    const { categorie } = useSelector(state => state.categories);

    
    const { isOpenModal, isOpenAlert } = useSelector(state => state.layout);
    const dispatch = useDispatch();

    const { name } = form;
    const [texto, setTexto] = useState();

    const changeItem = ({ target }) => {
        setForm({ ...form, [target.name]: target.value });
    };

    const cleanForm = () => {
        setForm({
            name: "",
        });
        setTexto('');
        dispatch(turnModal());
        dispatch(showCategorie({}));
    }


    const handleSaveData = async () => {
        if (!(await validate())) return;
        categorie && categorie.id ? handlePutData() : handlePostData()
    }

    const handlePostData = async () => {

        console.log("no modal entrou na rota add Categoriee ");
        dispatch(changeTitleAlert(`A Categoria ${form.name} foi Cadastrado com sucesso!`));
        dispatch(addCategorieFetch(form));
        cleanForm();
    };

    const handlePutData = async () => {
        dispatch(changeTitleAlert(`A categoria ${form.name} foi atualizado com sucesso!`));
        await dispatch(editCategorieFetch(form));
        cleanForm();
    };

    const handleClose = () => {
        cleanForm();
    };


    async function validate() {
        let schema = yup.object().shape({

            name: yup.string("O Campo nome deve ser uma String")
                .required("O Campo Nome é obrigatório")
                .min(3, "Campo Nome deve possuir o minimo de ${min} caracteres"),
        })
        try {
            // limpa mensagem de erro de fazer a validação, de modo que so exiba as mensagens atuais
            setTexto('');
            await schema.validate({
                name,
            })
            return true;

        } catch (err) {
            setTexto(err.errors);
            return false;
        }
    }

    useEffect(() => {

        if (categorie && categorie.id)
            setForm(categorie);

    }, [categorie]);

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
                            <BaseCard title={categorie && categorie.id ? "Editar Categoria" : "Cadastrar Categoria"}>
                                {texto &&
                                    <Alert variant="filled" severity="warning">
                                        {texto}
                                    </Alert>
                                }

                                <br />

                                {/* <FormGroup > */}
                                <Stack spacing={3}>
                                    <TextField
                                        id="name"
                                        label="Nome"
                                        variant="outlined"
                                        name="name"
                                        value={name ? name : ''}
                                        onChange={changeItem}
                                        required
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