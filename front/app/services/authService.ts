import { LoginRequest, LoginResponse } from "../types/auth";
import api from "./api";

export async function loginService(login:LoginRequest) : Promise<LoginResponse> {

       const loginResult = await api.post<LoginResponse>('/auth/login',
                login);

        return loginResult.data;
    
}
