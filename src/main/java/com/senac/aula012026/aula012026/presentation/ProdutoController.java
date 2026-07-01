package com.senac.aula012026.aula012026.presentation;

import com.senac.aula012026.aula012026.application.DTO.ProdutoRequest;
import com.senac.aula012026.aula012026.application.DTO.ProdutoResponse;
import com.senac.aula012026.aula012026.application.services.ProdutoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/produtos")
@Tag(name = "Produtos controller",description = "Controladora responsavel por gerenciar o cardapio!")
public class ProdutoController {

    @Autowired
    private ProdutoService produtoService;

    @GetMapping
    @Operation(summary = "Listar todos",description = "Metodo para listar todos os produtos!")
    public ResponseEntity<List<ProdutoResponse>> listarTodos(){

        var produtos = produtoService.ListarTodos();

        return ResponseEntity.ok(produtos);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Consulta de produto por ID", description = "Metodo responsavel por consultar um unico produto por ID e se nao existir retorna null!")
    public ResponseEntity<ProdutoResponse> buscarPorId(@PathVariable Long id){
        return ResponseEntity.ok(produtoService.BuscarProdutoPorId(id));
    }

    @PostMapping
    @Operation(summary = "Criar produto",description = "Metodo resposavel por criar produto")
    public ResponseEntity<Long> salvar (@RequestBody ProdutoRequest produto){

        return ResponseEntity.ok(produtoService.SalvarProduto(produto));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Atualizar produto",description = "Metodo resposavel por atualizar produto")
    public ResponseEntity<?> alterarProduto (@PathVariable Long id, @RequestBody ProdutoRequest produto){

        var alterarProdutoResult = produtoService.AterarProduto(id,produto);
        return alterarProdutoResult ? ResponseEntity.ok("Atualizado com sucesso!") : ResponseEntity.notFound().build();
    }
}
