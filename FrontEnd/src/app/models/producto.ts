export interface Producto {
    idProducto: number;
    nombre: string;
    cantidad: number;
    precio: number; 
    estatus: boolean;
}

export interface ResponseAPI<T> {
  icode: number;
  smensaje: string;
  adata: T;
  aerrores?: ResponseError[];
}

export interface ResponseError {
  atributo: string;
  error: string;
}