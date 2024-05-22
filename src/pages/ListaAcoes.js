import React, { useState, useEffect } from "react";
import { MaterialReactTable, useMaterialReactTable } from "material-react-table";
import { Backdrop, Box, Button, CircularProgress, IconButton, Tooltip } from "@mui/material";
import { MRT_Localization_PT_BR } from "material-react-table/locales/pt-BR";
import Star from "@mui/icons-material/Star";
import StarBorder from "@mui/icons-material/StarBorder";
import Download from "@mui/icons-material/Download";
import Save from "@mui/icons-material/Save";
import { mkConfig, generateCsv, download } from 'export-to-csv';
import { darken } from "@mui/material";
import StockService from "../services/stock.service";
import AuthService from "../services/auth.service";
import UserLayoutService from "../services/userLayout.service";

const columns = [
  { id: "ticker", accessorKey: "ticker", header: "Ticker", size: 120, filterVariant: 'autocomplete', enableColumnActions: false },
  { accessorKey: "companyname", header: "Nome", size: 120, filterVariant: 'autocomplete', enableColumnActions: false },
  { accessorKey: "sectorname", header: "Setor", size: 120, filterVariant: 'autocomplete', enableColumnActions: false },
  { accessorKey: "subsectorname", header: "Subsetor", size: 120, filterVariant: 'autocomplete', enableColumnActions: false },
  { accessorKey: "segmentname", header: "Segmento", size: 120, filterVariant: 'autocomplete', enableColumnActions: false },
  {
    accessorKey: "price",
    header: "Preço",
    size: 120,
    filterVariant: 'range',
    enableColumnActions: false,
    Cell: ({ cell }) =>
      cell.getValue()?.toLocaleString?.("pt-BR", {
        style: "currency",
        currency: "BRL"
      }),
  },
  { accessorKey: "roe", header: "Roe", size: 120, filterVariant: 'range', enableColumnActions: false },
  { accessorKey: "roa", header: "ROA", size: 120, filterVariant: 'range', enableColumnActions: false },
  { accessorKey: "roic", header: "ROIC", size: 120, filterVariant: 'range', enableColumnActions: false },
  { accessorKey: "dy", header: "DY", size: 100, filterVariant: 'range', enableColumnActions: false },
  { accessorKey: "p_vp", header: "PVP", size: 120, filterVariant: 'range', enableColumnActions: false },
  { accessorKey: "vpa", header: "VPA", size: 120, filterVariant: 'range', enableColumnActions: false },
  { accessorKey: "lpa", header: "LPA", size: 120, filterVariant: 'range', enableColumnActions: false },
  { accessorKey: "p_l", header: "PL", size: 120, filterVariant: 'range', enableColumnActions: false },
  { accessorKey: "p_ebit", header: "P/EBIT", size: 100, filterVariant: 'range', enableColumnActions: false },
  { accessorKey: "p_ativo", header: "P/Ativo", size: 120, filterVariant: 'range', enableColumnActions: false },
  { accessorKey: "ev_ebit", header: "EV/EBIT", size: 120, filterVariant: 'range', enableColumnActions: false },
  { accessorKey: "margembruta", header: "Margem Bruta", size: 120, filterVariant: 'range', enableColumnActions: false },
  { accessorKey: "margemebit", header: "Margem Ebit", size: 120, filterVariant: 'range', enableColumnActions: false },
  { accessorKey: "margemliquida", header: "Margem Líquida", size: 120, filterVariant: 'range', enableColumnActions: false },
  { accessorKey: "p_capitalgiro", header: "Capital de giro", size: 100, filterVariant: 'range', enableColumnActions: false },
  { accessorKey: "p_ativocirculante", header: "Ativo circulante", size: 120, filterVariant: 'range', enableColumnActions: false },
  { accessorKey: "giroativos", header: "Giro de ativo", size: 120, filterVariant: 'range', enableColumnActions: false },
  { accessorKey: "dividaliquidapatrimonioliquido", header: "Dívida líquida/patrimônio líquido", size: 120, filterVariant: 'range', enableColumnActions: false },
  { accessorKey: "dividaliquidaebit", header: "Dívida líquida/EBITDA", size: 100, filterVariant: 'range', enableColumnActions: false },
  { accessorKey: "pl_ativo", header: "PL/Ativo", size: 120, filterVariant: 'range', enableColumnActions: false },
  { accessorKey: "passivo_ativo", header: "Ativo/Passivo", size: 120, filterVariant: 'range', enableColumnActions: false },
  { accessorKey: "liquidezcorrente", header: "Liquidez Corrente", size: 120, filterVariant: 'range', enableColumnActions: false },
  { accessorKey: "peg_ratio", header: "PEG ratio", size: 120, filterVariant: 'range', enableColumnActions: false },
  { accessorKey: "receitas_cagr5", header: "CAGR Receitas 5 anos", size: 120, filterVariant: 'range', enableColumnActions: false },
  { accessorKey: "valormercado", header: "Valor Mercado", size: 100, filterVariant: 'range', enableColumnActions: false },
  { accessorKey: "graham_formula", header: "Formula Grham", size: 150, filterVariant: 'range', enableColumnActions: false },
  {
    accessorKey: "discount_to_graham",
    header: "Desconto Formula Grham",
    size: 130,
    filterVariant: 'range',
    enableColumnActions: false,
    Cell: ({ cell }) => (
      <Box
        component="span"
        sx={(theme) => ({
          backgroundColor:
            cell.getValue() < 0
              ? theme.palette.success.light
              : cell.getValue() >= 0 && cell.getValue() < 30
                ? theme.palette.warning.light
                : theme.palette.error.light,
          borderRadius: "0.25rem",
          color: "#fff",
          maxWidth: "9ch",
          p: "0.25rem",
        })}
      >
        {cell.getValue()?.toLocaleString?.("pt-BR")}
      </Box>
    ),
  },
];

