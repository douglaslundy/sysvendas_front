import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Typography,
    Button
} from '@mui/material';
import FeatherIcon from "feather-icons-react";
import { makeStyles } from '@mui/styles';

import React from 'react';

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
    const { confirmDialog, setConfirmDialog } = props;
    const classes = useStyles();
    return (

        <Dialog open={confirmDialog.isOpen}
            onClose={() => setConfirmDialog({isOpen: false })}
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

            <DialogActions className={classes.dialogAction}>
                <Button
                    onClick={confirmDialog.onConfirm}
                    color="error" size="medium" variant="contained">
                    <FeatherIcon icon="trash" width="40" height="20" />
                    Sim
                </Button>

                <Button
                    onClick={() => setConfirmDialog({ ...confirmDialog, isOpen: false })}
                    color="success" size="medium" variant="contained">
                    <FeatherIcon icon="trash" width="40" height="20" />
                    Não
                </Button>
            </DialogActions>
        </Dialog>
    )
}
