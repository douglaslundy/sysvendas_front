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
import CategorieModal from "../modal/categorie";
import { useDispatch, useSelector } from "react-redux";

import { getAllCategories, inactiveCategorieFetch } from "../../store/fetchActions/categorie";
import { showCategorie } from "../../store/ducks/categories";
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

    const { categories } = useSelector(state => state.categories);

    useEffect(() => {
        dispatch(getAllCategories());
    }, []);

    const HandleEditCategorie = async categorie => {
        dispatch(showCategorie(categorie));
        dispatch(turnModal());
    }  

    const HandleInactiveCategorie = async categorie => {
        dispatch(inactiveCategorieFetch(categorie));
        dispatch(changeTitleAlert(`A Categoria ${categorie.name} foi inativado com sucesso!`))
    }

    return (
        <BaseCard title="Categorias">

            <CategorieModal>
                <Fab onClick={() => { dispatch(turnModal()) }} color="primary" aria-label="add">
                    <FeatherIcon icon="user-plus" />
                </Fab>
            </CategorieModal>
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
                    {categories.map((categorie) => (
                        <StyledTableRow  key={categorie.id} hover>
                            {categorie &&
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
                                                    {categorie.name}
                                                </Typography>                                               
                                            </Box>
                                        </Box>
                                    </TableCell>                                    

                                    <TableCell align="center">
                                        <Box sx={{ "& button": { mx: 1 } }}>

                                            <Button onClick={() => { HandleEditCategorie(categorie) }} color="primary" size="medium" variant="contained">
                                                <FeatherIcon icon="edit" width="20" height="20" />
                                                Editar
                                            </Button>

                                            <Button onClick={() => { HandleInactiveCategorie(categorie) }} color="error" size="medium" variant="contained">
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
