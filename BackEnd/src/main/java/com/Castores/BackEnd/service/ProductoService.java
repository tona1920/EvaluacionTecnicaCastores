package com.Castores.BackEnd.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.Castores.BackEnd.model.ProductoEntity;
import com.Castores.BackEnd.model.Response;
import com.Castores.BackEnd.model.ResponseError;
import com.Castores.BackEnd.repository.ProductoRepository;

@Service
public class ProductoService {
	private final ProductoRepository repository;
	
	public ProductoService(ProductoRepository repository) {
		this.repository = repository;
	}
	
    public Response<List<ProductoEntity>> obtenerProductosActivos() {
        try {
            List<ProductoEntity> lista = repository.obtenerProductos("SELECT idProducto,nombre,cantidad,precio,estatus FROM Productos WHERE Estatus=1");
            return new Response<>(200, "Consulta exitosa", lista);
        } catch (IllegalArgumentException e) {
            return new Response<>(500, "Error al consultar la información", List.of(new ResponseError("Productos", e.getMessage())));
        } catch (Exception e) {
            return new Response<>(500, "Error general", List.of(new ResponseError("consulta", e.getMessage())));
        }
    }
    
    public Response<Object> insertarProducto(ProductoEntity response) {
        try {
            int iResp = repository.insertarProducto(response);
            System.out.println("2");
            
            return new Response<>(200, "Consulta exitosa", iResp);
        } catch (IllegalArgumentException e) {
            return new Response<>(500, "Error al consultar la información", List.of(new ResponseError("Productos", e.getMessage())));
        } catch (Exception e) {
            return new Response<>(500, "Error general", List.of(new ResponseError("insert", e.getMessage())));
        }
    }
    

}
