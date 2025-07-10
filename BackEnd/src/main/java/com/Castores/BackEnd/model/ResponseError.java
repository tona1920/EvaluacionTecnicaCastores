package com.Castores.BackEnd.model;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ResponseError {
	private String sAtributo;
    private String sError;
    
    public ResponseError(String sAtributo, String sError) {
        this.sAtributo = sAtributo;
        this.sError = sError;
    }
}

