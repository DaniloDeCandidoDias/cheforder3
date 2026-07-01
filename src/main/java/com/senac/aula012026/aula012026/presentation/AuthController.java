package com.senac.aula012026.aula012026.presentation;


import com.senac.aula012026.aula012026.application.DTO.LoginRequest;
import com.senac.aula012026.aula012026.application.DTO.LoginResponse;
import com.senac.aula012026.aula012026.application.services.TokenService;
import com.senac.aula012026.aula012026.application.services.UsuarioService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@Tag(description = "Servico responsavel por controlar a autenticacao do ChefOrder!",name = "Servico autenticacao")
public class AuthController {

    @Autowired
    private TokenService tokenService;

    @Autowired
    private UsuarioService usuarioService;

    @PostMapping("/login")
    @Operation(description = "Valida email e senha do operador do restaurante.",summary = "Login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest){


        if(usuarioService.ValidaUsuarioSenha(loginRequest)){

            var token = tokenService.gerarToken(loginRequest.email());

            return ResponseEntity.ok(new LoginResponse(token));
        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }


}
