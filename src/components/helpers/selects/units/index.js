import React, { useState, useEffect } from "react";
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

import { useDispatch, useSelector } from 'react-redux';
import { getAllUnitsToSelect } from "../../../../store/fetchActions/unit";

export default function BasicSelect(props) {
  
  const dispatch = useDispatch();
  const { units } = useSelector(state => state.units);


   useEffect(() => {
    dispatch(getAllUnitsToSelect());
    
  }, []);

  const { label,  name, value, changeItem } = props;

  return (
    <Box sx={{ minWidth: 120 }}>
      <FormControl fullWidth>
        <InputLabel id="unity">Unidade</InputLabel>
        <Select
          id="unity"
          value={value}
          name={name}
          label={label}
          onChange={changeItem}
        >
          {units.map((unit) => (
             <MenuItem value={unit.id}>{unit.name}</MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}


// import React, { useState, useEffect } from "react";
// import TextField from '@mui/material/TextField';
// import Autocomplete from '@mui/material/Autocomplete';
// import CircularProgress from '@mui/material/CircularProgress';

// import { useDispatch, useSelector } from 'react-redux';
// import { getAllUnitsToSelect } from "../../../../store/fetchActions/unit";

// function sleep(delay = 0) {
//   return new Promise((resolve) => {
//     setTimeout(resolve, delay);
//   });
// }

// export default function index(props) {
//   const [open, setOpen] = useState(false);
//   const [options, setOptions] = useState([]);
//   const loading = open && options.length === 0;

//   const dispatch = useDispatch();
//   const { units } = useSelector(state => state.units);


//  useEffect(() => {
//     dispatch(getAllUnitsToSelect());
//     let active = true;

//     if (!loading) {
//       return undefined;
//     }

//     (async () => {
//       await sleep(1e3); // For demo purposes.

//       if (active) {
//         setOptions([...units]);
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

  
//   const { label,  name, value, changeItem } = props;

//   return (
//     <Autocomplete
//       id="unity"
//       // sx={{ width: 300 }}
//       open={open}
//       onOpen={() => {
//         setOpen(true);
//       }}
//       onClose={() => {
//         setOpen(false);
//       }}
//       isOptionEqualToValue={(option, value) => option.id === value.id}
//       getOptionLabel={(option) => option.id}
//       options={options}
//       loading={loading}
//       renderInput={(params) => (

//         <TextField
//           {...params}
//           id="unity"
//           label={label}
//           name={name}
//           value={value}
//           onSelect={changeItem}

//           InputProps={{
//             ...params.InputProps,
//             endAdornment: (
//               <React.Fragment>
//                 {loading ? <CircularProgress color="inherit" size={20} /> : null}
//                 {params.InputProps.endAdornment}
//               </React.Fragment>
//             ),
//           }}
//         />

//       )}
//     />
//   );
// }
