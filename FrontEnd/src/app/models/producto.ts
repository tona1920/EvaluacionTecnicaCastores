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

export interface Rol {
  nombre: string;
  idRol: number;
}
export interface Rutas {
  nombre: string;
  ruta: string;
  icono: string;
}

export interface Usuario {
  idUsuario: number;
  nombre: string;
  correo: string;
  contrasena: string;
  idRol: number;
  rol: string; 
  estatus: boolean;
}

export interface UsuarioDTO {
  idUsuario: number;
  nombre: string;
  correo: string;
  idRol: number;
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
