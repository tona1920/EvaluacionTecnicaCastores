package com.Castores.BackEnd.model;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class Usuario {
    @NotNull(message = "El usuario es obligatorio.")
    private Integer idUsuario;
	
	@NotBlank(message = "El nombre es obligatorio.")
    private String nombre;
	
    @NotBlank(message = "El correo es obligatorio.")
    @Email(message = "El correo no es válido.")
    private String correo;
    
    @NotNull(message = "El rol es obligatorio.")
    private Integer idRol;
    
    @NotNull(message = "El estatus es obligatorio.")
    private Boolean estatus;
}
