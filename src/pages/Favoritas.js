import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { TextField, Typography } from "@mui/material";
import StockService from "../services/stock.service";
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";


const Favoritas = () => {
    const [favoritas, setFavoritas] = useState([]);
    const [snackbar, setSnackbar] = React.useState(null);

    const handleCloseSnackbar = () => setSnackbar(null);

    const handleRemoveFavorite = async (stock_ticker) => {
        await StockService.removeFavorite(stock_ticker);
        setFavoritas(favoritas.filter((fav) => fav.stock_ticker !== stock_ticker));
    };

    const handleEditFavorite = React.useCallback(
        async (newRow) => {
            await StockService.editFavorite(newRow.id, newRow);
            const updatedFavoritas = favoritas.map((fav) =>
                fav.id === newRow.id ? newRow : fav
            );
            setFavoritas(updatedFavoritas);
            setSnackbar({ children: 'Favorita editada com sucesso!', severity: 'success' });
            return { id: newRow.id };
        },
        []
    );

    const handleProcessRowUpdateError = React.useCallback((error) => {
        setSnackbar({ children: error.message, severity: 'error' });
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await StockService.getFavorites();
                setFavoritas(data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchData();
    }, []);

    const columns = [
        { field: "id", headerName: "ID", hide: true },
        { field: "stock_ticker", headerName: "Ticker", width: 80 },
        {
            field: "ceiling_price",
            headerName: "Preço Teto",
            width: 100,
            editable: true,
            renderCell: (params) => (
                <TextField
                    type="number"
                    variant="standard"
                    size="small"
                    value={params.value ? params.value.toFixed(2) : ""}
                    InputProps={{
                        inputProps: {
                            step: 0.01,
                        },
                    }}
                />
            ),
        },
        {
            field: "target_price",
            headerName: "Preço Alvo",
            width: 100,
            editable: true,
            renderCell: (params) => (
                <TextField
                    type="number"
                    variant="standard"
                    size="small"
                    value={params.value ? params.value.toFixed(2) : ""}
                    InputProps={{
                        inputProps: {
                            step: 0.01,
                        },
                    }}
                />
            ),
        },
        {
            field: "remove",
            headerName: "Remover",
            width: 120,
            renderCell: (params) => (
                <IconButton
                    color="secondary"
                    onClick={() => handleRemoveFavorite(params.row.stock_ticker)}
                >
                    <DeleteIcon />
                </IconButton>
            ),
        },
    ];

    return (
        <div style={{ height: 400, width: "100%" }}>
            {favoritas.length === 0 ? (
                <Typography variant="h6">Nenhuma ação favorita encontrada</Typography>
            ) : (
                <DataGrid rows={favoritas}
                    columns={columns}
                    pageSize={5}
                    processRowUpdate={handleEditFavorite}
                    onProcessRowUpdateError={handleProcessRowUpdateError}
                    columnVisibilityModel={{
                        id: false,
                    }}
                />
            )}
            {!!snackbar && (
                <Snackbar
                    open
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                    onClose={handleCloseSnackbar}
                    autoHideDuration={6000}
                >
                    <Alert {...snackbar} onClose={handleCloseSnackbar} />
                </Snackbar>
            )}
        </div>
    );
};

export default Favoritas;