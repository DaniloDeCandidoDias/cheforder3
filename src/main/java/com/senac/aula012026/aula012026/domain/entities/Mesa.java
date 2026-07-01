package com.senac.aula012026.aula012026.domain.entities;

import com.senac.aula012026.aula012026.application.DTO.MesaRequest;
import com.senac.aula012026.aula012026.domain.enuns.EnumStatusMesa;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Mesa {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Integer numero;

    private EnumStatusMesa status = EnumStatusMesa.LIVRE;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "restaurante_id", referencedColumnName = "id")
    private Restaurante restaurante;

    public Mesa(MesaRequest mesa){
        this.numero = mesa.numero();
        this.status = mesa.status() == null ? EnumStatusMesa.LIVRE : mesa.status();
    }
}
