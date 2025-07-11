import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem, MessageService } from 'primeng/api';
import { Menubar } from 'primeng/menubar';
import { SplitButton } from 'primeng/splitbutton';
import { Toolbar } from 'primeng/toolbar';
import { AuthService } from '../../../services/auth/auth.service';
import { combineLatest, Observable } from 'rxjs';
import { PagesService } from '../../../services/pages/pages.service';
import { Rutas } from '../../../models/producto';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule, Toolbar, SplitButton, Menubar],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent implements OnInit {
  userOptions: MenuItem[] = [];
  menuDinamicItems: MenuItem[] = [];
  authStatus$: Observable<boolean>;
  userStatus$: Observable<number>;
  estatus: number = 0;
  nombre: string = 'user';

  constructor(
    private router: Router,
    private authService: AuthService,
    private pagesService: PagesService,
    private messageService: MessageService
  ) {
    this.authStatus$ = this.authService.authStatus$;
    this.userStatus$ = this.authService.userStatus$;
  }

  ngOnInit() {
    this.menuDinamicItems = [];

    combineLatest([this.authStatus$, this.userStatus$]).subscribe(
      ([isAuthenticated, estatus]) => {
        this.estatus = estatus;

        if (isAuthenticated) {
          this.nombre = this.authService.getUsername();
          // Mostrar siempre el menú de usuario
          this.userOptions = [
            {
              label: 'Perfil',
              icon: 'pi pi-user',
              command: () => this.irAlPerfil(),
            },
            {
              label: 'Cerrar sesión',
              icon: 'pi pi-sign-out',
              command: () => this.cerrarSesion(),
            },
          ];
          if (isAuthenticated && estatus === 1) {
          const userId = this.authService.getUserId();
          this.pagesService.obtenerRutas(userId).subscribe({
            next: (rutas: Rutas[]) => {
              console.log(rutas);
              this.menuDinamicItems = this.convertirRutasAMenu(rutas);
            },
            error: (err) => {
              console.log(err)
              this.messageService.add({
                severity: 'error',
                summary: 'Error al obtener rutas',
                detail: err.message || 'Error desconocido al obtener rutas.',
                life: 2500,
              });
            }
          });
          }
          
        } else {
          this.userOptions = [];
          this.menuDinamicItems = [];
          this.nombre = 'user';
        }
      }
    );
  }

  cerrarSesion() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
  irAlPerfil() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  private convertirRutasAMenu(rutas: Rutas[]): MenuItem[] {
    return rutas.map((ruta) => ({
      label: ruta.nombre,
      icon: ruta.icono,
      routerLink: ruta.ruta
    }));
  }
}
