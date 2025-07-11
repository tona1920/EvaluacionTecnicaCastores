import { Injectable } from '@angular/core';
import { environmet } from '../../../environments/environmet';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';
import { ResponseAPI, Usuario, UsuarioDTO } from '../../models/producto';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  private API_URL = `${environmet.apiURL}api/usuarios`;
  
  constructor(private http: HttpClient) { }

  getUsuarios(): Observable<Usuario[]> {
    return this.http.get<ResponseAPI<Usuario[]>>(`${this.API_URL}/todos`).pipe(
      map(resp => {
        if (resp.icode !== 200) {
          throw new Error(resp.smensaje);
        }
        return resp.adata || [];
      })
    );
  }

  crearUsuario(user: UsuarioDTO): Observable<any> {
    return this.http.post(`${this.API_URL}/crear`, user).pipe(
    catchError(err => throwError(() => err))
    );
  }

  actualizarEstatus(user: UsuarioDTO): Observable<any> {
    return this.http.post(`${this.API_URL}/actualizar`, user).pipe(
    catchError(err => throwError(() => err))
    );
  }
}
