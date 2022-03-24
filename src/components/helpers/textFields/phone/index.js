import React from 'react';
import { TextField } from "@mui/material";
import InputMask from 'react-input-mask';

const PhoneMask = (props) => {
    const { inputRef, ...other } = props;
    return (
        <InputMask 
        {...other}
        ref={inputRef}
        mask="(99)99999-9999" maskChar={null} />
    );
}

export default function index(props) {

    const { value, changeItem } = props;
    return (
        <TextField
            id="phone"
            label="Telefone"
            variant="outlined"
            name="phone"
            value={value ? value : ''}
            onChange={changeItem}

            InputProps={{
                inputComponent: PhoneMask,
            }}

        />
    )
}