const defaultColumnState = [
  { id: "ticker", width: 120, sort: "asc" },
  { accessorKey: "price", width: 120 },
  { accessorKey: "roe", width: 120 },
  { accessorKey: "dy", width: 100 },
  { accessorKey: "p_vp", width: 120 },
  { accessorKey: "p_l", width: 120 },
  { accessorKey: "graham_formula", width: 150 },
  { accessorKey: "discount_to_graham", width: 130 }
];

const csvConfig = mkConfig({
  fieldSeparator: ";",
  quoteStrings: '"',
  decimalSeparator: ",",
  showLabels: true,
  useBom: true,
  useKeysAsHeaders: true,
});

function ListaAcoes() {
  const [lista, setLista] = useState([]);
  const [loading, setLoading] = React.useState(false);
  const isAdmin = AuthService.isAdmin();

  const handleExportData = () => {
    const csv = generateCsv(csvConfig)(lista);
    download(csvConfig)(csv);
  };

  const handleFavoritar = async (favorita, ticker) => {
    setLoading(true);

    try {
      if (favorita) {
        await StockService.removeFavorite(ticker);
      } else {
        await StockService.addFavorite(ticker);
      }

      setLista(prevLista =>
        prevLista.map(item =>
          item.ticker === ticker ? { ...item, favorita: !favorita } : item
        )
      );

      setLoading(false);
    } catch (error) {
      console.log(error);

      setLoading(false);
    }
  };

  const handleUpdateStocks = async () => {
    setLoading(true);

    try {
      await StockService.updateStocks();
      setLoading(false);
      
      const updatedStocks = await StockService.getAllStocks();
      setLista(updatedStocks);
    } catch (error) {
      console.error("Error updating stocks:", error);
      setLoading(false);
    }
  };

  const handleSaveLayout = async (state) => {
    setLoading(true);

    try {
      await UserLayoutService.saveLayout("ListaAcoes", state);
      
      setLoading(false);
    } catch (error) {
      console.error('Erro ao salvar o layout:', error);
      setLoading(false);
    }
  };

  const saveColumnStateToSessionStorage = () => {
    let state = table.getState();

    console.log(state)

    const tableState = {};

    if (Object.keys(state.columnVisibility).length > 0) {
      tableState.columnVisibility = state.columnVisibility;
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
      sessionStorage.setItem('stateListaAcoes', JSON.stringify(tableState));
      handleSaveLayout(JSON.stringify(tableState));
    }
  };

  const table = useMaterialReactTable({
    columns,
    data: lista,
    enableColumnFilterModes: true,
    enableColumnOrdering: false,
    enableColumnResizing: true,
    enableRowActions: true,
    columnFilterDisplayMode: 'popover',
    layoutMode: 'grid',
    displayColumnDefOptions:{
      'mrt-row-actions': {
        size: 40,
        grow: false,
      },
    },
      initialState: JSON.parse(sessionStorage.getItem('stateListaAcoes')) || {
        density: 'compact',
        pagination: { 
            pageSize: 15 
        },
        defaultColumnState,
        columnVisibility: { 
          vpa: false,
          lpa: false,
          companyname: false,
          p_ebit: false,
          p_ativo: false,
          ev_ebit: false,
          margembruta: false,
          margemebit: false,
          margemliquida: false,
          p_capitalgiro: false,
          p_ativocirculante: false,
          giroativos: false,
          dividaliquidapatrimonioliquido: false,
          dividaliquidaebit: false,
          pl_ativo: false,
          passivo_ativo: false,
          liquidezcorrente: false,
          peg_ratio: false,
          receitas_cagr5: false,
          valormercado: false,
          subsectorname: false,
          segmentname: false,
          sectorname: false,
          graham_formula: false,
        }      
    },  
    renderRowActions:({ row }) => (
      <Box sx={{ display: "flex", flexWrap: "nowrap", gap: "8px" }}>
        <IconButton
          color="secondary"

          onClick={() => {
            handleFavoritar(row.original.favorita, row.original.ticker);
          }}
        >
          {row.original.favorita ? <Tooltip title="Remover favorita"><Star /></Tooltip> : <Tooltip title="Adicionar favorita"><StarBorder /></Tooltip>}
        </IconButton>
      </Box>
    ),
    localization:MRT_Localization_PT_BR,
    renderTopToolbarCustomActions:() => (
      <Box
        sx={{ display: "flex", gap: "1rem", p: "0.5rem", flexWrap: "wrap" }}
      >
        <Button
          color="primary"
          onClick={handleExportData}
          startIcon={<Download />}
          variant="contained"
        >
          Exportar
        </Button>
        <Button
          color="primary"
          onClick={saveColumnStateToSessionStorage}
          startIcon={<Save />}
          variant="contained"
        >
          Salvar layout
        </Button>
        {isAdmin && (
          <Button
            color="secondary"
            onClick={handleUpdateStocks}
            variant="contained"
          >
            Atualizar Ações
          </Button>
        )}
      </Box>
    ),
    muiTablePaperProps:{
      elevation: 0,
      sx: {
        borderRadius: "0",
      },
    },
    muiTableBodyProps:{
      sx: (theme) => ({
        "& tr:nth-of-type(odd)": {
          backgroundColor: darken(theme.palette.background.default, 0.1),
        },
      }),
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await StockService.getAllStocks();
        setLista(data);

        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="secondary" />
      </Backdrop>

      <MaterialReactTable table={table} />

    </div>
  );
}

export default ListaAcoes;
