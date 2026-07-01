package com.senac.aula012026.aula012026.application.services;

import com.senac.aula012026.aula012026.application.DTO.MesaRequest;
import com.senac.aula012026.aula012026.application.DTO.MesaResponse;
import com.senac.aula012026.aula012026.domain.entities.Mesa;
import com.senac.aula012026.aula012026.domain.entities.Usuario;
import com.senac.aula012026.aula012026.domain.repository.MesaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class MesaService {

    @Autowired
    private MesaRepository mesaRepository;

    public List<MesaResponse> ListarTodos() {
        try{
            Usuario usuarioLogado = (Usuario) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

            if(usuarioLogado.getRestaurante() == null){
                return List.of();
            }

            return mesaRepository.getMesasByRestaurante_Id(usuarioLogado.getRestaurante().getId())
                    .stream()
                    .map(MesaResponse::new)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    public MesaResponse BuscarMesaPorId(Long id) {
        try{
            Usuario usuarioLogado = (Usuario) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

            if(usuarioLogado.getRestaurante() == null){
                return null;
            }

            var mesa = mesaRepository.findByIdAndRestaurante_Id(id,usuarioLogado.getRestaurante().getId()).orElse(null);
            if(mesa == null){
                return null;
            }
            return new MesaResponse(mesa);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    public Long SalvarMesa(MesaRequest mesa) {
        try {
            Usuario usuarioLogado = (Usuario) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            if(usuarioLogado.getRestaurante() == null){
                return 0L;
            }
            Mesa novaMesa = new Mesa(mesa);
            novaMesa.setRestaurante(usuarioLogado.getRestaurante());
            return mesaRepository.save(novaMesa).getId();
        }catch (Exception e){
            throw new RuntimeException(e);
        }
    }

    public boolean AterarMesa(Long id, MesaRequest mesa) {

        Usuario usuarioLogado = (Usuario) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        if(usuarioLogado.getRestaurante() == null){
            return false;
        }

        var mesaBanco = mesaRepository.findByIdAndRestaurante_Id(id,usuarioLogado.getRestaurante().getId()).orElse(null);

        if (mesaBanco != null){
            mesaBanco.setNumero(mesa.numero());
            if(mesa.status() != null){
                mesaBanco.setStatus(mesa.status());
            }

            mesaRepository.save(mesaBanco);

            return true;
        }

        return false;
    }
}
