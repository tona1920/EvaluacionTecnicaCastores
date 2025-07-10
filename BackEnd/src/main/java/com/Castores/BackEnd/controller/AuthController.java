package com.Castores.BackEnd.controller;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;

import com.Castores.BackEnd.jwt.JwtUtil;
import com.Castores.BackEnd.model.Login;
import com.Castores.BackEnd.model.Response;
import com.Castores.BackEnd.model.ResponseError;
import com.Castores.BackEnd.model.TokenDTO;
import com.Castores.BackEnd.model.UsuarioEntity;
import com.Castores.BackEnd.service.UsuarioService;


@RestController
@RequestMapping("/api/auth")
public class AuthController{

    private final UsuarioService usuarioService;
    private final JwtUtil jwtUtil;
    
    public AuthController(UsuarioService usuarioService, JwtUtil jwtUtil) {
        this.usuarioService = usuarioService;
        this.jwtUtil=jwtUtil;
    }

    @PostMapping("/login")
    public ResponseEntity<Response<Object>> login(@Valid @RequestBody Login login, BindingResult result) {
    	// Validación del modelo
        if (result.hasErrors()) {
            List<ResponseError> errores = result.getFieldErrors().stream()
                .map(err -> new ResponseError(err.getField(), err.getDefaultMessage()))
                .toList();

            Response<Object> response = new Response<>(400, "Errores de validación", errores);
            return ResponseEntity.status(400).body(response);
        }
    	
    	try {
            UsuarioEntity usuario = usuarioService.verificarCredenciales(login.getSUsername(), login.getSPassword());
            if (usuario == null) {
                return ResponseEntity.status(401)
                    .body(new Response<>(401, "Credenciales inválidas", null));
            }

            // Validación adicional por si algún campo es null
            if (usuario.getIdUsuario() == null || usuario.getIdRol() == null) {
                return ResponseEntity.status(500)
                    .body(new Response<>(500, "El usuario no tiene ID o rol definido", null));
            }

            // Fechas
            Date now = new Date();
            Date expiry = new Date(System.currentTimeMillis() + 1000 * 60 * 15);
            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss");

            // Claims seguros
            Map<String, Object> claims = new HashMap<>();
            claims.put("idUsuario", usuario.getIdUsuario());
            claims.put("idRol", usuario.getIdRol());

            String accessToken = jwtUtil.generarAccessToken(usuario.getNombre(), claims);
            String refreshToken = jwtUtil.generarRefreshToken(usuario.getNombre());

            TokenDTO tokenDTO = new TokenDTO(
                accessToken,
                refreshToken,
                usuario.getIdUsuario(),
                usuario.getIdRol(),
                1,
                usuario.getNombre(),
                sdf.format(now),
                sdf.format(expiry)
            );

            return ResponseEntity.ok(new Response<>(200, "Token generado", tokenDTO));

        } catch (Exception e) {
            return ResponseEntity.status(500)
                .body(new Response<>(500, "Error al generar token: " + e.getMessage(), null));
        }
    }

    @PostMapping("/refresh")
    public ResponseEntity<Response<Map<String, String>>> refresh(@RequestHeader("Authorization") String header) {
        try {
            String refreshToken = header.startsWith("Bearer ") ? header.substring(7) : header;

            if (!jwtUtil.validarToken(refreshToken)) {
                Map<String, String> error = Map.of("token", "Falta el token o es incorrecto");
                return ResponseEntity.status(401).body(new Response<>(401, "Token no enviado o inválido", error));
            }

            String username = jwtUtil.getSubject(refreshToken);
            Map<String, Object> claims = Map.of("rol", "ADMINISTRADOR");

            String newAccessToken = jwtUtil.generarAccessToken(username, claims);

            return ResponseEntity.ok(new Response<>(200, "Token generado", Map.of("accessToken", newAccessToken)));

        } catch (Exception e) {
            Map<String, String> error = Map.of("token", "Error al generar token");
            return ResponseEntity.status(500).body(new Response<>(500, "Error al generar token", error));
        }
    }
    
   }