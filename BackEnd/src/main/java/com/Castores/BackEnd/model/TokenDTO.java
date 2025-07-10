package com.Castores.BackEnd.model;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TokenDTO {
    private String sAccessToken;
    private String sRefreshToken;
    private Integer iIdUsuario;
    private Integer iIdRol;
    private Integer iIdEstatus;
    private String sUsername;
    private String sFechaCreacion;
    private String sFechaExpiracion;

    public TokenDTO(String sAccessToken, String sRefreshToken,Integer iIdUsuario,Integer iIdRol, Integer iIdEstatus, String sUsername, String sFechaCreacion, String sFechaExpiracion) {
        this.sAccessToken = sAccessToken;
        this.sRefreshToken = sRefreshToken;
        this.iIdUsuario = iIdUsuario;
        this.iIdRol = iIdRol;
        this.iIdEstatus = iIdEstatus;
        this.sUsername = sUsername;
        this.sFechaCreacion = sFechaCreacion;
        this.sFechaExpiracion = sFechaExpiracion;
    }
}
