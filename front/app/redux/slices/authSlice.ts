import { AuthState } from "@/app/types/auth";
import { Usuario } from "@/app/types/usuarios";
import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import Cookies from "js-cookie";

const usuarioRecover = Cookies.get('usuario');
const tokenRecover = Cookies.get('token');

function recuperarUsuario(): Usuario | null {
    if (!usuarioRecover) {
        return null;
    }

    try {
        return JSON.parse(usuarioRecover) as Usuario;
    } catch {
        Cookies.remove('usuario');
        return null;
    }
}

const cookieOptions: Cookies.CookieAttributes = {
    expires: 7,
    sameSite: "lax",
    secure: typeof window !== "undefined" && window.location.protocol === "https:"
};

const initialState : AuthState = {
    usuario: recuperarUsuario(),
    token: tokenRecover ?? ""
}

const authSlice = createSlice({
        name:'auth',
        initialState,
        reducers:{
            setToken : (state, action: PayloadAction<{ token: string}>) => {

                state.token = action.payload.token;
                Cookies.set('token', action.payload.token, cookieOptions);


            },
            setUsuario : (state, action: PayloadAction<{usuario: Usuario}>) => {

                state.usuario = action.payload.usuario;
                Cookies.set('usuario', JSON.stringify(action.payload.usuario), cookieOptions);
              

            },
            logout : (state) => {

                state.token ="";
                state.usuario = null;
                Cookies.remove('usuario');
                Cookies.remove('token');
            }
        }
    });

    export const { setToken,setUsuario, logout } = authSlice.actions;
    export default authSlice.reducer;
