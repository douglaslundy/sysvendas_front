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
    styled,
    TableContainer,
    TablePagination
} from "@mui/material";

import BaseCard from "../baseCard/BaseCard";
import FeatherIcon from "feather-icons-react";
import CategorieModal from "../modal/categorie";
import { useDispatch, useSelector } from "react-redux";

import { getAllCategories, inactiveCategorieFetch } from "../../store/fetchActions/categorie";
import { showCategorie } from "../../store/ducks/categories";
import { changeTitleAlert, turnModal } from "../../store/ducks/Layout";
import ConfirmDialog from "../confirmDialog";

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

    const [confirmDialog, setConfirmDialog] = useState({
        isOpen: false,
        title: 'Deseja realmente excluir',
        subTitle: 'Esta ação não poderá ser desfeita',
    });

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
        setConfirmDialog({ ...confirmDialog, isOpen: true, title: `Deseja Realmente inativar a categoria ${categorie.name}`, confirm: inactiveCategorieFetch(categorie) })
        dispatch(changeTitleAlert(`A Categoria ${categorie.name} foi inativado com sucesso!`))
    }

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    return (
        <BaseCard title="Categorias">

            <CategorieModal>
                <Fab onClick={() => { dispatch(turnModal()) }} color="primary" aria-label="add">
                    <FeatherIcon icon="user-plus" />
                </Fab>
            </CategorieModal>

            <TableContainer>
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
                        {categories
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((categorie, index) => (

                                <StyledTableRow key={categorie.id} hover>
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
                <TablePagination
                    component="div"
                    count={categories.length}
                    page={page}
                    onPageChange={handleChangePage}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </TableContainer>

            <ConfirmDialog
                confirmDialog={confirmDialog}
                setConfirmDialog={setConfirmDialog} />

        </BaseCard >
    );
};
