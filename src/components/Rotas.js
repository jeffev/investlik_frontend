import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home.js";
import Register from "../pages/Register.js";
import {Outlet, Navigate} from 'react-router-dom';
import authService from "../services/auth.service";
import Login from "../pages/Login.js";
import ListaAcoes from "../pages/ListaAcoes.js";

export const PrivateRoute = () => {
    const isAuthenticated = authService.isAuthenticated();

    return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
}

function Rotas() {
    return (
        <Routes>
            <Route path="/login" Component={Login} />
            <Route path="/registrar" Component={Register} />

            <Route path='/' element={<PrivateRoute/>}>
                <Route exact path="/" Component={Home} />
                <Route path="/home" Component={Home} />
                <Route path="/listaAcoes" Component={ListaAcoes} />
            </Route>
        </Routes>
    );
}

export default Rotas;