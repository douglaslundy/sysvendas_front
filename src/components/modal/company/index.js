import React, { useState, useEffect, useContext } from 'react';
import AlertModal from '../../messagesModal'
import { useDispatch, useSelector } from 'react-redux';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import CpfCnpj from '../../inputs/textFields/cpfCnpj';
import Phone from '../../inputs/textFields/phone';

import {
    Grid,
    Stack,
    TextField,
    Alert,
    Button,
    InputLabel,
    Select,
    MenuItem,
    FormControl
} from "@mui/material";

import BaseCard from "../../baseCard/BaseCard";

import { showCompany } from '../../../store/ducks/companies';
import { editCompanyFetch } from '../../../store/fetchActions/company';
import { turnCompanyModal, changeTitleAlert, addAlertMessage } from '../../../store/ducks/Layout';


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

export default function CompanyModal(props) {

    const [form, setForm] = useState({
        fantasy_name: "",
        corporate_name: "",
        email: "",
        cnpj: "",
        ie: "",
        im: "",
        balance: "",
        zip_code: "",
        city: "",
        street: "",
        number: "",
        complement: "",
        neighborhood: "",
        phone: "",
        validity_date: "",
        active: "",
        marked: "",
        password: "",
        password2: "",
    });

    const { company } = useSelector(state => state.companies);
    const { isOpenCompanyModal } = useSelector(state => state.layout);
    const dispatch = useDispatch();

    const { fantasy_name, corporate_name, email, cnpj, ie, im, balance, zip_code, city, street, number, complement, neighborhood, phone, active, marked, password, password2 } = form;
    const [texto, setTexto] = useState();

    const changeItem = ({ target }) => {
        setForm({ ...form, [target.name]: target.value });
    };

    const cleanForm = () => {
        setForm({
            fantasy_name: "",
            corporate_name: "",
            email: "",
            cnpj: "",
            ie: "",
            im: "",
            balance: "",
            zip_code: "",
            city: "",
            street: "",
            number: "",
            complement: "",
            neighborhood: "",
            phone: "",
            validity_date: "",
            active: "",
            marked: "",
            password: "",
            password2: "",
        });
        setTexto('');
        dispatch(turnCompanyModal());
        dispatch(showCompany({}));
    }


    const handleSaveData = async () => {
        password && password !== password2 ? dispatch(addAlertMessage("As senhas precisam ser iguais")) : handlePutData()
    }

    const handlePutData = async () => {

        if (password && password !== password2)
            alert("erro")

        dispatch(changeTitleAlert(`Os dados da empresa foram atualizados com sucesso!`));
        dispatch(editCompanyFetch(form, cleanForm));
    };

    const handleClose = () => {
        cleanForm();
    };

    useEffect(() => {
        if (company && company.cnpj)
            setForm(company);

    }, [company]);

    return (
        <div>
            {props.children}
            <Modal
                keepMounted
                open={isOpenCompanyModal}
                onClose={handleClose}
                aria-labelledby="keep-mounted-modal-title"
                aria-describedby="keep-mounted-modal-description"
            >
                <Box sx={style}>

                    <AlertModal />

                    <Grid container spacing={0}>
                        <Grid item xs={12} lg={12}>
                            <BaseCard title={company && company.cnpj ? "Editar dados da Empresa" : "Erro ao resgatar dados da empresa"}>
                                {texto &&
                                    <Alert variant="filled" severity="warning">
                                        {texto}
                                    </Alert>
                                }

                                <br />

                                {/* <FormGroup > */}
                                <Stack spacing={3}>

                                    <TextField
                                        id="company_fantasy_name"
                                        label={fantasy_name && fantasy_name.length > 0 ? `Nome Fantasia: ${100 - fantasy_name.length} caracteres restantes` : 'Nome Fantasia'}
                                        variant="outlined"
                                        name="fantasy_name"
                                        value={fantasy_name ? fantasy_name : ''}
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
                                        id="company_corporate_name"
                                        label={corporate_name && corporate_name.length > 0 ? `Razão Social: ${100 - fantasy_name.length} caracteres restantes` : 'Razão Social'}
                                        variant="outlined"
                                        name="corporate_name"
                                        value={corporate_name ? corporate_name : ''}
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
                                        id="company_email"
                                        label={email && email.length > 0 ? `@Email: ${100 - email.length} caracteres restantes` : '@Email'}
                                        variant="outlined"
                                        type="email"
                                        name="email"
                                        value={email ? email : ''}
                                        onChange={changeItem}
                                        required
                                        inputProps={{
                                            maxLength: 100
                                        }}
                                    />

                                    <CpfCnpj value={cnpj ? cnpj : ''}
                                        label={'CNPJ'}
                                        name={'cnpj'}
                                        changeItem={changeItem}
                                        disabled={company && company.cnpj ? true : false}
                                    />

                                    <TextField
                                        id="company_ie"
                                        label={ie && ie.length > 0 ? `Inscrição Estadual: ${18 - ie.length} caracteres restantes` : 'Inscrição Estadual'}
                                        variant="outlined"
                                        name="ie"
                                        value={ie ? ie : ''}
                                        onChange={changeItem}
                                        required
                                        inputProps={{
                                            style: {
                                                textTransform: "uppercase"
                                            },
                                            maxLength: 18
                                        }}
                                    />

                                    <TextField
                                        id="company_im"
                                        label={im && im.length > 0 ? `Inscrição Municipal: ${18 - im.length} caracteres restantes` : 'Inscrição Municipal'}
                                        variant="outlined"
                                        name="im"
                                        value={im ? im : ''}
                                        onChange={changeItem}
                                        required
                                        inputProps={{
                                            style: {
                                                textTransform: "uppercase"
                                            },
                                            maxLength: 20
                                        }}
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
                                            id="company_zip_code"
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
                                            id="company_street" label={street && street.length > 0 ? `Rua: ${100 - street.length} caracteres restantes` : 'Rua'}
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
                                            id="company_number" label={number && number.length > 0 ? `Nº: ${6 - number.length} caracteres restantes` : 'Nº'}
                                            variant="outlined"
                                            name="number"
                                            value={number ? number : ''}
                                            onChange={changeItem}
                                            sx={{ width: '16%' }}
                                            inputProps={{
                                                style: {
                                                    textTransform: "uppercase"
                                                },
                                                maxLength: 10
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
                                            id="company_complement"
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
                                            id="company_district"
                                            label={neighborhood && neighborhood.length > 0 ? `Bairro: ${100 - neighborhood.length} caracteres restantes` : 'Bairro'}
                                            variant="outlined"
                                            name="neighborhood"
                                            value={neighborhood ? neighborhood : ''}
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
                                            id="company_city"
                                            label={city && city.length > 0 ? `Cidade: ${30 - city.length} caracteres restantes` : 'Cidade'}
                                            variant="outlined"
                                            name="city"
                                            value={city ? city : ''}
                                            onChange={changeItem}
                                            sx={{ width: '36%' }}
                                            inputProps={{
                                                style: {
                                                    textTransform: "uppercase"
                                                },
                                                maxLength: 30
                                            }}
                                        />
                                    </Box>

                                    <TextField
                                        id="company_password"
                                        margin="normal"
                                        required
                                        fullWidth
                                        name="password"
                                        label="Senha"
                                        type="password"
                                        value={password ? password : ''}
                                        onChange={changeItem}
                                    />

                                    <TextField
                                        id="company_password2"
                                        margin="normal"
                                        required
                                        fullWidth
                                        name="password2"
                                        label="Repita a Senha"
                                        type="password"
                                        value={password2 ? password2 : ''}
                                        onChange={changeItem}
                                    />

                                </Stack>
                                {/* </FormGroup> */}
                                <br />
                                {texto}
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
        </div >
    );
}