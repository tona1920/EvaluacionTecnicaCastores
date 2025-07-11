package com.Castores.BackEnd.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import com.Castores.BackEnd.model.IdentificadorUsuarioDTO;
import com.Castores.BackEnd.model.ProductoEntity;
import com.Castores.BackEnd.model.Response;
import com.Castores.BackEnd.model.ResponseError;
import com.Castores.BackEnd.model.Rutas;
import com.Castores.BackEnd.model.Usuario;
import com.Castores.BackEnd.service.UsuarioService;

import jakarta.validation.Valid;


@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {
	 private final UsuarioService service;

	    public UsuarioController(UsuarioService service) {
	        this.service = service;
	    }

	    @PostMapping("/crear")
	    public ResponseEntity<Response<Object>> crearUsuario(@Valid @RequestBody Usuario request, BindingResult result) {
	    	
	    	if (result.hasErrors()) {
	            List<ResponseError> errores = result.getFieldErrors().stream()
	                .map(err -> new ResponseError(err.getField(), err.getDefaultMessage()))
	                .toList();

	            Response<Object> response = new Response<>(400, "Errores de validación", errores);
	            return ResponseEntity.status(404).body(response);
	        }

	        // Si no hay errores, continúa normalmente
	        Response<Object> response = service.insertarUsuario(request);
	        return ResponseEntity.status(response.getICode()).body(response);
	    }

	    @PostMapping("/rutas")
		public ResponseEntity<Response<List<Rutas>>> obtenerProductosActivos(@Valid @RequestBody IdentificadorUsuarioDTO request, BindingResult validation) {
	    	 if (validation.hasErrors()) {
	             // Construir lista de errores igual que en crearUsuario
	             List<ResponseError> errores = validation.getFieldErrors().stream()
	                     .map(err -> new ResponseError(err.getField(), err.getDefaultMessage()))
	                     .toList();
	             return ResponseEntity
	                     .badRequest()
	                     .body(new Response<>(400, "Error en parámetros", errores));
	         }
	    	 
			 Response<List<Rutas>> response = service.obtenerRutas(request.getIdUsuario());

			 // Devolver la respuesta HTTP con el código que vino del servicio
			 return ResponseEntity.status(response.getICode()).body(response);
		}
}
