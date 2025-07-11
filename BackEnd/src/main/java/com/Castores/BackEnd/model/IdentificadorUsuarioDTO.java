package com.Castores.BackEnd.model;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class IdentificadorUsuarioDTO {
    @NotNull(message = "El idUsuario no puede ser nulo")
    private Integer idUsuario;
}
