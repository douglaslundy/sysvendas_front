import React, { useState, useEffect } from "react";
import { Fab, Box, Button, Stack, TextField } from "@mui/material";
import BaseCard from "../baseCard/BaseCard";
import { changeTitleAlert } from '../../store/ducks/Layout';
import { useDispatch, useSelector } from 'react-redux';
import Percent from '../inputs/textFields/percent';
import Select from '../inputs/selects';
import { getAllCategoriesToSelect } from "../../store/fetchActions/categorie";
import { valueUpdatePerCategoy } from '../../store/fetchActions/product';
import AlertModal from "../messagesModal";
import ConfirmDialog from "../confirmDialog";

export default () => {

    const [confirmDialog, setConfirmDialog] = useState({
        isOpen: false,
        title: 'Deseja realmente aplicar essa correção no preço desta categoria?',
        subTitle: 'Esta ação não poderá ser desfeita',
    });

    const { categories } = useSelector(state => state.categories);
    const dispatch = useDispatch();
    const [form, setForm] = useState({
        id_category: "",
        percent: "",
    });
    const { id_category, percent } = form;

    const changeItem = ({ target }) => {
        setForm({ ...form, [target.name]: target.value });
    };

    const cleanForm = () => {
        setForm({
            percent: "",
            id_category: ""
        });
    }

    const handleSaveData = async () => {
        setConfirmDialog({ ...confirmDialog, isOpen: true, title: `Deseja realmente aplicar o acrescimo de ${form.percent} nesta categoria?`, confirm: valueUpdatePerCategoy(form, cleanForm) })
        dispatch(changeTitleAlert(`O Preço dos produtos da Categoria selecionada foram atualizados em ${form.percent} com sucesso!`));
    }

    return (
        <BaseCard title="Atualizar valor por categoria">
            <AlertModal />
            <Box sx={{
                '& > :not(style)': { mb: 2 },
                'display': 'flex',
                'justify-content': 'space-between'
            }}
            >

                <Select value={id_category}
                    label={'Categoria'}
                    name={'id_category'}
                    store={categories}
                    getAllSelects={getAllCategoriesToSelect}
                    changeItem={changeItem}
                    wd={"50%"}
                />

                <Percent value={percent}
                    label={'Percentual'}
                    name={'percent'}
                    changeItem={changeItem}
                    wd={"44%"}
                />
            </Box>
            <br />
            <Box sx={{ "& button": { mx: 1 } }}>
                <Button onClick={handleSaveData} variant="contained" mt={2}>
                    Gravar
                </Button>

                <Button onClick={() => { cleanForm() }} variant="outlined" mt={2}>
                    Cancelar
                </Button>
            </Box>
            <ConfirmDialog
                confirmDialog={confirmDialog}
                setConfirmDialog={setConfirmDialog} />


        </BaseCard >
    );
};



















