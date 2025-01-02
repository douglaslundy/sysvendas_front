import React, { useState, useEffect, useContext } from "react";
import {
    Typography,
    Box,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    styled,
    TableContainer,
    TablePagination,
} from "@mui/material";

import BaseCard from "../baseCard/BaseCard";
import Select from '../inputs/selects';
import { useSelector, useDispatch } from 'react-redux';
import { getAllErrorLogs } from "../../store/fetchActions/errorlogs";
import { AuthContext } from "../../contexts/AuthContext";
import { parseISO, format } from 'date-fns';
import AlertModal from "../messagesModal";


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
    const { errorlogs } = useSelector(state => state.errorlogs);
    const [allErrorLogs, setAllErrorLogs] = useState(errorlogs);

    const { user, profile } = useContext(AuthContext);

    const [use, setUse] = useState(null);
    const users = Array.from(new Set(errorlogs.map(u => u.user)));

    // Transforma a variável years em um array JSON
    const usersExists = Object.values({ ...users }).reduce((acc, u) => {
        // Verifica se o usuário já está no acumulador com base no id
        if (!acc.some(user => user.id === u?.id)) {
            acc.push({
                id: u?.id,
                name: u?.name,
            });
        }
        return acc;
    }, []);


    const changeUser = ({ target }) => {
        setUse(target.value)
    }



    useEffect(() => {
        dispatch(getAllErrorLogs());
    }, []);

    useEffect(() => {
        setAllErrorLogs(errorlogs);
    }, [errorlogs]);

    useEffect(() => {
        setAllErrorLogs(use ? errorlogs.filter(log => log.user?.id === use) : errorlogs);
    }, [use, errorlogs]);



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
        <BaseCard title={`Você possui ${allErrorLogs.length} Logs de erro Cadastrados`}>
            <AlertModal />

            <Box sx={{
                '& > :not(style)': { mb: 0, mt: 2 },
                'display': 'flex',
                'justify-content': 'space-between'
            }}
            >
                <Select
                    label="Usuario"
                    name="user"
                    value={use}
                    store={usersExists}
                    changeItem={changeUser}
                    wd={"60%"}
                />

            </Box>

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
                                    ID / Usuário / Data
                                </Typography>
                            </TableCell>
                            <TableCell>
                                <Typography color="textSecondary" variant="h6">
                                    Tipo / Arquivo - Linha
                                </Typography>
                            </TableCell>

                            <TableCell>
                                <Typography color="textSecondary" variant="h6">
                                    Mensagem / Contexto
                                </Typography>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    {allErrorLogs.length >= 1 ?
                        <TableBody>
                            {allErrorLogs
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((errorlog, index) => (
                                    <StyledTableRow key={errorlog.id} hover>
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
                                                                fontSize: "12px",
                                                            }}
                                                        >
                                                            {errorlog && errorlog.id}
                                                        </Typography>
                                                        <Typography
                                                            variant="h6"
                                                            sx={{
                                                                fontSize: "12px",
                                                            }}
                                                        >
                                                            {errorlog && errorlog.user?.name}
                                                        </Typography>
                                                        <Typography
                                                            color="textSecondary"
                                                            sx={{
                                                                fontSize: "13px",
                                                            }}
                                                        >
                                                            {errorlog.created_at && format(parseISO(errorlog.created_at), 'dd/MM/yyyy HH:mm:ss')}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            </TableCell>

                                            <TableCell>
                                                <Box
                                                    sx={{
                                                        display: "flex",
                                                        alignItems: "left"
                                                    }}
                                                >
                                                    <Box>
                                                        <Typography
                                                            variant="h6"
                                                        >
                                                            {errorlog && errorlog.type.split('\\').pop()}
                                                        </Typography>
                                                        <Typography
                                                            color="textSecondary"
                                                            sx={{
                                                                fontSize: "12px",
                                                            }}
                                                        >
                                                            {errorlog && errorlog.file.split('/').pop()} linha / {errorlog && errorlog.line}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            </TableCell>

                                            <TableCell>
                                                <Box
                                                    sx={{
                                                        display: "flex",
                                                        alignItems: "left"
                                                    }}
                                                >
                                                    <Box>
                                                        <Typography
                                                            variant="h6"
                                                        >
                                                            {errorlog && errorlog.message}
                                                        </Typography>
                                                        <Typography
                                                            color="textSecondary"
                                                            sx={{
                                                                fontSize: "12px",
                                                            }}
                                                        >
                                                            {errorlog && JSON.stringify(errorlog.context)}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            </TableCell>

                                            {/* <TableCell align="center">
                                                <Box sx={{ "& button": { mx: 1 } }}>

                                                    <Button title="Visualizar Ofício" onClick={() => { HandleViewLetter(errorlog) }} color="success" size="medium" variant="contained">
                                                        <FeatherIcon icon="eye" width="20" height="20" />
                                                    </Button>

                                                    <Button title="Editar Ofício" onClick={() => { HandleEditLetter(errorlog) }} color="primary" size="medium" variant="contained"
                                                        disabled={profile != "admin" && errorlog.id_user != user}>
                                                        <FeatherIcon icon="edit" width="20" height="20" />
                                                    </Button>

                                                    <Button title="Excluir Ofício" onClick={() => { HandleInactiveLetter(errorlog) }} color="error" size="medium" variant="contained"
                                                        disabled={errorlog.id_user == user || profile == "admin" ? allErrorLogs.length - index !== allErrorLogs.length : true}>
                                                        <FeatherIcon icon="trash" width="20" height="20" />
                                                    </Button>

                                                </Box>
                                            </TableCell> */}
                                        </>

                                    </StyledTableRow>
                                ))}
                        </TableBody>

                        :

                        <TableCell align="center">
                            Nenhum registro encontrado!

                        </TableCell>

                    }

                </Table>
                <TablePagination
                    component="div"
                    count={allErrorLogs.length}
                    page={page}
                    onPageChange={handleChangePage}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </TableContainer>

        </BaseCard >
    );
};
