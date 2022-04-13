import React, { useState, useEffect } from "react";
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';

import { useDispatch, useSelector } from 'react-redux';
import { getAllProducts } from "../../../store/fetchActions/product";
import { showProduct } from "../../../store/ducks/products";
import { changeTitleAlert, turnAlert, turnModal } from "../../../store/ducks/Layout";
import ConfirmDialog from "../../confirmDialog";
import { convertToBrlCurrency } from "../../helpers/formatt/currency";

function sleep(delay = 0) {
  return new Promise((resolve) => {
    setTimeout(resolve, delay);
  });
}

export default function index(props) {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState([]);
  const loading = open && options.length === 0;

  const dispatch = useDispatch();
  const { products } = useSelector(state => state.products);

  useEffect(()=>{
    dispatch(getAllProducts());
  }, []);

  useEffect(() => {
    // dispatch(getAllProducts());
    let active = true;

    if (!loading) {
      return undefined;
    }

    (async () => {
      await sleep(1e3); // For demo purposes.

      if (active) {
        setOptions([...products]);
      }
    })();

    return () => {
      active = false;
    };
    
  }, [loading]);

  useEffect(() => {
    if (!open) {
      setOptions([]);
    }
  }, [open]);

  const show = (id) =>{
    console.log('*********************************')
    console.log('o Id do produto é ' + id)
  }

  
  const { label,  name, value, changeItem } = props;

  return (
    <Autocomplete
      id="product"
      sx={{ width: "85%" }}
      open={open}
      onOpen={() => {
        setOpen(true);
      }}
      onClose={() => {
        setOpen(false);
      }}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      getOptionLabel={(option) => `${option.id} - ${option.name}`}
      noOptionsText={"Categoria Indisponível"}
      options={options}
      loading={loading}
      renderInput={(params) => (

        <TextField
          {...params}
          id="product"
          label={label}
          name={name}
          value={value}
          onChange={show(JSON.stringify(value))}

          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <React.Fragment>
                {loading ? <CircularProgress color="inherit" size={20} /> : null}
                {params.InputProps.endAdornment}
              </React.Fragment>
            ),
          }}
        />

      )}
    />
  );
}