package com.senac.aula012026.aula012026.application.DTO;

public record UsuarioAdmRequest(
        String nome,
        String email,
        String senha,
        String secretKey,
        String cpf,
        String cep,
        String logradouro,
        String numero,
        String bairro,
        String cidade,
        String estado,
        String complemento
) {
}
