import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import React, { useEffect, useState } from 'react';

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
        setOptions([...clients]);
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

  const { id, value, label, name, setClient, clients, wd } = props;
  const [selectedId, setSelectedId] = useState(value?.id || 0); // Definir o ID selecionado como o valor padrão

  useEffect(() => {
    const selectedClient = clients.find(cli => cli.id === selectedId);
    if (selectedClient) {
      setClient(selectedClient);
    }
  }, [selectedId, setClient, clients]);

  return (
    <Autocomplete
      id={id}
      value={value}
      sx={wd ? { width: wd } : { width: "85%" }}
      open={open}
      onOpen={() => {
        setOpen(true);
      }}
      onClose={() => {
        setOpen(false);
      }}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      getOptionLabel={(option) => `${option.full_name ? option.full_name : option.name}`.toUpperCase()}
      noOptionsText={"Busca não retornou resultados!"}
      options={options}
      loading={loading}
      name={name}
      onChange={(_, newValue) => {
        setSelectedId(newValue?.id);
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          onChange={(_, value) => {
            setOptions([...clients.filter((cli) => cli.full_name ? cli.full_name === value : cli.name === value)]);
          }}
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












// import React, { useState, useEffect } from "react";
// import TextField from '@mui/material/TextField';
// import Autocomplete from '@mui/material/Autocomplete';
// import CircularProgress from '@mui/material/CircularProgress';

// function sleep(delay = 0) {
//   return new Promise((resolve) => {
//     setTimeout(resolve, delay);
//   });
// }

// export default function Index(props) {
//   const [open, setOpen] = useState(false);
//   const [options, setOptions] = useState([]);
//   const loading = open && options.length === 0;
//   const { id, value, label, name, setClient, clients, wd } = props;
//   const [selectedId, setSelectedId] = useState(value?.id || 0);


//   useEffect(() => {
//     let active = true;

//     setClient({});

//     if (!loading) {
//       return undefined;
//     }

//     (async () => {
//       await sleep(1e3);

//       if (active) {
//         setOptions([...clients]);
//       }
//     })();

//     return () => {
//       active = false;
//     };
//   }, [loading]);

//   useEffect(() => {
//     if (!open) {
//       setOptions([]);
//     }
//   }, [open]);

//   useEffect(() => {
//     const selectedClient = clients.find(cli => cli.id === selectedId);
//     if (selectedClient) {
//       setClient(selectedClient);
//     }
//   }, [selectedId, setClient, clients]);

//   const handleInputChange = (_, newValue) => {
//     if (!newValue) {
//       setSelectedId(0);
//       setClient({});
//       setOptions([...clients]);
//     }
//   };

//   return (
//     <Autocomplete
//       id={id}
//       name={name}
//       value={value}
//       sx={wd ? { width: wd } : { width: "85%" }}
//       open={open}
//       onOpen={() => setOpen(true)}
//       onClose={() => setOpen(false)}
//       isOptionEqualToValue={(option, value) => option.id === value.id}
//       getOptionLabel={(option) => `${option.full_name ? option.full_name : option.name}`}
//       noOptionsText="Busca não retornou resultados!"
//       options={options}
//       loading={loading}
//       onChange={(_, newValue) => setSelectedId(newValue?.id || 0)}
//       renderInput={(params) => (
//         <TextField
//           {...params}
//           label={label}
//           onChange={handleInputChange}
//           InputProps={{
//             ...params.InputProps,
//             endAdornment: (
//               <React.Fragment>
//                 {loading ? <CircularProgress color="inherit" size={20} /> : null}
//                 {/* funcao abaixo exibe ou remove o icone de clear */}
//                 {/* {params.InputProps.endAdornment} */}
//               </React.Fragment>
//             ),
//           }}
//         />
//       )}
//     />
//   );
// }