package com.senac.aula012026.aula012026.presentation;

import com.senac.aula012026.aula012026.application.DTO.MesaRequest;
import com.senac.aula012026.aula012026.application.DTO.MesaResponse;
import com.senac.aula012026.aula012026.application.services.MesaService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/mesas")
@Tag(name = "Mesas controller",description = "Controladora responsavel por gerenciar as mesas!")
public class MesaController {

    @Autowired
    private MesaService mesaService;

    @GetMapping
    @Operation(summary = "Listar todos",description = "Metodo para listar todas as mesas!")
    public ResponseEntity<List<MesaResponse>> listarTodos(){

        var mesas = mesaService.ListarTodos();

        return ResponseEntity.ok(mesas);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Consulta de mesa por ID", description = "Metodo responsavel por consultar uma unica mesa por ID e se nao existir retorna null!")
    public ResponseEntity<MesaResponse> buscarPorId(@PathVariable Long id){
        return ResponseEntity.ok(mesaService.BuscarMesaPorId(id));
    }

    @PostMapping
    @Operation(summary = "Criar mesa",description = "Metodo resposavel por criar mesa")
    public ResponseEntity<Long> salvar (@RequestBody MesaRequest mesa){

        return ResponseEntity.ok(mesaService.SalvarMesa(mesa));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Atualizar mesa",description = "Metodo resposavel por atualizar mesa")
    public ResponseEntity<?> alterarMesa (@PathVariable Long id, @RequestBody MesaRequest mesa){

        var alterarMesaResult = mesaService.AterarMesa(id,mesa);
        return alterarMesaResult ? ResponseEntity.ok("Atualizado com sucesso!") : ResponseEntity.notFound().build();
    }
}
