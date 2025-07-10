package com.Castores.BackEnd.model;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonInclude;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@JsonInclude(JsonInclude.Include.NON_NULL)
public class Response<T> {
	private int iCode;
    private String sMensaje;
    private T aData;
    private List<ResponseError> aErrores;
    
    public Response(int iCode, String sMensaje, T data) {
        this.iCode = iCode;
        this.sMensaje = sMensaje;
        this.aData = data;
        this.aErrores = null;
    }

    public Response(int iCode, String sMensaje, List<ResponseError> aErrores) {
        this.iCode = iCode;
        this.sMensaje = sMensaje;
        this.aErrores = aErrores;
        this.aData = null;
    }
}

