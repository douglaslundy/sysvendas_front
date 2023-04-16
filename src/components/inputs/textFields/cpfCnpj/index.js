import React, { useState } from "react"
// import CpfCnpj from "@react-br-forms/cpf-cnpj-mask"
import { TextField } from "@mui/material"
import InputMask from 'react-input-mask'


// npm install @react-br-forms/cpf-cnpj-mask

const onlyNumbers = (str) => str.replace(/[^0-9]/g, '');

const CpfCnpjInput = React.forwardRef((props, ref) => {

    const { inputRef, value, ...styles } = props;
    const mask = value.length <= 11 ? '999.999.999-999' : '99.999.999/9999-99';

    return (
        <InputMask
            {...styles}
            mask={mask}
            value={value}
        />
    );
});


export default function index({ label, name, value, changeItem })  {
    
    function handleChange(event) {

        changeItem({
            ...event,
            target: {
                ...event.target,
                name,
                value: onlyNumbers(event.target.value)
            }
        })

    }


    return (
        <TextField
            label={label}
            variant="outlined"
            name={name}
            value={value ? value : ''}
            onChange={handleChange}
            InputProps={{
                inputComponent: CpfCnpjInput,
            }}

        />
    )
}