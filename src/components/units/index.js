import React, { useState, useEffect } from "react";
import {
    Typography,
    Box,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Fab,
    Button, 
    styled 
} from "@mui/material";

import BaseCard from "../baseCard/BaseCard";
import FeatherIcon from "feather-icons-react";
import UnitModal from "../modal/unit";
import { useDispatch, useSelector } from "react-redux";

import { getAllUnits, inactiveUnitFetch } from "../../store/fetchActions/unit";
import { showUnit } from "../../store/ducks/units";
import { changeTitleAlert, turnAlert, turnModal } from "../../store/ducks/Layout";
  
  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
      border: 0,
    },
  }));

export default () => {

    const dispatch = useDispatch();

    const { units } = useSelector(state => state.units);

    useEffect(() => {
        dispatch(getAllUnits());
    }, []);

    const HandleEditUnit = async unit => {
        dispatch(showUnit(unit));
        dispatch(turnModal());
    }  

    const HandleInactiveUnit = async unit => {
        dispatch(inactiveUnitFetch(unit));
        dispatch(changeTitleAlert(`A Categoria ${unit.name} foi inativado com sucesso!`))
    }

    return (
        <BaseCard title="Unidades">

            <UnitModal>
                <Fab onClick={() => { dispatch(turnModal()) }} color="primary" aria-label="add">
                    <FeatherIcon icon="user-plus" />
                </Fab>
            </UnitModal>
            <br />
         
            <Table
                aria-label="simple table"
                sx={{
                    mt: 3,
                    whiteSpace: "nowrap",
                }}
            >
                <TableHead>
                    <TableRow>
                        <TableCell>
                            <Typography color="textSecondary" variant="h6">
                                Nome / Apelido
                            </Typography>
                        </TableCell>
                                                
                        <TableCell align="center">
                            <Typography color="textSecondary" variant="h6">
                                Ações
                            </Typography>
                        </TableCell>
                    </TableRow>
                </TableHead>

                <TableBody>                                 
                    {units.map((unit) => (
                        <StyledTableRow  key={unit.id} hover>
                            {unit &&
                                <>
                                    <TableCell>
                                        <Box
                                            sx={{
                                                display: "flex",
                                                alignItems: "center",
                                            }}
                                        >
                                            <Box>
                                                <Typography
                                                    variant="h6"
                                                    sx={{
                                                        fontWeight: "600",
                                                    }}
                                                >
                                                    {unit.name}
                                                </Typography>                                               
                                            </Box>
                                        </Box>
                                    </TableCell>                                    

                                    <TableCell align="center">
                                        <Box sx={{ "& button": { mx: 1 } }}>

                                            <Button onClick={() => { HandleEditUnit(unit) }} color="primary" size="medium" variant="contained">
                                                <FeatherIcon icon="edit" width="20" height="20" />
                                                Editar
                                            </Button>

                                            <Button onClick={() => { HandleInactiveUnit(unit) }} color="error" size="medium" variant="contained">
                                                <FeatherIcon icon="trash" width="20" height="20" />
                                                Inativar
                                            </Button>


                                        </Box>
                                    </TableCell>
                                </>
                            }

                        </StyledTableRow >
                    ))}
                </TableBody>
            </Table>
            
        </BaseCard >
    );
};
