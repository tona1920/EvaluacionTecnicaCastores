package com.Castores.BackEnd.service;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.Castores.BackEnd.config.AppConfig;
import com.Castores.BackEnd.model.HistorialProductos;
import com.Castores.BackEnd.model.Response;
import com.Castores.BackEnd.model.ResponseError;
import com.Castores.BackEnd.model.Rutas;
import com.Castores.BackEnd.model.Usuario;
import com.Castores.BackEnd.model.UsuarioEntity;
import com.Castores.BackEnd.repository.UsuarioRepository;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class UsuarioService {
    private final UsuarioRepository repository;
    private final ObjectMapper mapper;
    
    public UsuarioService(UsuarioRepository repository, ObjectMapper mapper) {
        this.repository = repository;
        this.mapper = mapper;
    }
    
    public Response<Object> insertarUsuario(Usuario request) {
        try {
        	
        	// Generar contraseña automáticamente
        	String sPassword = generarPassword(15);
        	 String sPasswordEncriptado = AppConfig.encriptar(sPassword);
            String jsonResult = repository.insertarUsuario(request, sPasswordEncriptado);
            
            Map<String, Object> result = mapper.readValue(jsonResult, Map.class);

            int iCode = (int) result.get("iCode");
            String sMensaje = (String) result.get("sMensaje");

            if (iCode == 200) {
            	Map<String, Object> data = Map.of(
            		    "iIdUsuario", result.get("iIdUsuario"),
            		    "sUsername", request.getNombre(),
            		    "sPassword", sPassword
            		);
                return new Response<>(iCode, sMensaje, data);
            }

            if (iCode == 404 && result.containsKey("aErrores")) {
                List<ResponseError> errores = ((List<Map<String, String>>) result.get("aErrores")).stream()
                        .map(err -> {
                            String key = err.keySet().iterator().next();
                            return new ResponseError(key, err.get(key));
                        }).toList();
                return new Response<>(iCode, sMensaje, errores);
            }

            return new Response<>(iCode, sMensaje, null);

        } catch (Exception e) {
            List<ResponseError> errores = List.of(new ResponseError("Interno", e.getMessage()));
            return new Response<>(500, "Error al insertar usuario", errores);
        }
    }
    
    public Response<List<Rutas>> obtenerRutas(Integer idUsuario) {
        try {
            List<Rutas> lista = repository.buscarRuta(idUsuario);
            return new Response<>(200, "Consulta exitosa", lista);
        } catch (IllegalArgumentException e) {
            return new Response<>(500, "Error al consultar la información", List.of(new ResponseError("Productos", e.getMessage())));
        } catch (Exception e) {
            return new Response<>(500, "Error general", List.of(new ResponseError("consulta", e.getMessage())));
        }
    }
    
    private String generarPassword(int longitud) {
	    String caracteres = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%&*";
	    StringBuilder sb = new StringBuilder();
	    for (int i = 0; i < longitud; i++) {
	        int index = (int) (Math.random() * caracteres.length());
	        sb.append(caracteres.charAt(index));
	    }
	    return sb.toString();
	}
    
    public UsuarioEntity verificarCredenciales(String username, String passwordPlano) {
        UsuarioEntity usuario = repository.buscarPorUsername(username);
        if (usuario == null) return null;

        boolean valido = AppConfig.verificar(passwordPlano, usuario.getContrasena());
        return valido ? usuario : null;
    }
}
