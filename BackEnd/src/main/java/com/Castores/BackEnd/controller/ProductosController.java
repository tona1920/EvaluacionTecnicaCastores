package com.Castores.BackEnd.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.Castores.BackEnd.model.HistorialProductos;
import com.Castores.BackEnd.model.Producto;
import com.Castores.BackEnd.model.ProductoEntity;
import com.Castores.BackEnd.model.Response;
import com.Castores.BackEnd.model.ResponseError;
import com.Castores.BackEnd.service.ProductoService;

import jakarta.validation.Valid;

import java.util.List;

@RestController
@RequestMapping("/api/productos")
public class ProductosController {
	private final ProductoService service;
	
	public ProductosController(ProductoService service) {
		this.service= service;
	}
	
	@GetMapping("/activos")
	public ResponseEntity<Response<List<ProductoEntity>>> obtenerProductosActivos() {
		 Response<List<ProductoEntity>> response = service.obtenerProductosActivos();

		 // Devolver la respuesta HTTP con el código que vino del servicio
		 return ResponseEntity.status(response.getICode()).body(response);
	}
	
	 
	@GetMapping("/historial")
	public ResponseEntity<Response<List<HistorialProductos>>> obtenerHistorial() {
		 Response<List<HistorialProductos>> response = service.obtenerHistorial();

		 // Devolver la respuesta HTTP con el código que vino del servicio
		 return ResponseEntity.status(response.getICode()).body(response);
	}
	 
	@GetMapping("/todos")
	public ResponseEntity<Response<List<ProductoEntity>>> obtenerProductos() {
		 Response<List<ProductoEntity>> response = service.obtenerProductos();

		 // Devolver la respuesta HTTP con el código que vino del servicio
		 return ResponseEntity.status(response.getICode()).body(response);
	}
	 
	@PostMapping("/crear")
	public ResponseEntity<Response<Object>> crearProducto(@Valid @RequestBody ProductoEntity request, BindingResult result) {
		if (result.hasErrors()) {
			List<ResponseError> errores = result.getFieldErrors().stream()
	                .map(err -> new ResponseError(err.getField(), err.getDefaultMessage()))
	                .toList();

			Response<Object> response = new Response<>(400, "Errores de validación", errores);
			return ResponseEntity.status(404).body(response);
	    }

	    // Si no hay errores, continúa normalmente
		Response<Object> response = service.insertarProducto(request);
		return ResponseEntity.status(response.getICode()).body(response);
	}
	 
	@PostMapping("/accion")
	public ResponseEntity<?> ejecutarAccion(@Valid @RequestBody Producto dto, BindingResult result) {
		
		if (result.hasErrors()) {
	         List<ResponseError> errores = result.getFieldErrors().stream()
	             .map(err -> new ResponseError(err.getField(), err.getDefaultMessage()))
	             .toList();
	         return ResponseEntity.badRequest().body(new Response<>(400, "Errores de validación", errores));
	     }

	     Response<Object> response = service.ejecutarAccionProducto(dto);
	     return ResponseEntity.status(response.getICode()).body(response);
	}
}
