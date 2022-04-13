import React, { useState, useEffect } from "react";
import { Fab, Box } from "@mui/material";

import BaseCard from "../baseCard/BaseCard";
import FeatherIcon from "feather-icons-react";
import ProductModal from "../modal/product";
import InputSelect from "../../components/inputs/inputSelect";
import { useSelector, useDispatch } from 'react-redux';


export default () => {

    const [form, setForm] = useState({
        name: "",
        bar_code: "",
        id_unity: "",
        id_category: "",
        cost_value: "",
        sale_value: "",
        stock: ""
    });

    const { products } = useSelector(state => state.products);
    const { name, bar_code, id_unity, id_category, cost_value, sale_value, stock } = form;

    const changeItem = ({ target }) => {
        setForm({ ...form, [target.name]: target.value });
    };

    return (
        <BaseCard title="Procurar Produto">
            <Box sx={{
                '& > :not(style)': { m: 2 },
                'display': 'flex',
                'justify-content': 'stretch'
            }}
            >
                <InputSelect
                    label="Produtos"
                    name="products"
                    value={products}
                    changeItem={changeItem}
                />

                <Fab onClick={() => { alert('ola') }} color="primary" aria-label="add">
                    <FeatherIcon icon="search" />
                </Fab>
                
            </Box>
        </BaseCard >
    );
};



















