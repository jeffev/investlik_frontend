import * as React from 'react';
import { useState } from "react";
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { Divider, Switch } from '@mui/material/'
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import FormControlLabel from '@mui/material/FormControlLabel';
import { ListItemIcon, ListItemText, ListItemButton, List } from '@mui/material/';
import { Link } from "react-router-dom";
import {
  HomeOutlined,
} from "@mui/icons-material";
import authService from '../services/auth.service';
import { useNavigate } from 'react-router-dom';

function BarraNavegacao({ check, change }) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const isUserLoggedIn = !!sessionStorage.getItem('user');

  const handleLogout = () => {
    authService.logout();
    
    navigate('/login');
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={() => setOpen(true)}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Invest Link
          </Typography>
          <FormControlLabel control={<Switch color="secondary" onChange={change} checked={check} />} label="Dark mode" />
          {isUserLoggedIn ? (
            <Button color="secondary" variant="contained" onClick={handleLogout}>
              Logout
            </Button>
          ) : (
            <Button color="secondary" component={Link} to={"/login"} variant="contained">
              Login
            </Button>
          )}
        </Toolbar>
      </AppBar>

      <Drawer open={open} anchor={"left"} onClose={() => setOpen(false)} >
        <div style={{ width: 250 }} color='' onClick={() => setOpen(false)}>
          <List>
            <ListItemButton component={Link} to={"/"}>
              <ListItemIcon><HomeOutlined /></ListItemIcon>
              <ListItemText primary="Invest Link" />
            </ListItemButton>
            <Divider />
            <ListItemButton component={Link} to={"/listaAcoes"}>
              <ListItemIcon><HomeOutlined /></ListItemIcon>
              <ListItemText primary="Lista de ações" />
            </ListItemButton>
            <ListItemButton component={Link} to={"/top10"}>
              <ListItemIcon><HomeOutlined /></ListItemIcon>
              <ListItemText primary="Top 10" />
            </ListItemButton>
            <ListItemButton component={Link} to={"/sentimento"}>
              <ListItemIcon><HomeOutlined /></ListItemIcon>
              <ListItemText primary="Sentimento de mercado" />
            </ListItemButton>
            <Divider />
            <ListItemButton component={Link} to={"/favoritas"}>
              <ListItemIcon><HomeOutlined /></ListItemIcon>
              <ListItemText primary="Favoritas" />
            </ListItemButton>
            <ListItemButton component={Link} to={"/minhaCarteira"}>
              <ListItemIcon><HomeOutlined /></ListItemIcon>
              <ListItemText primary="Minha carteira" />
            </ListItemButton>
            <ListItemButton component={Link} to={"/minhasOpcoes"}>
              <ListItemIcon><HomeOutlined /></ListItemIcon>
              <ListItemText primary="Minhas opções" />
            </ListItemButton>
          </List>
        </div>
      </Drawer>
    </Box>
  );
}

export default BarraNavegacao;