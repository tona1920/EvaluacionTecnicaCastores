package com.Castores.BackEnd.model;

import java.math.BigDecimal;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductoEntity {
	private Integer idProducto;
    @NotBlank(message = "El nombre es obligatorio")
    @Size(min = 3, max = 200, message = "El nombre debe tener entre 3 y 200 caracteres")
    private String nombre;

    @NotNull(message = "La cantidad es obligatoria")
    @Min(value = 0, message = "La cantidad debe ser mayor o igual a 0")
    private Integer cantidad;

    @NotNull(message = "El precio es obligatorio")
    @DecimalMin(value = "1.00", inclusive = true, message = "El precio debe ser mayor o igual a 1.00")
    private BigDecimal precio;

    private boolean estatus = true;
}
