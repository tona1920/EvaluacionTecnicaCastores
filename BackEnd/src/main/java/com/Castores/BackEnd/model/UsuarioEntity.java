package com.Castores.BackEnd.model;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UsuarioEntity {
	private Integer idUsuario;
    private String nombre;
    private String contrasena;
    private Integer idRol;
    private boolean estatus;
}
