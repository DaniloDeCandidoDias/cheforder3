package com.senac.aula012026.aula012026.application.services;

import com.senac.aula012026.aula012026.application.DTO.ProdutoRequest;
import com.senac.aula012026.aula012026.application.DTO.ProdutoResponse;
import com.senac.aula012026.aula012026.domain.entities.Produto;
import com.senac.aula012026.aula012026.domain.entities.Usuario;
import com.senac.aula012026.aula012026.domain.repository.ProdutoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProdutoService {

    @Autowired
    private ProdutoRepository produtoRepository;

    public List<ProdutoResponse> ListarTodos() {
        try{
            Usuario usuarioLogado = (Usuario) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

            if(usuarioLogado.getRestaurante() == null){
                return List.of();
            }

            return produtoRepository.getProdutosByRestaurante_Id(usuarioLogado.getRestaurante().getId())
                    .stream()
                    .map(ProdutoResponse::new)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    public ProdutoResponse BuscarProdutoPorId(Long id) {
        try{
            Usuario usuarioLogado = (Usuario) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

            if(usuarioLogado.getRestaurante() == null){
                return null;
            }

            var produto = produtoRepository.findByIdAndRestaurante_Id(id,usuarioLogado.getRestaurante().getId()).orElse(null);
            if(produto == null){
                return null;
            }
            return new ProdutoResponse(produto);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    public Long SalvarProduto(ProdutoRequest produto) {
        try {
            Usuario usuarioLogado = (Usuario) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            if(usuarioLogado.getRestaurante() == null){
                return 0L;
            }
            Produto novoProduto = new Produto(produto);
            novoProduto.setRestaurante(usuarioLogado.getRestaurante());
            return produtoRepository.save(novoProduto).getId();
        }catch (Exception e){
            throw new RuntimeException(e);
        }
    }

    public boolean AterarProduto(Long id, ProdutoRequest produto) {

        Usuario usuarioLogado = (Usuario) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        if(usuarioLogado.getRestaurante() == null){
            return false;
        }

        var produtoBanco = produtoRepository.findByIdAndRestaurante_Id(id,usuarioLogado.getRestaurante().getId()).orElse(null);

        if (produtoBanco != null){
            produtoBanco.setNome(produto.nome());
            produtoBanco.setPreco(produto.preco());

            produtoRepository.save(produtoBanco);

            return true;
        }

        return false;
    }
}
