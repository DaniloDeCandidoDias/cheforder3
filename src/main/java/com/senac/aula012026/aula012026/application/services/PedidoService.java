package com.senac.aula012026.aula012026.application.services;

import com.senac.aula012026.aula012026.application.DTO.PedidoRequest;
import com.senac.aula012026.aula012026.application.DTO.PedidoResponse;
import com.senac.aula012026.aula012026.domain.entities.ItemPedido;
import com.senac.aula012026.aula012026.domain.entities.Pedido;
import com.senac.aula012026.aula012026.domain.entities.Usuario;
import com.senac.aula012026.aula012026.domain.enuns.EnumStatusMesa;
import com.senac.aula012026.aula012026.domain.enuns.EnumStatusPedido;
import com.senac.aula012026.aula012026.domain.repository.MesaRepository;
import com.senac.aula012026.aula012026.domain.repository.PedidoRepository;
import com.senac.aula012026.aula012026.domain.repository.ProdutoRepository;
import com.senac.aula012026.aula012026.domain.valueobjects.QuantidadeItemPedido;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class PedidoService {

    @Autowired
    private PedidoRepository pedidoRepository;

    @Autowired
    private MesaRepository mesaRepository;

    @Autowired
    private ProdutoRepository produtoRepository;

    public List<PedidoResponse> ListarTodos() {
        try{
            Usuario usuarioLogado = (Usuario) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

            if(usuarioLogado.getRestaurante() == null){
                return List.of();
            }

            return pedidoRepository.getPedidosByRestaurante_Id(usuarioLogado.getRestaurante().getId())
                    .stream()
                    .map(PedidoResponse::new)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    public PedidoResponse BuscarPedidoPorId(Long id) {
        try{
            Usuario usuarioLogado = (Usuario) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

            if(usuarioLogado.getRestaurante() == null){
                return null;
            }

            var pedido = pedidoRepository.findByIdAndRestaurante_Id(id,usuarioLogado.getRestaurante().getId()).orElse(null);
            if(pedido == null){
                return null;
            }
            return new PedidoResponse(pedido);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    public PedidoResponse BuscarPedidoAbertoPorMesa(Long mesaId) {
        try{
            Usuario usuarioLogado = (Usuario) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

            if(usuarioLogado.getRestaurante() == null){
                return null;
            }

            var pedido = pedidoRepository.findFirstByMesa_IdAndRestaurante_IdAndStatus(
                    mesaId,
                    usuarioLogado.getRestaurante().getId(),
                    EnumStatusPedido.ABERTO
            ).orElse(null);

            if(pedido == null){
                return null;
            }

            return new PedidoResponse(pedido);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    public Long SalvarPedido(PedidoRequest pedido) {
        try {
            Usuario usuarioLogado = (Usuario) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            if(usuarioLogado.getRestaurante() == null){
                return 0L;
            }

            var mesa = mesaRepository.findByIdAndRestaurante_Id(
                    pedido.mesaId(),
                    usuarioLogado.getRestaurante().getId()
            ).orElse(null);

            if(mesa == null){
                return 0L;
            }

            Pedido novoPedido = new Pedido();
            novoPedido.setMesa(mesa);
            novoPedido.setRestaurante(usuarioLogado.getRestaurante());
            novoPedido.setStatus(pedido.status() == null ? EnumStatusPedido.ABERTO : pedido.status());
            novoPedido.setDataHora(LocalDateTime.now());
            atualizarItens(novoPedido, pedido, usuarioLogado.getRestaurante().getId());

            mesa.setStatus(EnumStatusMesa.OCUPADA);
            mesaRepository.save(mesa);

            return pedidoRepository.save(novoPedido).getId();
        }catch (Exception e){
            throw new RuntimeException(e);
        }
    }

    public Long LancarProdutos(PedidoRequest pedido) {
        try {
            Usuario usuarioLogado = (Usuario) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            if(usuarioLogado.getRestaurante() == null){
                return 0L;
            }

            var mesa = mesaRepository.findByIdAndRestaurante_Id(
                    pedido.mesaId(),
                    usuarioLogado.getRestaurante().getId()
            ).orElse(null);

            if(mesa == null){
                return 0L;
            }

            var pedidoBanco = pedidoRepository.findFirstByMesa_IdAndRestaurante_IdAndStatus(
                    mesa.getId(),
                    usuarioLogado.getRestaurante().getId(),
                    EnumStatusPedido.ABERTO
            ).orElse(new Pedido());

            pedidoBanco.setMesa(mesa);
            pedidoBanco.setRestaurante(usuarioLogado.getRestaurante());
            pedidoBanco.setStatus(EnumStatusPedido.ABERTO);
            if(pedidoBanco.getDataHora() == null){
                pedidoBanco.setDataHora(LocalDateTime.now());
            }
            atualizarItens(pedidoBanco, pedido, usuarioLogado.getRestaurante().getId());

            mesa.setStatus(EnumStatusMesa.OCUPADA);
            mesaRepository.save(mesa);

            return pedidoRepository.save(pedidoBanco).getId();
        }catch (Exception e){
            throw new RuntimeException(e);
        }
    }

    public boolean AterarPedido(Long id, PedidoRequest pedido) {

        Usuario usuarioLogado = (Usuario) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        if(usuarioLogado.getRestaurante() == null){
            return false;
        }

        var pedidoBanco = pedidoRepository.findByIdAndRestaurante_Id(id,usuarioLogado.getRestaurante().getId()).orElse(null);

        if (pedidoBanco != null){
            if(pedido.mesaId() != null){
                var mesa = mesaRepository.findByIdAndRestaurante_Id(
                        pedido.mesaId(),
                        usuarioLogado.getRestaurante().getId()
                ).orElse(null);

                if(mesa == null){
                    return false;
                }

                pedidoBanco.setMesa(mesa);
            }

            if(pedido.status() != null){
                pedidoBanco.setStatus(pedido.status());
            }

            atualizarItens(pedidoBanco, pedido, usuarioLogado.getRestaurante().getId());

            if(pedidoBanco.getStatus() == EnumStatusPedido.FECHADO){
                pedidoBanco.getMesa().setStatus(EnumStatusMesa.LIVRE);
            }else{
                pedidoBanco.getMesa().setStatus(EnumStatusMesa.OCUPADA);
            }

            mesaRepository.save(pedidoBanco.getMesa());
            pedidoRepository.save(pedidoBanco);

            return true;
        }

        return false;
    }

    public boolean FecharPedido(Long id) {

        Usuario usuarioLogado = (Usuario) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        if(usuarioLogado.getRestaurante() == null){
            return false;
        }

        var pedidoBanco = pedidoRepository.findByIdAndRestaurante_Id(id,usuarioLogado.getRestaurante().getId()).orElse(null);

        if (pedidoBanco != null){
            pedidoBanco.setStatus(EnumStatusPedido.FECHADO);
            atualizarValorTotal(pedidoBanco);
            pedidoBanco.getMesa().setStatus(EnumStatusMesa.LIVRE);

            mesaRepository.save(pedidoBanco.getMesa());
            pedidoRepository.save(pedidoBanco);

            return true;
        }

        return false;
    }

    private void atualizarItens(Pedido pedidoBanco, PedidoRequest pedido, Long restauranteId){
        Map<Long, Integer> quantidades = montarQuantidades(pedido);

        if(pedidoBanco.getItens() == null){
            pedidoBanco.setItens(new ArrayList<>());
        }

        pedidoBanco.getItens().clear();

        for (var item : quantidades.entrySet()){
            var produto = produtoRepository.findByIdAndRestaurante_Id(item.getKey(), restauranteId).orElse(null);

            if(produto != null){
                ItemPedido itemPedido = new ItemPedido();
                BigDecimal valorUnitario = produto.getPreco() == null ? BigDecimal.ZERO : produto.getPreco();
                itemPedido.setPedido(pedidoBanco);
                itemPedido.setProduto(produto);
                itemPedido.setQuantidade(item.getValue());
                itemPedido.setValorUnitario(valorUnitario);
                itemPedido.setSubtotal(valorUnitario.multiply(BigDecimal.valueOf(item.getValue())));
                pedidoBanco.getItens().add(itemPedido);
            }
        }

        atualizarValorTotal(pedidoBanco);
    }

    private Map<Long, Integer> montarQuantidades(PedidoRequest pedido){
        Map<Long, Integer> quantidades = new LinkedHashMap<>();

        if(pedido.itens() != null && !pedido.itens().isEmpty()){
            pedido.itens().forEach(item -> {
                if(item.produtoId() != null){
                    Integer quantidade = new QuantidadeItemPedido(item.quantidade()).getValor();
                    quantidades.merge(item.produtoId(), quantidade, Integer::sum);
                }
            });

            return quantidades;
        }

        if(pedido.produtosIds() != null){
            pedido.produtosIds().forEach(produtoId -> {
                if(produtoId != null){
                    quantidades.merge(produtoId, new QuantidadeItemPedido().getValor(), Integer::sum);
                }
            });
        }

        return quantidades;
    }

    private void atualizarValorTotal(Pedido pedidoBanco){
        BigDecimal total = pedidoBanco.getItens() == null
                ? BigDecimal.ZERO
                : pedidoBanco.getItens()
                .stream()
                .map(ItemPedido::getSubtotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        pedidoBanco.setValorTotal(total);
    }
}
