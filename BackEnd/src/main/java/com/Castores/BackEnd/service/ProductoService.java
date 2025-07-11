package com.Castores.BackEnd.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.Castores.BackEnd.model.HistorialProductos;
import com.Castores.BackEnd.model.Producto;
import com.Castores.BackEnd.model.ProductoEntity;
import com.Castores.BackEnd.model.Response;
import com.Castores.BackEnd.model.ResponseError;
import com.Castores.BackEnd.repository.ProductoRepository;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class ProductoService {
	private final ProductoRepository repository;
    private final ObjectMapper mapper;
	
	public ProductoService(ProductoRepository repository , ObjectMapper mapper) {
		this.repository = repository;
		this.mapper = mapper;
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
    
    public Response<List<ProductoEntity>> obtenerProductos() {
        try {
            List<ProductoEntity> lista = repository.obtenerProductos("SELECT idProducto,nombre,cantidad,precio,estatus FROM Productos");
            return new Response<>(200, "Consulta exitosa", lista);
        } catch (IllegalArgumentException e) {
            return new Response<>(500, "Error al consultar la información", List.of(new ResponseError("Productos", e.getMessage())));
        } catch (Exception e) {
            return new Response<>(500, "Error general", List.of(new ResponseError("consulta", e.getMessage())));
        }
    }
    
    public Response<List<HistorialProductos>> obtenerHistorial() {
        try {
            List<HistorialProductos> lista = repository.obtenerHistorial();
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
    
    
    public Response<Object> ejecutarAccionProducto(Producto dto) {
        try {
            // Validación lógica según acción
            List<ResponseError> errores = new ArrayList<>();

            switch (dto.getAccion()) {
                case 1: // actualizar producto
                    if (dto.getNombre() == null && dto.getCantidad() == null && dto.getPrecio() == null && dto.getEstatus() == null) {
                        errores.add(new ResponseError("accion", "Debes enviar al menos un campo para actualizar (nombre, cantidad, precio, estatus)"));
                    }
                    break;

                case 2: // actualizar estatus
                    if (dto.getEstatus() == null) {
                        errores.add(new ResponseError("estatus", "El estatus es obligatorio para esta acción"));
                    }
                    break;

                case 3: // agregar stock
                	if (dto.getCantidad() == null || dto.getCantidad() <= 0) {
                        errores.add(new ResponseError("cantidad", "Cantidad positiva requerida para esta acción"));
                    }
                    break;
                case 4: // registrar venta
                    if (dto.getCantidad() == null || dto.getCantidad() <= 0) {
                        errores.add(new ResponseError("cantidad", "Cantidad positiva requerida para esta acción"));
                    }
                    break;

                default:
                    errores.add(new ResponseError("accion", "Acción no reconocida"));
            }

            if (!errores.isEmpty()) {
                return new Response<>(400, "Errores de validación lógica", errores);
            }

            String jsonResult = repository.modificarProducto(dto);
            Map<String, Object> result = mapper.readValue(jsonResult, Map.class);

            int iCode = (int) result.get("iCode");
            String sMensaje = (String) result.get("sMensaje");

            if (iCode == 200) {
            	Map<String, Object> data = Map.of(
            		    "iIdUsuario", result.get("iIdUsuario")
            		);
                return new Response<>(iCode, sMensaje, data);
            }

            if (iCode != 200 && result.containsKey("aErrores")) {
                List<ResponseError> errores2 = ((List<Map<String, String>>) result.get("aErrores")).stream()
                        .map(err -> {
                            String key = err.keySet().iterator().next();
                            return new ResponseError(key, err.get(key));
                        }).toList();
                return new Response<>(iCode, sMensaje, errores2);
            }

            return new Response<>(iCode, sMensaje, null);

        } catch (IllegalArgumentException e) {
            return new Response<>(500, "Error al ejecutar la acción", List.of(new ResponseError("Argumento", e.getMessage())));
        } catch (Exception e) {
            return new Response<>(500, "Error general", List.of(new ResponseError("SP", e.getMessage())));
        }
    }

}
