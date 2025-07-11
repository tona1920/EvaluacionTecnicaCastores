import { Routes } from '@angular/router';
import { LoginComponent } from './components/auth/login/login.component';
import { HomeAdminComponent } from './components/admin/home-admin/home-admin.component';
import { AddProductoAdminComponent } from './components/admin/add-producto-admin/add-producto-admin.component';
import { AlmacenHomeComponent } from './components/almacenista/almacen-home/almacen-home.component';
import { noAuthGuard } from './guard/noAuth/no-auth.guard';
import { authGuard } from './guard/auth/auth.guard';
import { HomeComponent } from './components/home/home/home.component';
import { NotFoundComponent } from './components/shared/not-found/not-found.component';
import { UsuariosComponent } from './components/admin/usuarios/usuarios.component';

export const routes: Routes = [
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent, canActivate: [noAuthGuard] },
     { path: "home", component: HomeComponent, canActivate: [authGuard] },
    {
        path: 'administrador', 
        children: [
            { path: 'home', component: HomeAdminComponent },
            { path: 'historico', component: AddProductoAdminComponent},
            { path: 'usuarios', component: UsuariosComponent}
        ], 
        canActivate: [authGuard],
        data: { roles: ['1'] }
    },
    {
        path: 'almacen',
        children: [
            { path: 'home', component: AlmacenHomeComponent },
        ], 
        canActivate: [authGuard],
        data: { roles: ['2'] }
    },
    { path: "**", component: NotFoundComponent }

];
