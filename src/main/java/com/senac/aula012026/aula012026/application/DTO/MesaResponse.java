package com.senac.aula012026.aula012026.application.DTO;

import com.senac.aula012026.aula012026.domain.entities.Mesa;

public record MesaResponse(
        Long id,
        Integer numero,
        String status
) {
    public MesaResponse(Mesa mesa){
        this(
                mesa.getId(),
                mesa.getNumero(),
                mesa.getStatus().toString()
        );
    }
}
