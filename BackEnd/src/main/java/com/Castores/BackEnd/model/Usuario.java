package com.Castores.BackEnd.model;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class Usuario {
	@NotBlank(message = "El nombre es obligatorio.")
    private String nombre;
	
    @NotBlank(message = "El correo es obligatorio.")
    @Email(message = "El correo no es válido.")
    private String correo;
    
    @NotNull(message = "El rol es obligatorio.")
    private Integer idRol;
}
