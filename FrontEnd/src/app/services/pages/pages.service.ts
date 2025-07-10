import { Injectable } from '@angular/core';
import { environmet } from '../../../environments/environmet';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PagesService {
  private API_URL = `${environmet.apiURL}api/usuarios`;

  constructor(private http: HttpClient) {}

  obtenerRutas(idUser: number): Observable<any> {
    return this.http.post<any>(`${this.API_URL}/obtener_rutas`, { idUsuario: idUser }).pipe(
      catchError(err => throwError(() => err))
    );
  }
}
