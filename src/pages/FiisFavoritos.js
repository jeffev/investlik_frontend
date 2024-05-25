import React, { useState, useEffect } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import {
  Backdrop,
  Box,
  Button,
  Snackbar,
  CircularProgress,
  IconButton,
  Tooltip,
} from "@mui/material";
import { MRT_Localization_PT_BR } from "material-react-table/locales/pt-BR";
import DeleteIcon from "@mui/icons-material/Delete";
import Save from "@mui/icons-material/Save";
import EditIcon from "@mui/icons-material/Edit";
import FiiService from "../services/fii.service";
import Alert from "@mui/material/Alert";

import UserLayoutService from "../services/userLayout.service";

const FavoritosFiis = () => {
  const [favoritos, setFavoritos] = useState([]);
  const [snackbar, setSnackbar] = useState(null);
  const [loading, setLoading] = React.useState(false);
  const handleCloseSnackbar = () => setSnackbar(null);

  const handleRemoveFavorite = async (ticker) => {
    try {
      setLoading(true);
      await FiiService.removeFavorite(ticker);
      setFavoritos(favoritos.filter((fav) => fav.fii.ticker !== ticker));
      setLoading(false);
      setSnackbar({
        children: "Favorita removida com sucesso!",
        severity: "success",
      });
    } catch (error) {
      setLoading(false);
      setSnackbar({ children: "Erro ao remover favorita!", severity: "error" });
    }
  };

  const handleEditFavorite = async (newRow) => {
    try {
      setLoading(true);
      await FiiService.editFavorite(
        newRow.row.original.id,
        newRow.row._valuesCache
      );

      const updatedFavoritos = favoritos.map((fav) => {
        if (fav.id === newRow.row.original.id) {
          return {
            ...fav,
            ...newRow.row._valuesCache,
          };
        }
        return fav;
      });

      setFavoritos(updatedFavoritos);

      setLoading(false);

      table.setEditingRow(null);
      setSnackbar({
        children: "Favorita editada com sucesso!",
        severity: "success",
      });
    } catch (error) {
      setLoading(false);
      setSnackbar({ children: "Erro ao editar favorita!", severity: "error" });
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await FiiService.getFavorites();
        setFavoritos(data);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const columns = [
    {
      accessorKey: "id",
      header: "ID",
      size: 80,
      enableEditing: false,
      Edit: () => null,
      enableHiding: false,
    },
    {
      accessorKey: "fii.ticker",
      header: "Ticker",
      size: 80,
      enableEditing: false,
    },
    {
      accessorKey: "ceiling_price",
      header: "Preço Teto",
      muiEditTextFieldProps: {
        type: "number",
      },
      size: 100,
      enableEditing: true,
      filterVariant: "range",
      Cell: ({ cell }) => {
        const currentValue = cell.row.original.fii.price;
        const ceilingPrice = cell.row.original.ceiling_price;
        const isAboveCeiling = ceilingPrice && ceilingPrice > currentValue;
        return (
          <Box
            component="span"
            sx={{
              color: isAboveCeiling ? "green" : "inherit",
              fontWeight: isAboveCeiling ? "bold" : "normal",
            }}
          >
            {ceilingPrice?.toLocaleString?.("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}
          </Box>
        );
      },
    },
    {
      accessorKey: "target_price",
      header: "Preço Alvo",
      muiEditTextFieldProps: {
        type: "number",
      },
      size: 100,
      enableEditing: true,
      filterVariant: "range",
      Cell: ({ cell }) => {
        const currentValue = cell.row.original.fii.price;
        const targetPrice = cell.row.original.target_price;
        const isBelowTarget = targetPrice && targetPrice < currentValue;
        return (
          <Box
            component="span"
            sx={{
              color: isBelowTarget ? "green" : "inherit",
              fontWeight: isBelowTarget ? "bold" : "normal",
            }}
          >
            {targetPrice?.toLocaleString?.("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}
          </Box>
        );
      },
    },
    {
      accessorKey: "fii.companyname",
      header: "Nome",
      size: 120,
      filterVariant: "autocomplete",
      Edit: () => null,
      enableColumnActions: false,
    },
    {
      accessorKey: "fii.sectorname",
      header: "Setor",
      size: 120,
      filterVariant: "autocomplete",
      Edit: () => null,
      enableColumnActions: false,
    },
    {
      accessorKey: "fii.subsectorname",
      header: "Subsetor",
      size: 120,
      filterVariant: "autocomplete",
      Edit: () => null,
      enableColumnActions: false,
    },
    {
      accessorKey: "fii.segment",
      header: "Segmento",
      size: 120,
      filterVariant: "autocomplete",
      Edit: () => null,
      enableColumnActions: false,
    },
    {
      accessorKey: "fii.price",
      header: "Preço atual",
      size: 120,
      filterVariant: "range",
      enableEditing: false,
      enableColumnActions: false,
      Cell: ({ cell }) =>
        cell.getValue()?.toLocaleString?.("pt-BR", {
          style: "currency",
          currency: "BRL",
        }),
    },
    {
      accessorKey: "fii.dy",
      header: "DY",
      size: 120,
      filterVariant: "range",
      Edit: () => null,
      enableColumnActions: false,
    },
    {
      accessorKey: "fii.p_vp",
      header: "P/VP",
      size: 120,
      filterVariant: "range",
      Edit: () => null,
      enableColumnActions: false,
    },
    {
      accessorKey: "fii.valorpatrimonialcota",
      header: "Valor Patrimonial Cota",
      size: 180,
      filterVariant: "range",
      Edit: () => null,
      enableColumnActions: false,
    },
    {
      accessorKey: "fii.liquidezmediadiaria",
      header: "Liquidez Média Diária",
      size: 180,
      Edit: () => null,
      filterVariant: "range",
      enableColumnActions: false,
    },
    {
      accessorKey: "fii.percentualcaixa",
      header: "% Caixa",
      size: 120,
      filterVariant: "range",
      Edit: () => null,
      enableColumnActions: false,
    },
    {
      accessorKey: "fii.dividend_cagr",
      header: "Dividend CAGR",
      size: 150,
      filterVariant: "range",
      Edit: () => null,
      enableColumnActions: false,
    },
    {
      accessorKey: "fii.cota_cagr",
      header: "Cota CAGR",
      size: 150,
      filterVariant: "range",
      Edit: () => null,
      enableColumnActions: false,
    },
    {
      accessorKey: "fii.numerocotistas",
      header: "Número Cotistas",
      size: 150,
      filterVariant: "range",
      Edit: () => null,
      enableColumnActions: false,
    },
    {
      accessorKey: "fii.numerocotas",
      header: "Número Cotas",
      size: 150,
      filterVariant: "range",
      Edit: () => null,
      enableColumnActions: false,
    },
    {
      accessorKey: "fii.patrimonio",
      header: "Patrimônio",
      size: 120,
      filterVariant: "range",
      Edit: () => null,
      enableColumnActions: false,
    },
    {
      accessorKey: "fii.lastdividend",
      header: "Último Dividendo",
      size: 150,
      filterVariant: "range",
      Edit: () => null,
      enableColumnActions: false,
    },
  ];

  const handleSaveLayout = async (state) => {
    setLoading(true);

    try {
      await UserLayoutService.saveLayout("ListaFavoritosFiis", state);

      setLoading(false);
      setSnackbar({
        children: "Layout salvo com sucesso!",
        severity: "success",
      });
    } catch (error) {
      console.error("Erro ao salvar o layout:", error);
      setLoading(false);
      setSnackbar({ children: "Erro ao salvar layout!", severity: "error" });
    }
  };

  const saveColumnStateToSessionStorage = () => {
    let state = table.getState();

    const tableState = {};

    if (Object.keys(state.columnVisibility).length > 0) {
      tableState.columnVisibility = state.columnVisibility;
    }
    if (Object.keys(state.columnOrder).length > 0) {
      tableState.columnOrder = state.columnOrder;
    }
    if (Object.keys(state.columnSizing).length > 0) {
      tableState.columnSizing = state.columnSizing;
    }
    if (state.pagination !== undefined && state.pagination !== null) {
      tableState.pagination = state.pagination;
    }
    if (state.density !== undefined && state.density !== null) {
      tableState.density = state.density;
    }

    if (Object.keys(tableState).length > 0) {
      sessionStorage.setItem(
        "stateListaFavoritosFiis",
        JSON.stringify(tableState)
      );
      handleSaveLayout(JSON.stringify(tableState));
    }
  };

  const table = useMaterialReactTable({
    columns,
    data: favoritos,
    enableEditing: true,
    enableColumnFilterModes: true,
    enableColumnOrdering: true,
    enableColumnResizing: true,
    columnFilterDisplayMode: "popover",
    layoutMode: "grid",
    displayColumnDefOptions: {
      "mrt-row-actions": {
        size: 90,
        grow: false,
      },
    },
    renderRowActions: ({ row, table }) => (
      <Box sx={{ display: "flex", gap: "1rem" }}>
        <Tooltip title="Edit">
          <IconButton onClick={() => table.setEditingRow(row)}>
            <EditIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Delete">
          <IconButton
            color="error"
            onClick={() => handleRemoveFavorite(row.original.fii.ticker)}
          >
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </Box>
    ),
    renderTopToolbarCustomActions: () => (
      <Button
        color="primary"
        onClick={saveColumnStateToSessionStorage}
        startIcon={<Save />}
        variant="contained"
      >
        Salvar Layout
      </Button>
    ),
    editDisplayMode: "modal",
    localization: MRT_Localization_PT_BR,
    onEditingRowSave: handleEditFavorite,
    initialState: JSON.parse(
      sessionStorage.getItem("stateListaFavoritosFiis")
    ) || {
      pagination: { pageSize: 15 },
      density: "compact",
      columnVisibility: {
        id: false,
        "fii.companyname": false,
        "fii.sectorname": false,
        "fii.subsectorname": false,
        "fii.segment": false,
        "fii.gestao": false,
        "fii.valorpatrimonialcota": false,
        "fii.liquidezmediadiaria": false,
        "fii.percentualcaixa": false,
        "fii.dividend_cagr": false,
        "fii.cota_cagr": false,
        "fii.numerocotistas": false,
        "fii.numerocotas": false,
        "fii.patrimonio": false,
        "fii.lastdividend": false,
      },
    },
  });

  return (
    <>
      <MaterialReactTable table={table} />
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <Snackbar
        open={snackbar !== null}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar?.severity}>
          {snackbar?.children}
        </Alert>
      </Snackbar>
    </>
  );
};

export default FavoritosFiis;
