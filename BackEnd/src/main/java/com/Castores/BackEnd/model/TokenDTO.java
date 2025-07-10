package com.Castores.BackEnd.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TokenDTO {
    private String sAccessToken;
    private String sRefreshToken;
    private Integer iIdUsuario;
    private Integer iIdRol;
    private Integer iIdEstatus;
    private String sUsername;
    private String sFechaCreacion;
    private String sFechaExpiracion;
}
