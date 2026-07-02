package com.senac.aula012026.aula012026.application.services;

import com.senac.aula012026.aula012026.application.DTO.*;
import com.senac.aula012026.aula012026.domain.enuns.EnumStatusUsuario;
import com.senac.aula012026.aula012026.domain.entities.Restaurante;
import com.senac.aula012026.aula012026.domain.entities.Usuario;
import com.senac.aula012026.aula012026.domain.repository.RestauranteRepository;
import com.senac.aula012026.aula012026.domain.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private RestauranteRepository restauranteRepository;

    @Value("${spring.secretkey}")
    private String secret;


    public boolean ValidaUsuarioSenha(LoginRequest loginRequest) {
        try {

            return usuarioRepository.existsUsuarioByEmailAndSenhaAndStatus(
                    loginRequest.email(),
                    loginRequest.senha(),
                    EnumStatusUsuario.ATIVO
            );

        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }


    public List<UsuarioResponse> ListarTodos() {
        try{
            Usuario usuarioLogado = (Usuario) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

            var restaurante = usuarioLogado.getRestaurante();

            if (restaurante == null){
                return List.of();
            }

            return usuarioRepository.getUsuariosByRestaurante_Id(restaurante.getId())
                    .stream()
                    .map(UsuarioResponse::new)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    public UsuarioResponse BuscarUsuarioLogado(Authentication authentication) {
        Usuario usuario = (Usuario) authentication.getPrincipal();
        try{
            return  usuarioRepository.findById(usuario.getId())
                    .stream().map(UsuarioResponse::new).findFirst().orElse(null);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }



    public UsuarioResponse BuscarUsuarioPorId(Long id) {
        try{

            Usuario usuarioLogado = (Usuario) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

            if(usuarioLogado.getRestaurante() == null){
                return null;
            }

           var usuario = usuarioRepository.findByIdAndRestaurante_Id(id,usuarioLogado.getRestaurante().getId()).orElse(null);
           if(usuario == null){
               return null;
           }
           return new UsuarioResponse(usuario);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }

    }

    public boolean AterarUsuario(Long id, UsuarioRequest usuario) {

        Usuario usuarioLogado = (Usuario) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        if(usuarioLogado.getRestaurante() == null){
            return false;
        }

        var usuarioBanco = usuarioRepository.findByIdAndRestaurante_Id(id,usuarioLogado.getRestaurante().getId()).orElse(null);

        if (usuarioBanco != null){
            usuarioBanco.setEmail(usuario.email());
            usuarioBanco.setNome(usuario.nome());
            usuarioBanco.setSenha(usuario.senha());


            usuarioRepository.save(usuarioBanco);

            return true;
        }

        return false;
    }

    public Long SalvarUsuario(UsuarioRequest usuario) {
        try {
            Usuario usuarioLogado = (Usuario) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            if(usuarioLogado.getRestaurante() == null){
                return 0L;
            }
            Usuario novoUsuario = new Usuario(usuario);
            novoUsuario.setRestaurante(usuarioLogado.getRestaurante());
            return usuarioRepository.save(novoUsuario).getId();
        }catch (Exception e){
            throw new RuntimeException(e);
        }

    }

    public Long SalvarUsuarioAdm(UsuarioAdmRequest usuario) {
        try {

            if(secret.equals(usuario.secretKey())) {
                Restaurante restaurante = restauranteRepository.save(new Restaurante(usuario));
                return usuarioRepository.save(new Usuario(usuario, restaurante)).getId();
            }else
            {
                return 0L;
            }

        }catch (Exception e){
            throw new RuntimeException(e);
        }

    }

    public boolean AlterarStatus(Long id, AlterarStatusRequest statusRequest) {

        Usuario usuarioLogado = (Usuario) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        if(usuarioLogado.getRestaurante() == null || !"ROLE_ADMIN".equals(usuarioLogado.getRole())){
            return false;
        }

        var usuarioBanco = usuarioRepository.findByIdAndRestaurante_Id(id,usuarioLogado.getRestaurante().getId()).orElse(null);

        if (usuarioBanco != null){

            usuarioBanco.setStatus(statusRequest.status());
            usuarioRepository.save(usuarioBanco);

            return true;
        }
        return false;
    }
}
