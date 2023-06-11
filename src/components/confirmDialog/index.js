import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Typography,
    Button,
    TextField,
    Alert
} from '@mui/material';
import FeatherIcon from "feather-icons-react";
import { makeStyles } from "@material-ui/core/styles";

import React, { useContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import BaseCard from '../baseCard/BaseCard';
import { AuthContext } from "../../contexts/AuthContext";
import { getCompanyFetch } from '../../store/fetchActions/company';
import CryptoJS from 'crypto-js';


const useStyles = makeStyles(
    theme => (
        {
            dialog: {
                padding: theme.spacing(5),
                display: 'flex',
                justifyContent: 'space-around',
            },
            dialogTitle: {
                padding: theme.spacing(2),
                display: 'flex',
                justifyContent: 'space-around',
            },
            dialogContent: {
                textAlign: 'center',
                alignContent: 'center',
            },
            dialogAction: {
                justifyContent: 'space-evenly',
            }
        }
    ));

export default function ConfirmDialog(props) {
    const { confirmDialog, setConfirmDialog, isAuthenticated } = props;
    const [password, setPassword] = useState();
    const [masterPassword, setMasterPassword] = useState();
    const { company } = useContext(AuthContext);

    const { company: comp } = useSelector(state => state.companies);

    const [text, setText] = useState();
    const classes = useStyles();
    const dispatch = useDispatch();


    // conjunto de ações passadas como parametro dento de confirmAUth, a serem realizadas caso as senhas sejam iguais ou seja, a validação passe
    const action = () => {
         /**insira aqui a função dispatch confirm */ 
        dispatch(confirmDialog.confirm),
        setConfirmDialog({ ...confirmDialog, isOpen: false })
    }

    //função chamada dentro da opção sim do formulario
    const onClikConfirm = () => {
        isAuthenticated
            ?
            confirmAuth(action)
            :
            setConfirmDialog({ ...confirmDialog, isOpen: false })
    }

    //função que realiza a validação atraves da senha master, esta função é chamada dentro de onClikConfirm
    const confirmAuth = (execFunction) => {

        CryptoJS.MD5(password).toString() === masterPassword ?
            execFunction()
            :
            setText("Senha incorreta")

    }

    const changePassword = ({ target }) => {
        setPassword(target.value);
    }

    useEffect(() => {
        if (isAuthenticated && confirmDialog.isOpen == true) {
            dispatch(getCompanyFetch(company));
            setPassword("");
            setText("");
        }
    }, [confirmDialog.isOpen])

    useEffect(() => {
        if (isAuthenticated && confirmDialog.isOpen == true) {
            setMasterPassword(comp.master_password);
        }
    }, [comp])

    return (

        <Dialog open={confirmDialog.isOpen}
            onClose={() => setConfirmDialog({ ...confirmDialog, isOpen: false })}
            classes={{ paper: classes.dialog }}
        >
            <DialogTitle className={classes.dialogTitle}>
                <FeatherIcon icon="alert-triangle" size="66" />
            </DialogTitle>

            <DialogContent className={classes.dialogContent}>

                <Typography sx={{ fontWeight: "600", fontSize: "16px" }} variant="h6">
                    {confirmDialog.title}
                </Typography>

                {confirmDialog.subTitle}

            </DialogContent>

            {isAuthenticated &&
                <BaseCard title="Esta ação requer autenticação">
                    {text &&
                        <Alert variant="filled" severity="error">
                            {text}
                        </Alert>
                    }

                    <br />

                    <TextField
                        id="master_password"
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Senha"
                        type="password"
                        value={password}
                        onChange={changePassword}

                    />
                </BaseCard>
            }

            <DialogActions className={classes.dialogAction}>
                <Button
                    onClick={onClikConfirm}
                    color="error" size="medium" variant="contained">
                    <FeatherIcon icon="check" width="40" height="20" />
                    Sim
                </Button>

                <Button
                    onClick={() => setConfirmDialog({ ...confirmDialog, isOpen: false })}
                    color="success" size="medium" variant="contained">
                    <FeatherIcon icon="x" width="40" height="20" />
                    Não
                </Button>
            </DialogActions>
        </Dialog>
    )
}
