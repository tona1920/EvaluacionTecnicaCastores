package com.Castores.BackEnd.model;

import java.math.BigDecimal;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Producto {
    @NotNull(message = "El producto es obligatorio")
	private Integer idProducto;
    
    @NotNull(message = "El usuario es obligatorio")
    private Integer idUsuario;

    private String nombre;
    
    private Integer cantidad;
    
    private BigDecimal precio;
    
    private String comentario;
    
    private Boolean estatus;

    @NotNull(message = "La accion es obligatoria")
    private Integer accion;
}
