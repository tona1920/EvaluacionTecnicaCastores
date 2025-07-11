package com.Castores.BackEnd.model;

import java.math.BigDecimal;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
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
    
    @NotBlank(message = "El usuario es obligatorio")
    private Integer idUsuario;

    private String nombre;
    
    private Integer cantidad;
    
    private BigDecimal precio;
    
    private String comentario;
    
    private Boolean estatus;

    @NotBlank(message = "La accion es obligatoria")
    private Integer iAccion;
}
