import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { ProductosService } from '../../../services/productos/productos.service';

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
import { Producto, ProductoRequest } from '../../../models/producto';
import { AuthService } from '../../../services/auth/auth.service';

@Component({
  selector: 'app-home-admin',
  imports: [
    CommonModule,
    ButtonModule,
    Dialog,
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
    FloatLabelModule
  ],
  templateUrl: './home-admin.component.html',
  styleUrl: './home-admin.component.scss'
})
export class HomeAdminComponent {
  productos: any[] = [];
  searchValue: string = '';
  idSeleccionado!: number;
  nombreSeleccionado: string = '';
  justificacionCambio: string = '';

  cargando = false;
  loading: boolean = true;
  visible: boolean = false;
  estatusSeleccionado!: boolean;

  mostrarDialogoStock: boolean = false;
  mostrarDialogoEstatus: boolean = false;
  mostrarDialogoModificar: boolean = false;
  
  cantidadAgregar: number = 0;

  form!: FormGroup;

  constructor(
  private service: ProductosService, 
  private router:Router,  
  private messageService: MessageService,
  private authService : AuthService,
  private fb: FormBuilder){}

  ngOnInit() {
    
    this.obtenerProductos();
    this.form = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      cantidad: [0, [Validators.required, Validators.min(0)]],
      precio: [0.00, [Validators.required, Validators.min(1)]]
    });
  }
  
  filtrarGlobal(event: any, table: any) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  clear(table: Table) {
    table.clear();
    this.searchValue = ''
  }

    // LANZAR EL MODAL (DIALOG)
  showDialog() {
    this.visible = true;
    this.form.reset({
      nombre: '',
      cantidad: 0,
      precio: 0.00
    });
  }

  abrirDialogoAgregarStock(id: number, nombre: string): void {
    this.idSeleccionado = id;
    this.nombreSeleccionado = nombre;
    this.cantidadAgregar = 0;
    this.mostrarDialogoStock = true;
  }

  abrirDialogo(producto: Producto): void {
    this.idSeleccionado = producto.idProducto;
    this.form.reset({
            nombre: producto.nombre,
            cantidad: producto.cantidad,
            precio: producto.precio,
            estatus: true
          });
    this.mostrarDialogoModificar = true;
  }

  abrirDialogoEstatus(id: number, nombre: string, estatus: boolean): void {
    this.idSeleccionado = id;
    this.nombreSeleccionado = nombre;
    this.estatusSeleccionado = estatus;
    this.justificacionCambio = '';
    this.mostrarDialogoEstatus = true;
  }

  guardar(): void {
    if (this.form.valid) {
      const producto = this.form.value;

      this.service.crearProducto(producto).subscribe({
        next: (resp) => {
          this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Producto creado' });
          this.visible = false;
          this.form.reset({
            nombre: '',
            cantidad: 0,
            precio: 0.00,
            estatus: true
          });
          
          this.obtenerProductos();
        },
        error: (err) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo guardar el producto' });
        }
      });
    } else {
      this.messageService.add({ severity: 'warn', summary: 'Formulario inválido', detail: 'Completa todos los campos' });
    }
  }

  confirmarAgregarStock(): void {
    if (this.cargando) return;
    if (this.cantidadAgregar <= 0) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Cantidad inválida',
        detail: 'Debes ingresar una cantidad mayor a 0'
      });
      return;
    }
    this.cargando = true;
    const dto: ProductoRequest = {
      idProducto: this.idSeleccionado,
      idUsuario: this.authService.getUserId(),
      nombre: '',
      cantidad: this.cantidadAgregar,
      precio: 1,
      comentario: '' , 
      estatus: false,
      accion: 3 // acción: actualizar producto
    }; 

  this.service.ejecutarAccion(dto).subscribe({
    next: () => {
      this.messageService.add({
        severity: 'success',
        summary: 'Stock actualizado',
        detail: 'El stock se actualizó correctamente'
      });
      this.mostrarDialogoStock = false;
      this.obtenerProductos(); // Refresca la tabla
      this.cargando = false;
    },
    error: (err) => {
      this.cargando = false;
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

  guardarModificacion(): void {
    if (!this.form.valid)  {
      this.messageService.add({ severity: 'warn', summary: 'Formulario inválido', detail: 'Completa todos los campos' });
      return;
    }
    const producto = this.form.value;
   
    const dto: ProductoRequest = {
      idProducto: this.idSeleccionado,
      idUsuario: this.authService.getUserId(),
      nombre: producto.nombre,
      cantidad: producto.cantidad,
      precio: producto.precio,
      comentario: '' , 
      estatus: false,
      accion: 1 // acción: actualizar producto
    }; 

  this.service.ejecutarAccion(dto).subscribe({
    next: () => {
      this.messageService.add({
        severity: 'success',
        summary: 'Producto actualizado',
        detail: 'El producto se actualizó correctamente'
      });
      this.mostrarDialogoModificar = false;
      this.obtenerProductos(); // Refresca la tabla
    },
    error: (err) => {
      this.cargando = false;
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
          detail: 'No se pudo actualizar el producto'
        });
      }
    }
    });
  }

  cambiarEstatusProducto(): void {
    const dto: ProductoRequest = {
      idProducto: this.idSeleccionado,
      idUsuario: this.authService.getUserId(),
      nombre: '',
      cantidad: 0,
      precio: 1,
      comentario: this.justificacionCambio ||'' , 
      estatus:  !this.estatusSeleccionado,
      accion: 2
    };

        console.log(dto);
    this.service.ejecutarAccion(dto).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Estatus actualizado',
          detail: `El producto ha sido ${!this.estatusSeleccionado ? 'activado' : 'desactivado'}`
        });
        this.mostrarDialogoEstatus = false;
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

  obtenerProductos(){
    this.service.getProductosTodos().subscribe({
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
  
}
