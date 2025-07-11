import { Injectable } from '@angular/core';
import { environmet } from '../../../environments/environmet';
import { HttpClient } from '@angular/common/http';
import { Historial, Producto, ProductoRequest, ResponseAPI } from '../../models/producto';
import { catchError, map, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductosService {

  private API_URL = `${environmet.apiURL}api/productos`;
  
  constructor(private http: HttpClient) { }

  getProductosActivos(): Observable<Producto[]> {
    return this.http.get<ResponseAPI<Producto[]>>(`${this.API_URL}/activos`).pipe(
      map(resp => {
        if (resp.icode !== 200) {
          throw new Error(resp.smensaje);
        }
        return resp.adata || [];
      })
    );
  }

  getProductosTodos(): Observable<Producto[]> {
    return this.http.get<ResponseAPI<Producto[]>>(`${this.API_URL}/todos`).pipe(
      map(resp => {
        if (resp.icode !== 200) {
          throw new Error(resp.smensaje);
        }
        return resp.adata || [];
      })
    );
  }

  getHistorico(): Observable<Historial[]> {
    return this.http.get<ResponseAPI<Historial[]>>(`${this.API_URL}/historial`).pipe(
      map(resp => {
        if (resp.icode !== 200) {
          throw new Error(resp.smensaje);
        }
        return resp.adata || [];
      })
    );
  }

  ejecutarAccion(dto: ProductoRequest): Observable<any> {
    return this.http.post(`${this.API_URL}/accion`, dto).pipe(
      catchError(err => throwError(() => err))
    );
  }
  crearProducto(producto: Producto): Observable<any> {
    return this.http.post(`${this.API_URL}/crear`, producto).pipe(
    catchError(err => throwError(() => err))
  );
  }
}
