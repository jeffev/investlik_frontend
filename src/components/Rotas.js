import { Routes, Route } from "react-router-dom";
import Home from "./Home";
import Register from "./Register";
import {Outlet, Navigate} from 'react-router-dom';
import authService from "../services/auth.service";
import Login from "./Login.js";

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
                
            </Route>
        </Routes>
    );
}

export default Rotas;