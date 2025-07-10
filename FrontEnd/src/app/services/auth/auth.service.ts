import { Injectable } from '@angular/core';
import { environmet } from '../../../environments/environmet';
import { BehaviorSubject, catchError, Observable, tap, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private API_URL = `${environmet.apiURL}api/auth`;
  private authStatus = new BehaviorSubject<boolean>(this.isTokenValid());
  authStatus$ = this.authStatus.asObservable();

  private userStatus = new BehaviorSubject<number>(parseInt(localStorage.getItem('estatus') || '0', 10));
  userStatus$ = this.userStatus.asObservable();
  
  constructor(private http: HttpClient) { }
  
  login(sUsername: string, sPasword: string): Observable<any> {
    return this.http.post<any>(`${this.API_URL}/login`, { susername: sUsername, spassword: sPasword}).pipe(
      tap(response =>{
          this.authStatus.next(false);
          if (response?.icode === 200 && response.adata?.saccessToken) {
            this.authStatus.next(true);
            // Guardar el accessToken en localStorage
            localStorage.setItem('access_token', response.adata.saccessToken);
            // Opcional: también puedes guardar el refreshToken
            localStorage.setItem('refresh_token', response.adata.srefreshToken);
            // (Opcional) Guardar usuario o rol
            localStorage.setItem('user_id', response.adata.iidUsuario);
            localStorage.setItem('username', response.adata.susername);
            localStorage.setItem('rol_id', response.adata.iidRol);
            this.userStatus.next(response.adata.iidEstatus || -1);
            localStorage.setItem('estatus', response.adata.iidEstatus?.toString() || '-1');

          }
      }),
      catchError(err => {
        this.authStatus.next(false);
        this.userStatus.next(-1);
        return throwError(() => err);
      })
    );
  }

  refreshToken() {
    const refreshToken = localStorage.getItem('refresh_token');
    return this.http.post<any>(`${this.API_URL}/refresh`, {
      srefreshToken: refreshToken
    });
  }

  setAccessToken(token: string) {
    localStorage.setItem('access_token', token);
  }

  getAccessToken(): string | null {
    return localStorage.getItem('access_token');
  } 
  
  getUsername(): string {
    const user = localStorage.getItem('username');
    return user || '';
  }
  getUserRol(): string | null {
    return localStorage.getItem('rol_id');
  }  
  
  getUserId(): number {
    const value = localStorage.getItem('user_id');

    if (value === null) {
      return -1;
    }
    const parsed = parseInt(value, 10);
    return isNaN(parsed) ? -1 : parsed;
  }

  logout() {
    this.userStatus.next(0);
    this.authStatus.next(false);
    localStorage.clear();
  }

  setUserStatus(status: number): void {
    this.userStatus.next(status);
    localStorage.setItem('estatus', status.toString());
  }
  
  isTokenValid(): boolean {
    const token = localStorage.getItem('access_token');
    if (!token) return false;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const now = Math.floor(Date.now() / 1000); // tiempo actual en segundos
      return payload.exp > now; // true si no ha expirado
    } catch {
      return false;
    }
  };


}
