import React, { useState, useEffect, useCallback } from "react";
import { MaterialReactTable, useMaterialReactTable } from "material-react-table";
import { Box, Button, Snackbar, TextField, Typography, IconButton, Tooltip } from "@mui/material";
import { MRT_Localization_PT_BR } from "material-react-table/locales/pt-BR";
import DeleteIcon from "@mui/icons-material/Delete";
import Save from "@mui/icons-material/Save";
import StockService from "../services/stock.service";
import Alert from '@mui/material/Alert';

const Favoritas = () => {
    const [favoritas, setFavoritas] = useState([]);
    const [snackbar, setSnackbar] = useState(null);
    const handleCloseSnackbar = () => setSnackbar(null);
    const [validationErrors, setValidationErrors] = useState({});

    const handleRemoveFavorite = async (stock_ticker) => {
        try {
            await StockService.removeFavorite(stock_ticker);
            setFavoritas(favoritas.filter((fav) => fav.stock_ticker !== stock_ticker));
            setSnackbar({ children: 'Favorita removida com sucesso!', severity: 'success' });
        } catch (error) {
            setSnackbar({ children: 'Erro ao remover favorita!', severity: 'error' });
        }
    };

    const handleEditFavorite = async (newRow) => {
        console.log(newRow)
        try {
            await StockService.editFavorite(newRow.row.original.id, newRow.row);
            const updatedFavoritas = favoritas.map((fav) =>
                fav.id === newRow.original.id ? newRow.row : fav
            );
            setFavoritas(updatedFavoritas);
            setSnackbar({ children: 'Favorita editada com sucesso!', severity: 'success' });
        } catch (error) {
            setSnackbar({ children: 'Erro ao editar favorita!', severity: 'error' });
        }
    };

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
        { accessorKey: "id", header: "ID", size: 80, enableEditing: false },
        { accessorKey: "stock_ticker", header: "Ticker", size: 80, enableEditing: false },
        {
            accessorKey: "ceiling_price",
            header: "Preço Teto",
            size: 100,
            enableEditing: true
        },
        {
            accessorKey: "target_price",
            header: "Preço Alvo",
            size: 100,
            enableEditing: true
        },
        {
            accessorKey: "remove",
            header: "Remover",
            size: 120,
            enableEditing: false,
            Cell: ({ row }) => (
                <IconButton
                    color="secondary"
                    onClick={() => handleRemoveFavorite(row.original.stock_ticker)}
                >
                    <Tooltip title="Remover favorita">
                        <DeleteIcon />
                    </Tooltip>
                </IconButton>
            ),
        },
    ];

    const table = useMaterialReactTable({
        columns,
        data: favoritas,
        enableEditing: true,
        editDisplayMode:'modal',
        localization: MRT_Localization_PT_BR,
        onEditingRowCancel: () => setValidationErrors({}),
        onEditingRowSave: handleEditFavorite,    
        initialState: {
            pagination: { pageSize: 5 },
            density: 'compact',
        },
        renderTopToolbarCustomActions: () => (
            <Button
                color="primary"
                onClick={() => {
                    // Save layout or other actions
                }}
                startIcon={<Save />}
                variant="contained"
            >
                Salvar Layout
            </Button>
        ),
        muiTableBodyCellProps: ({ cell }) => ({
            onClick: (event) => {
                if (cell.column.id === 'ceiling_price' || cell.column.id === 'target_price') {
                    event.stopPropagation();
                }
            },
        }),
    });

    return (
        <div style={{ height: 400, width: "100%" }}>
            {favoritas.length === 0 ? (
                <Typography variant="h6">Nenhuma ação favorita encontrada</Typography>
            ) : (
                <MaterialReactTable table={table} />
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
