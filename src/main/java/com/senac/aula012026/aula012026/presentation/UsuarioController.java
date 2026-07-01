package com.senac.aula012026.aula012026.presentation;


import com.senac.aula012026.aula012026.application.DTO.AlterarStatusRequest;
import com.senac.aula012026.aula012026.application.DTO.UsuarioAdmRequest;
import com.senac.aula012026.aula012026.application.DTO.UsuarioRequest;
import com.senac.aula012026.aula012026.application.DTO.UsuarioResponse;
import com.senac.aula012026.aula012026.application.services.UsuarioService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/usuarios")
@Tag(name = "Funcionarios controller",description = "Controladora responsavel por gerenciar os funcionarios!")
public class UsuarioController {

    @Autowired
    private UsuarioService usuarioService;


    @GetMapping
    @Operation(summary = "Listar todos",description = "Metodo para listar todos os funcionarios!")
    public ResponseEntity<List<UsuarioResponse>> listarTodos(){

        var usuarios = usuarioService.ListarTodos();

        return ResponseEntity.ok(usuarios);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Consulta de funcionario por ID", description = "Metodo responsavel por consultar um unico funcionario por ID e se nao existir retorna null!")
    public ResponseEntity<UsuarioResponse> buscarPorId(@PathVariable Long id){
        return ResponseEntity.ok(usuarioService.BuscarUsuarioPorId(id));
    }

    @PostMapping
    @Operation(summary = "Criar funcionario",description = "Metodo resposavel por criar funcionario")
    public ResponseEntity<Long> salvar (@RequestBody UsuarioRequest usuario){

        return ResponseEntity.ok(usuarioService.SalvarUsuario(usuario));
    }

    @PostMapping("/adm")
    @Operation(summary = "Criar restaurante",description = "Metodo resposavel por criar o restaurante administrador")
    public ResponseEntity<Long> salvarAdm (@RequestBody UsuarioAdmRequest usuario){

        return ResponseEntity.ok(usuarioService.SalvarUsuarioAdm(usuario));
    }


    @PutMapping("/{id}")
    @Operation(summary = "Atualizar funcionario",description = "Metodo resposavel por atualizar funcionario")
    public ResponseEntity<?> alterarUsuario (@PathVariable Long id, @RequestBody UsuarioRequest usuario){

        var alterarUsuarioResult = usuarioService.AterarUsuario(id,usuario);
        return alterarUsuarioResult ? ResponseEntity.ok("Atualizado com sucesso!") : ResponseEntity.notFound().build();
    }

    @PutMapping("/{id}/AlterarStatus")
    public ResponseEntity<?> AlterarStatus(@PathVariable Long id, @RequestBody AlterarStatusRequest statusRequest){

        boolean alterarStatusResult = usuarioService.AlterarStatus(id,statusRequest);
        return alterarStatusResult ? ResponseEntity.ok("Atualizado com sucesso!") : ResponseEntity.notFound().build();

    }

    @GetMapping("/usuariologado")
    @Operation(summary = "Consulta usuario logado",description = "busca operador da sessao")
    public ResponseEntity<UsuarioResponse> buscarUsarioLogado(Authentication authentication){

        return ResponseEntity.ok(usuarioService.BuscarUsuarioLogado(authentication));
    }


}
