import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { Dialog } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { SelectModule } from 'primeng/select';
import { InputNumberModule } from 'primeng/inputnumber';
import { Table, TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { MultiSelectModule } from 'primeng/multiselect';
import { MessageService } from 'primeng/api';
import { FloatLabelModule } from 'primeng/floatlabel';
import { ProductoRequest } from '../../../models/producto';
import { AuthService } from '../../../services/auth/auth.service';
import { ProductosService } from '../../../services/productos/productos.service';

@Component({
  selector: 'app-almacen-home',
  imports: [
    CommonModule,
    ButtonModule,
    ReactiveFormsModule,
    FormsModule,
    InputGroupModule,
    InputGroupAddonModule,
    TableModule,
    TagModule,
    IconFieldModule,
    InputIconModule,
    InputTextModule,
    SelectModule,
    InputNumberModule,
    MultiSelectModule,
    FloatLabelModule,
    Dialog
  ],
  templateUrl: './almacen-home.component.html',
  styleUrl: './almacen-home.component.scss'
})
export class AlmacenHomeComponent {
  productos: any[] = [];
  searchValue: string = '';
  idSeleccionado!: number;
  nombreSeleccionado: string = '';
  justificacionCambio: string = '';
  loading: boolean = true;
  cantidadAgregar: number = 0;

  mostrarDialogoVentas: boolean = false;

  constructor(
  private service: ProductosService, 
  private router:Router,  
  private messageService: MessageService,
  private authService : AuthService,
  private fb: FormBuilder){}

  ngOnInit() {
    
    this.obtenerProductos();
    
  }

  filtrarGlobal(event: any, table: any) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  clear(table: Table) {
    table.clear();
    this.searchValue = ''
  }

  obtenerProductos(){
    this.service.getProductosActivos().subscribe({
      next: data => {
        this.productos = data.map(p => ({
          ...p,
          estatusTexto: p.estatus ? 'Activo' : 'Inactivo'
        }));
        this.loading = false;
        
      },
      error: err => {
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error al cargar productos',
          detail: err.message || 'Ocurrió un error inesperado.',
          life: 3000
        });
      }
    });
  }

  reset() {
    this.obtenerProductos();
  }
  
  abrirDialogoAgregarVentas(id: number, nombre: string): void {
    this.idSeleccionado = id;
    this.nombreSeleccionado = nombre;
    this.cantidadAgregar = 0;
    this.mostrarDialogoVentas = true;
  }

  confirmarAgregarVentas(): void {
    if (this.cantidadAgregar <= 0) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Cantidad inválida',
        detail: 'Debes ingresar una cantidad mayor a 0'
      });
      return;
    }
    const dto: ProductoRequest = {
      idProducto: this.idSeleccionado,
      idUsuario: this.authService.getUserId(),
      nombre: '',
      cantidad: this.cantidadAgregar,
      precio: 1,
      comentario: '' , 
      estatus: false,
      accion: 4 // acción: actualizar producto
    }; 

  this.service.ejecutarAccion(dto).subscribe({
    next: () => {
      this.messageService.add({
        severity: 'success',
        summary: 'Estatus actualizado',
        detail: 'El stock se actualizó correctamente'
      });
      this.mostrarDialogoVentas = false;
      this.obtenerProductos(); // Refresca la tabla
    },
    error: (err) => {
      const errores = err?.error?.aerrores;
      if (Array.isArray(errores)) {
        errores.forEach((e: any) => {
          const sumary = e?.satributo || 'Error desconocido';
          const mensaje = e?.serror || 'Error desconocido';
          this.messageService.add({
            severity: 'error',
            summary: sumary,
            detail: mensaje
          });
        });
      } else {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo actualizar el stock'
        });
      }
    }
    });
  }
}
