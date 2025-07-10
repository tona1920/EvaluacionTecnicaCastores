import { Routes } from '@angular/router';
import { LoginComponent } from './components/auth/login/login.component';
import { SingUpComponent } from './components/auth/sing-up/sing-up.component';
import { HomeAdminComponent } from './components/admin/home-admin/home-admin.component';
import { AddProductoAdminComponent } from './components/admin/add-producto-admin/add-producto-admin.component';
import { AlmacenHomeComponent } from './components/almacenista/almacen-home/almacen-home.component';
import { AlmacenInventarioComponent } from './components/almacenista/almacen-inventario/almacen-inventario.component';

export const routes: Routes = [
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'sing-up', component: SingUpComponent },
    {
        path: 'admin', 
        children: [
            { path: 'home', component: HomeAdminComponent },
            { path: 'add-productos', component: AddProductoAdminComponent}
        ]
    },
    {
        path: 'almacenista',
        children: [
            { path: 'home', component: AlmacenHomeComponent },
            { path: 'inventario', component: AlmacenInventarioComponent },
        ]
    }
];
