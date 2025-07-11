import { Injectable } from '@angular/core';
import { environmet } from '../../../environments/environmet';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';
import { ResponseAPI, Rutas } from '../../models/producto';

@Injectable({
  providedIn: 'root'
})
export class PagesService {
  private API_URL = `${environmet.apiURL}api/usuarios`;

  constructor(private http: HttpClient) {}

  obtenerRutas(idUser: number): Observable<Rutas[]> {
    return this.http.post<ResponseAPI<Rutas[]>>(`${this.API_URL}/rutas`, { idUsuario: idUser }).pipe(
      map(resp => {
          if (resp.icode !== 200) {
            throw new Error(resp.smensaje);
          }
          return resp.adata || [];
        })
      );
  }
}
