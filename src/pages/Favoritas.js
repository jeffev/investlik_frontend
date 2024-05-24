import React, { useState, useEffect } from "react";
import { MaterialReactTable, useMaterialReactTable } from "material-react-table";
import { Button, Snackbar, Typography, IconButton, Tooltip } from "@mui/material";
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
        try {
            await StockService.editFavorite(newRow.row.original.id, newRow.row._valuesCache);
            
            const index = favoritas.findIndex((fav) => fav.id === newRow.row.original.id);
            if (index >= 0) {
                const updatedFavoritas = [...favoritas];
                updatedFavoritas[index] = newRow.row._valuesCache;
                setFavoritas(updatedFavoritas);
            }
            
            table.setEditingRow(null);
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
        { accessorKey: "id", header: "ID", size: 80, enableEditing: false, Edit: () => null, enableHiding: false },
        { accessorKey: "stock_ticker", header: "Ticker", size: 80, enableEditing: false },
        {
            accessorKey: "ceiling_price",
            header: "Preço Teto",
            size: 100,
            enableEditing: true,
            filterVariant: 'range'
        },
        {
            accessorKey: "target_price",
            header: "Preço Alvo",
            size: 100,
            enableEditing: true,
            filterVariant: 'range'
        },
        {
            accessorKey: "remove",
            header: "Remover",
            size: 120,
            enableEditing: false,
            Edit: () => null,
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
        enableColumnFilterModes: true,
        enableColumnOrdering: true,
        enableColumnResizing: true,
        columnFilterDisplayMode: 'popover',
        layoutMode: 'grid',
        displayColumnDefOptions:{
                'mrt-row-actions': {
                size: 40,
                grow: false,
            },
        },
        editDisplayMode:'modal',
        localization: MRT_Localization_PT_BR,
        onEditingRowCancel: () => setValidationErrors({}),
        onEditingRowSave: handleEditFavorite,    
        initialState: {
            pagination: { pageSize: 5 },
            density: 'compact',
            columnVisibility: { id: false } 
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
        )
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
