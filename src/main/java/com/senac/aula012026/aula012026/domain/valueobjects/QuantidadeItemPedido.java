package com.senac.aula012026.aula012026.domain.valueobjects;

public class QuantidadeItemPedido {

    private Integer quantidade;

    public QuantidadeItemPedido(){
        this.quantidade = 1;
    }

    public QuantidadeItemPedido(Integer quantidade){
        if(quantidade == null || quantidade < 1){
            this.quantidade = 1;
        }else{
            this.quantidade = quantidade;
        }
    }

    public Integer getValor(){
        return this.quantidade;
    }

    @Override
    public String toString(){
        return this.quantidade.toString();
    }
}
