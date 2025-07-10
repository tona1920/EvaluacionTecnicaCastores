package com.Castores.BackEnd.model;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class Login {
	@NotBlank(message = "El username es obligatorio.")
    private String sUsername;
	
	@NotBlank(message = "El password es obligatorio.")
    private String sPassword;
}
