import React, { useState, useEffect } from "react";
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';

function sleep(delay = 0) {
  return new Promise((resolve) => {
    setTimeout(resolve, delay);
  });
}

export default function index(props) {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState([]);
  const loading = open && options.length === 0;
  const { label, name, setProduct, products, wd } = props;

  useEffect(() => {
    let active = true;

    // trecho teste afim de solucionar o bug que da quando e selecionado o mesmo valor no select que foi selecionado a ultima vez
    if (!open)
      setProduct({})

    if (!loading) {
      return undefined;
    }

    (async () => {
      await sleep(1e3);

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


  const getProduct = (id) => {
    setProduct(products.filter((prod) => prod.id == id)[0]);
  }

  return (
    <Autocomplete
      id="product"
      sx={wd ? { width: wd } : { width: "85%" }}
      open={open}
      onOpen={() => {
        setOpen(true);
      }}
      onClose={() => {
        setOpen(false);
      }}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      getOptionLabel={(option) => `${option.name} - R$ ${option.sale_value} -  Código ${option.bar_code}`.toUpperCase()}
      noOptionsText={"Produto inexistente!"}
      options={options}
      loading={loading}
      // onSelect={getProduct}
      // onChange={(_, newValue) => { setSelectedId(newValue?.id) }}
      onChange={(_, newValue) => { getProduct(newValue?.id) }}
      name={name}

      renderInput={(params) => (

        <TextField
          {...params}
          label={label}

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