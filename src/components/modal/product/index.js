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

import { showProduct } from '../../../store/ducks/products';
import { editProductFetch, addProductFetch } from '../../../store/fetchActions/product';
import { turnModal, changeTitleAlert } from '../../../store/ducks/Layout';

// const typeProduct = {
//     name: "",
//     bar_code: "",
//     id_unity: "",
//     id_category: "",
//     cost_value: "",
//     sale_value: "",
//     stock: ""
// }

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

export default function ProductModal(props) {

    const [form, setForm] = useState({
        name: "",
        bar_code: "",
        id_unity: "",
        id_category: "",
        cost_value: "",
        sale_value: "",
        stock: ""
    });
    const { product } = useSelector(state => state.products);
    const { isOpenModal, isOpenAlert } = useSelector(state => state.layout);
    const dispatch = useDispatch();

    const { name, bar_code, id_unity, id_category, cost_value, sale_value, stock } = form;
    const [texto, setTexto] = useState();

    const changeItem = ({ target }) => {
        setForm({ ...form, [target.name]: target.value });
    };

    const cleanForm = () => {
        setForm({
            name: "",
            bar_code: "",
            id_unity: "",
            id_category: "",
            cost_value: "",
            sale_value: "",
            stock: ""
        });
        setTexto('');
        dispatch(turnModal());
        dispatch(showProduct({}));
    }


    const handleSaveData = async () => {
        if (!(await validate())) return;
        product && product.id ? handlePutData() : handlePostData()
    }

    const handlePostData = async () => {

        console.log("no modal entrou na rota add Producte ");
        dispatch(changeTitleAlert(`O produto ${form.name} foi Cadastrado com sucesso!`));
        dispatch(addProductFetch(form));
        cleanForm();
    };

    const handlePutData = async () => {

        console.log(" no modal entrou entrou na rota add Producte " + product.id);
        dispatch(changeTitleAlert(`O produto ${form.name} foi atualizado com sucesso!`));
        dispatch(editProductFetch(form));
        cleanForm();
    };

    const handleClose = () => {
        cleanForm();
    };


    async function validate() {
        let schema = yup.object().shape({

            stock: yup.number("Estoque deve ser um campo numerico")
                .required("O Campo Estoque é obrigatório")
                .positive("Estoque deve ser um campo positivo"),

            sale_value: yup.number("Valor de Venda deve ser um campo numerico")
                .required("O Campo Valor de Venda é obrigatório")
                .positive("Valor de Venda deve ser um campo positivo"),

            cost_value: yup.number("Valor de custo deve ser um campo numerico")
                .required("O Campo Valor de custo é obrigatório")
                .positive("Valor de custo deve ser um campo positivo"),

            name: yup.string("O Campo nome deve ser uma String")
                .required("O Campo Nome é obrigatório")
                .min(6, "Campo Nome deve possuir o minimo de ${min} caracteres"),
        })
        try {
            // limpa mensagem de erro de fazer a validação, de modo que so exiba as mensagens atuais
            setTexto('');
            await schema.validate({
                name,
                cost_value,
                sale_value,
                stock,
            })
            return true;

        } catch (err) {
            setTexto(err.errors);
            return false;
        }
    }

    useEffect(() => {

        if (product && product.id)
            setForm(product);

    }, [product]);

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
                            <BaseCard title={product && product.id ? "Editar Produto" : "Cadastrar Produto"}>
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
                                        label="Nome do Produto"
                                        variant="outlined"
                                        name="name"
                                        value={name ? name : ''}
                                        onChange={changeItem}
                                        required
                                    />
                                    <TextField
                                        id="bar_code"
                                        label="Código de Barras"
                                        variant="outlined"
                                        name="bar_code"
                                        value={bar_code ? bar_code : ''}
                                        onChange={changeItem}
                                    />
                                    <TextField
                                        id="id_category"
                                        label="Categoria"
                                        variant="outlined"
                                        name="id_category"
                                        value={id_category ? id_category : ''}
                                        onChange={changeItem}
                                    />
                                    <TextField
                                        id="cost_value"
                                        label="Valor de Custo"
                                        variant="outlined"
                                        name="cost_value"
                                        value={cost_value ? cost_value : ''}
                                        onChange={changeItem}
                                    />
                                    <TextField
                                        id="sale_value"
                                        label="Valor de Custo"
                                        variant="outlined"
                                        name="sale_value"
                                        value={sale_value ? sale_value : ''}
                                        onChange={changeItem}
                                    />
                                    <TextField
                                        id="unity"
                                        label="Unidade"
                                        variant="outlined"
                                        name="id_unity"
                                        value={id_unity ? id_unity : ''}
                                        onChange={changeItem}
                                        required
                                    />
                                    <TextField
                                        id="stock"
                                        label="Estoque"
                                        variant="outlined"
                                        name="stock"
                                        value={stock ? stock : ''}
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