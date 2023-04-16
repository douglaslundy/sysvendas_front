import React, { useState, useEffect } from 'react';
import AlertModal from '../../messagesModal'
import { useDispatch, useSelector } from 'react-redux';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Currency from '../../inputs/textFields/currency';
import Stock from '../../inputs/textFields/stock-qtd';
import Percent from '../../inputs/textFields/percent';
import Select from '../../inputs/selects';
import Switch from '@mui/material/Switch';
import { summedPercentage, valueSaleSummedFromPercent } from '../../helpers/functions/percent';
import {
    Grid,
    Stack,
    TextField,
    Alert,
    Button,
    FormGroup,
    FormControlLabel
} from "@mui/material";

import BaseCard from "../../baseCard/BaseCard";
import { showProduct } from '../../../store/ducks/products';
import { editProductFetch, addProductFetch } from '../../../store/fetchActions/product';
import { turnModal, changeTitleAlert } from '../../../store/ducks/Layout';
import { getCurrency, setCurrency } from '../../helpers/formatt/currency';
import { convertStock } from '../../helpers/stock';
import { getAllUnitsToSelect } from "../../../store/fetchActions/unit";
import { getAllCategoriesToSelect } from "../../../store/fetchActions/categorie";
import InputSelectProduct from '../../../components/inputs/inputSelectProduct';

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
        reason: 1,
        stock: "",
        id_product_stock: ""
    });
    const { product } = useSelector(state => state.products);
    const { categories } = useSelector(state => state.categories);
    const { units } = useSelector(state => state.units);

    const { isOpenModal } = useSelector(state => state.layout);
    const dispatch = useDispatch();

    const { name, bar_code, id_unity, id_category, cost_value, sale_value, reason, stock } = form;
    const [texto, setTexto] = useState();
    const [percent, setPercent] = useState();

    // responsavel por informar ao useEffect se a alteração esta acontecendo no input valor de venda ou percent
    // e permitir que ele execute ou não a rotina de atualizar o input percnetual 
    const [isPercent, setIsPercent] = useState(false);

    const changeItem = ({ target }) => {
        setForm({ ...form, [target.name]: target.value });
    };


    const changePercent = ({ target }) => {

        setIsPercent(true);
        setPercent(target.value);
        const newValue = valueSaleSummedFromPercent(cost_value, target.value);
        setForm({ ...form, ['sale_value']: getCurrency(newValue * 100) });
        setIsPercent(false);

    };

    const changePercentPerValue = () => {
        if (!isPercent) {
            setPercent(parseFloat(summedPercentage(setCurrency(cost_value), setCurrency(sale_value))));
        }
    }
    const cleanForm = () => {
        setForm({
            name: "",
            bar_code: "",
            id_unity: "",
            id_category: "",
            cost_value: "",
            sale_value: "",
            reason: 1,
            stock: "",
            id_product_stock: ""
        });
        setTexto('');
        dispatch(turnModal());
        dispatch(showProduct({}));
    }

    const handleSaveData = async () => {
        product && product.id ? handlePutData() : handlePostData()
    }

    const handlePostData = async () => {
        dispatch(changeTitleAlert(`O produto ${form.name} foi Cadastrado com sucesso!`));
        dispatch(addProductFetch(form, cleanForm));
    };

    const handlePutData = async () => {
        dispatch(changeTitleAlert(`O produto ${form.name} foi atualizado com sucesso!`));
        dispatch(editProductFetch(form, cleanForm));
    };

    const handleClose = () => {
        cleanForm();
    };
    
    const [isVisible, setIsVisible] = useState(false);
    const products = props.products.filter((prod) => prod.id == prod.id_product_stock);

    const handleIsVisible = () => {
        setIsVisible(!isVisible);
    }

    const getProductStock = id => {
        return { ...products.filter((prod) => prod.id == id)[0] };
    }

    const setProduct = value => {
        setForm({ ...form, ['id_product_stock']: value?.id, ['stock']: getProductStock(value?.id).stock });
    }

    useEffect(() => {
        if (product && product.id) {
            setForm(product);
            product.id_product_stock != null && product.id != product.id_product_stock ? setIsVisible(true) : setIsVisible(false);
        } else {
            setIsVisible(false);
        }
    }, [product]);

    useEffect(() => {
        changePercentPerValue()
    }, [cost_value, sale_value]);

    useEffect(() => {
        !isVisible ? setForm({ ...form, ['id_product_stock']: null }) : setForm({ ...form, ['stock']: stock });
    }, [isVisible]);


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
                                        inputProps={{
                                            style: {
                                                textTransform: "uppercase"
                                            }
                                        }}
                                    />
                                    <TextField
                                        id="bar_code"
                                        label="Código de Barras"
                                        variant="outlined"
                                        name="bar_code"
                                        value={bar_code ? bar_code : ''}
                                        onChange={changeItem}
                                        required
                                    />
                                    <Select value={id_category}
                                        label={'Categoria'}
                                        name={'id_category'}
                                        store={categories}
                                        getAllSelects={getAllCategoriesToSelect}
                                        changeItem={changeItem}
                                    />
                                    <Box sx={{
                                        '& > :not(style)': { mb: 2 },
                                        'display': 'flex',
                                        'justify-content': 'space-between'
                                    }}
                                    >
                                        <Currency value={cost_value}
                                            label={'Valor de Custo'}
                                            name={'cost_value'}
                                            changeItem={changeItem}
                                            wd={"36%"}
                                        />
                                        <Currency value={sale_value}
                                            label={'Valor de Venda'}
                                            name={'sale_value'}
                                            changeItem={changeItem}
                                            wd={"36%"}
                                        />
                                        <Percent value={percent}
                                            label={'Percentual'}
                                            name={'percent'}
                                            changeItem={changePercent}
                                            wd={"24%"}
                                        />
                                    </Box>
                                    <Select value={id_unity}
                                        label={'Unidade'}
                                        name={'id_unity'}
                                        store={units}
                                        getAllSelects={getAllUnitsToSelect}
                                        changeItem={changeItem}
                                    />
                                    <Stock
                                        label="Razão"
                                        variant="outlined"
                                        name="reason"
                                        value={reason ? reason : ''}
                                        changeItem={changeItem}
                                        required
                                    />



                                    <FormGroup>
                                        <FormControlLabel control={<Switch checked={isVisible}
                                            onClick={handleIsVisible} />} label={isVisible ? "Desintegrar estoque" : "Integrar estoque"} />
                                    </FormGroup>

                                    {isVisible &&
                                        <InputSelectProduct
                                            label={product ? getProductStock(product.id_product_stock).name : "Selecione o produto a integrar"}
                                            name="id_product_stock"
                                            products={products}
                                            setProduct={setProduct}
                                            wd={"100%"}
                                        />
                                    }

                                    {!isVisible &&
                                        <Stock
                                            label="Estoque Real"
                                            variant="outlined"
                                            name="stock"
                                            value={stock ? stock : ''}
                                            changeItem={changeItem}
                                            required
                                        />
                                    }
                                    <TextField
                                        label="Estoque Praticado"
                                        variant="outlined"
                                        name="stock"
                                        value={convertStock(stock ? stock : 0, reason ? reason : 1)}
                                        disabled={true}
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