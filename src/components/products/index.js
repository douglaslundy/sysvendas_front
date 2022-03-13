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
    const [products, setProducts] = useState([{
        "name": "nenhum resultado encontrado",
        "id": "0"
    }]);

    useEffect(()=>{
        getList();
    }, []);

    const getList = async () =>{
        setLoading(true);
        const result = [{}]
        setLoading(false);        
        if(result.length >= 0){
            setProducts(result);
        }
    }


    return (
        <BaseCard title="Produtos">
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
                                Nome
                            </Typography>
                        </TableCell>
                        <TableCell>
                            <Typography color="textSecondary" variant="h6">
                                Valor
                            </Typography>
                        </TableCell>
                        <TableCell>
                            <Typography color="textSecondary" variant="h6">
                                Estoque
                            </Typography>
                        </TableCell>
                        <TableCell  align="right">
                            <Typography color="textSecondary" variant="h6">
                                Código
                            </Typography>
                        </TableCell>                       
                    </TableRow>
                </TableHead>
                <TableBody>
                    {products.map((product) => (
                        <TableRow key={product.id}>

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
                                            {product.name}
                                        </Typography>
                                        <Typography
                                            color="textSecondary"
                                            sx={{
                                                fontSize: "13px",
                                            }}
                                        >
                                            {/* {product.id_category} */} Alimentícios
                                        </Typography>
                                    </Box>
                                </Box>
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
                                            {product.sale_value}
                                        </Typography>
                                        <Typography
                                            color="textSecondary"
                                            sx={{
                                                fontSize: "13px",
                                            }}
                                        >
                                            {product.cost_value}
                                        </Typography>
                                    </Box>
                                </Box>
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
                                            {product.stock}
                                        </Typography>
                                        <Typography
                                            color="textSecondary"
                                            sx={{
                                                fontSize: "13px",
                                            }}
                                        >
                                            {/* {product.id_unity} */}KG
                                        </Typography>
                                    </Box>
                                </Box>
                            </TableCell>

                            <TableCell align="right">
                                <Typography variant="h6">
                                    {product.bar_code}
                                </Typography>
                            </TableCell>
                            
                            
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </BaseCard>
    );
};
