import React from "react";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Logo from "../assets/LOGO.png";
import Container from "@mui/material/Container";
import CircularProgress from "@mui/material/CircularProgress";
import authService from "../services/auth.service";
import { useNavigate } from "react-router-dom";
import { Alert, Backdrop } from "@mui/material";

export default function Login() {
  const [error, setError] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const login = data.get("login");
    const password = data.get("password");
    setLoading(true);

    try {
      const response = await authService.login(login, password);

      if (response.status === 200) {
        setError("");

        setLoading(false);
        navigate("/home");
      } else {
        setError("Usuário ou senha inválidos");
        setLoading(false);
      }
    } catch (e) {
      console.log(e);
      setError("Error!!!");
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="secondary" />
      </Backdrop>
      <Box
        sx={{
          marginTop: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <img src={Logo} style={{ width: "170px", height: "170px" }} />

        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="login"
            label="Usuário"
            name="login"
            autoComplete="login"
            autoFocus
            error={error}
            variant="standard"
          />
          <TextField
            margin="normal"
            required
            fullWidth
            error={error}
            name="password"
            label="Senha"
            type="password"
            id="password"
            variant="standard"
            autoComplete="current-password"
          />
          <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Remember me"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            color="secondary"
          >
            Entrar
          </Button>
          {error && <Alert severity="error">{error}</Alert>}
          <Grid container>
            <Grid item xs>
              <Link href="#" variant="body2" color="secondary">
                Esqueceu a senha?
              </Link>
            </Grid>
            <Grid item>
              <Link href="/registrar" variant="body2" color="secondary">
                {"Não tem uma conta? Criar"}
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>

      <Box sx={{ mt: 20, mb: 4 }} />
    </Container>
  );
}