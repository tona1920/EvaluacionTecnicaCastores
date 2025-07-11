package com.Castores.BackEnd.model;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class HistorialProductos {
	private String producto;      
    private Integer accion;       
    private Integer cantidad;   
    private LocalDateTime fecha; 
    private String usuario; 
}
