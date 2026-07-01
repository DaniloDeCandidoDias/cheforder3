package com.senac.aula012026.aula012026.presentation;

import com.senac.aula012026.aula012026.application.DTO.PedidoRequest;
import com.senac.aula012026.aula012026.application.DTO.PedidoResponse;
import com.senac.aula012026.aula012026.application.services.PedidoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/pedidos")
@Tag(name = "Pedidos controller",description = "Controladora responsavel por gerenciar os pedidos!")
public class PedidoController {

    @Autowired
    private PedidoService pedidoService;

    @GetMapping
    @Operation(summary = "Listar todos",description = "Metodo para listar todos os pedidos!")
    public ResponseEntity<List<PedidoResponse>> listarTodos(){

        var pedidos = pedidoService.ListarTodos();

        return ResponseEntity.ok(pedidos);
    }

    @GetMapping("/mesa/{mesaId}/aberto")
    @Operation(summary = "Consulta pedido aberto por mesa", description = "Metodo responsavel por consultar o pedido aberto de uma mesa!")
    public ResponseEntity<PedidoResponse> buscarPedidoAbertoPorMesa(@PathVariable Long mesaId){
        return ResponseEntity.ok(pedidoService.BuscarPedidoAbertoPorMesa(mesaId));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Consulta de pedido por ID", description = "Metodo responsavel por consultar um unico pedido por ID e se nao existir retorna null!")
    public ResponseEntity<PedidoResponse> buscarPorId(@PathVariable Long id){
        return ResponseEntity.ok(pedidoService.BuscarPedidoPorId(id));
    }

    @PostMapping
    @Operation(summary = "Criar pedido",description = "Metodo resposavel por criar pedido")
    public ResponseEntity<Long> salvar (@RequestBody PedidoRequest pedido){

        return ResponseEntity.ok(pedidoService.SalvarPedido(pedido));
    }

    @PostMapping("/lancar")
    @Operation(summary = "Lancar produtos na mesa",description = "Metodo resposavel por lancar produtos em uma mesa")
    public ResponseEntity<Long> lancarProdutos (@RequestBody PedidoRequest pedido){

        return ResponseEntity.ok(pedidoService.LancarProdutos(pedido));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Atualizar pedido",description = "Metodo resposavel por atualizar pedido")
    public ResponseEntity<?> alterarPedido (@PathVariable Long id, @RequestBody PedidoRequest pedido){

        var alterarPedidoResult = pedidoService.AterarPedido(id,pedido);
        return alterarPedidoResult ? ResponseEntity.ok("Atualizado com sucesso!") : ResponseEntity.notFound().build();
    }

    @PutMapping("/{id}/fechar")
    @Operation(summary = "Fechar pedido",description = "Metodo resposavel por fechar a conta de uma mesa")
    public ResponseEntity<?> fecharPedido (@PathVariable Long id){

        var fecharPedidoResult = pedidoService.FecharPedido(id);
        return fecharPedidoResult ? ResponseEntity.ok("Atualizado com sucesso!") : ResponseEntity.notFound().build();
    }
}
