import React, { useState, useEffect } from "react";
import { Fab, Box, Stack, TextField } from "@mui/material";
import BaseCard from "../baseCard/BaseCard";
import FeatherIcon from "feather-icons-react";
import InputSelectProduct from "../../components/inputs/inputSelectProduct";
import { useSelector, useDispatch } from 'react-redux';
import { getId } from "../helpers/formatt/getIdFromSelect";
import { summedPercentage } from "../helpers/functions/percent";
import { setCurrency } from "../helpers/formatt/currency";
import { getAllProducts } from "../../store/fetchActions/product";

export default () => {

    const [prod, setProd] = useState({
        name: "",
        bar_code: "",
        id_unity: "",
        id_category: "",
        cost_value: "",
        sale_value: "",
        stock: ""
    });

    const [id, setId] = useState();

    const dispatch = useDispatch();
    const { products } = useSelector(state => state.products);

    useEffect(() => {
        dispatch(getAllProducts());
    }, []);


    const getProduct = (value = 0) => {
        setId(value.id);
    };

    const show = () => {
        let a = products.filter((prod) => prod.id == id);
        if (a.length === 1) {
            setProd(...a);
        }
    }

    const Exibe = ({ prod }) => {
        const { name, bar_code, unity, category, cost_value, sale_value, percent, stock } = prod;
        return (

            prod.name !== "" &&

            <Stack spacing={3}>

                <h1>{name}</h1>
                <h3>{` VALOR: R$  ${sale_value}`}</h3>
                <br />

                <TextField
                    id="bar_code"
                    label="Código de Barras"
                    variant="outlined"
                    name="bar_code"
                    value={bar_code ? bar_code : ''}
                />

                <TextField
                    id="id_category"
                    label="Categoria"
                    variant="outlined"
                    name="bar_code"
                    value={category.name ? category.name : ''}
                />

                <Box sx={{
                    '& > :not(style)': { mb: 2 },
                    'display': 'flex',
                    'justify-content': 'space-between'
                }}
                >

                    <TextField
                        value={cost_value ? `R$  ${cost_value}` : ''}
                        label={'Valor de Custo'}
                        name={'cost_value'}
                        sx={{ width: "36%" }}

                    />

                    <TextField
                        value={summedPercentage(setCurrency(cost_value), setCurrency(sale_value)) + " %"}
                        label={'Percentual'}
                        name={'percent'}
                        sx={{ width: "24%" }}
                    />

                    <TextField
                        value={sale_value ? `R$  ${sale_value}` : ''}
                        label={'Valor de Venda'}
                        name={'sale_value'}
                        sx={{ width: "36%" }}
                    />
                </Box>

                <TextField
                    id="id_unity"
                    label="Unidade"
                    variant="outlined"
                    name="id_unity"
                    value={unity.name ? unity.name : ''}
                />

                <TextField
                    id="stock"
                    label="Estoque"
                    variant="outlined"
                    name="stock"
                    value={stock ? stock : ''}
                />

            </Stack>
        )
    }

    return (
        <BaseCard title="Procurar Produto">
            <Box sx={{
                '& > :not(style)': { m: 2 },
                'display': 'flex',
                'justify-content': 'stretch'
            }}
            >
                <InputSelectProduct
                    label="Produtos"
                    name="product"
                    products={products}
                    setProduct={getProduct}
                />

                <Fab onClick={() => show()} color="primary" aria-label="add">
                    <FeatherIcon icon="search" />
                </Fab>

            </Box>

            <br />
            <br />

            <Exibe prod={prod} />


        </BaseCard >
    );
};



















