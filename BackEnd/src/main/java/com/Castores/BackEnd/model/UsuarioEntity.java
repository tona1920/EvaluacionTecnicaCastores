package com.Castores.BackEnd.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UsuarioEntity {
	private Integer idUsuario;
    private String nombre;
    private String correo;
    private String contrasena;
    private Integer idRol;
    private String rol;
    private boolean estatus;
}
