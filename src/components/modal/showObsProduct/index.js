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
    Button
} from "@mui/material";

import BaseCard from "../../baseCard/BaseCard";
import { showProductCart } from '../../../store/ducks/cart';
import { editProductCartFetch } from '../../../store/fetchActions/cart';
import { changeTitleAlert, turnObsCartModal } from '../../../store/ducks/Layout';

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

export default function ObsProductCartModal(props) {

    const [form, setForm] = useState({
        id: "",
        obs: "",
        id_product: ""
    });
    
    const { productCart} = useSelector(state => state.cart);
   
    const { isOpenObsCartModal } = useSelector(state => state.layout);
    const dispatch = useDispatch();

    const { id, obs, id_product } = form;
    const [texto, setTexto] = useState();
    
    const changeItem = ({ target }) => {
        setForm({ ...form, [target.name]: target.value });
    };

    useEffect(() => {

        if (productCart && productCart.id)
            setForm({...productCart});

    }, [productCart]);

    const cleanForm = () => {
        setForm({
            id: "",
            obs: "",
            id_product: ""            
        });
        setTexto('');
        dispatch(turnObsCartModal());
        dispatch(showProductCart({}));
    }

    const handleSaveData = async () => {
        dispatch(changeTitleAlert(`O produto ${JSON.stringify(productCart.product.name)} foi atualizado com sucesso!`));
        dispatch(editProductCartFetch(form, cleanForm));
    } 

    const handleClose = () => {
        cleanForm();
    };
    
    return (
        <div>
            {props.children}
            <Modal
                keepMounted
                open={isOpenObsCartModal}
                onClose={handleClose}
                aria-labelledby="keep-mounted-modal-title"
                aria-describedby="keep-mounted-modal-description"
            >
                <Box sx={style}>
                    <AlertModal />
                    <Grid container spacing={0}>
                        <Grid item xs={12} lg={12}>
                            <BaseCard title={productCart && productCart.id ? `Inserir observação ao produto "${productCart.product.name}"` : "Produto não selecionado"}>
                                {texto &&
                                    <Alert variant="filled" severity="warning">
                                        {texto}
                                    </Alert>
                                }
                                <br />
                                {/* <FormGroup > */}
                                <Stack spacing={3}>
                                    <TextField
                                        label={obs && obs.length > 0 ? `Observação: ${50 - obs.length} caracteres restantes` : 'Escreva observação'}
                                        variant="outlined"
                                        name="obs"
                                        value={obs ? obs : ''}
                                        onChange={changeItem}
                                        required
                                        inputProps={{
                                            style: {
                                                textTransform: "uppercase",
                                            },
                                            maxLength: 50
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