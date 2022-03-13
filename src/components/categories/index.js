import React, {useState, useEffect} from "react";
import {
    Typography,
    Box,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow
} from "@mui/material";
import BaseCard from "../baseCard/BaseCard";

export default () => {


    const [loading, setLoading] = useState(true);
    const [categories, setCategories] = useState([{
        "full_name": "nenhum resultado encontrado",
        "id": "0"
    }]);

    useEffect(()=>{
        getList();
    }, []);

    const getList = () =>{
        setLoading(true);
        const result = [{}]
        setLoading(false);
        
        if(result.length >= 0){
            setCategories(result);
        }
    }


    return (
        <BaseCard title="Categorias">
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
                                Id
                            </Typography>
                        </TableCell>
                        <TableCell>
                            <Typography color="textSecondary" variant="h6">
                                Name
                            </Typography>
                        </TableCell>
                        <TableCell  align="right">
                            <Typography color="textSecondary" variant="h6">
                                Status
                            </Typography>
                        </TableCell>                       
                    </TableRow>
                </TableHead>
                <TableBody>
                    {categories.map((categorie) => (
                        <TableRow key={categorie.id}>
                            <TableCell>
                                <Typography variant="h6">
                                    {categorie.id}
                                </Typography>
                            </TableCell>

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
                                        <Typography
                                            color="textSecondary"
                                            sx={{
                                                fontSize: "13px",
                                            }}
                                        >
                                            {categorie.name}
                                        </Typography>
                                    </Box>
                                </Box>
                            </TableCell>


                            <TableCell align="right">
                                <Typography color="textSecondary" variant="h6">
                                    {categorie.active}
                                </Typography>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </BaseCard>
    );
};
