export interface Producto {
  idProducto: number;
  nombre: string;
  cantidad: number;
  precio: number;
  estatus: boolean;
}

export interface Historial {
  producto: string;
  accion: number;
  cantidad: number;
  fecha: string;
  usuario: string;
}

export interface Rutas {
  nombre: string;
  ruta: string;
  icono: string;
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

export interface ProductoRequest {
  idProducto: number;
  idUsuario: number;
  nombre?: string;
  cantidad?: number;
  precio?: number;
  comentario?: string;
  estatus?: boolean;
  accion: number;
}
