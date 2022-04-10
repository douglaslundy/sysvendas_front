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
      <FormControl fullWidth required>
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
