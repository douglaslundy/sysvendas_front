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

  useEffect(() => {
    let active = true;

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
  
  const { label,  name, value, changeItem, products, wd } = props;

  return (
    <Autocomplete
      id="product"
      // sx={{ width: "85%" }}
      sx={wd ? { width: wd } : { width: "85%" }}
      open={open}
      onOpen={() => {
        setOpen(true);
      }}
      onClose={() => {
        setOpen(false);
      }}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      getOptionLabel={(option) => `${option.id} - ${option.full_name}`}
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
          onSelect={changeItem}

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