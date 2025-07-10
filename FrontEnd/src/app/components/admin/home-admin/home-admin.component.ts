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

  loading: boolean = true;
  visible: boolean = false;
  estatusSeleccionado!: boolean;
  mostrarDialogoStock: boolean = false;
  mostrarDialogoEstatus: boolean = false;
  cantidadAgregar: number = 0;

  form!: FormGroup;

  constructor(
  private service: ProductosService, 
  private router:Router,  
  private messageService: MessageService,
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
  if (this.cantidadAgregar <= 0) {
    this.messageService.add({
      severity: 'warn',
      summary: 'Cantidad inválida',
      detail: 'Debes ingresar una cantidad mayor a 0'
    });
    return;
  }
    /*
    this.productosService.agregarStock(this.idSeleccionado, this.cantidadAgregar).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Stock actualizado',
          detail: 'El stock se actualizó correctamente'
        });
        this.mostrarDialogoStock = false;
        this.cantidadAgregar = 0;
        this.cargarProductos(); // Refresca la tabla
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo actualizar el stock'
        });
      }
    });*/
  }

  cambiarEstatusProducto(): void {
    const nuevoEstatus = !this.estatusSeleccionado;
    const justificacion=  this.justificacionCambio ||'';
    /*
    this.productosService.cambiarEstatus(this.idSeleccionado, nuevoEstatus).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Estatus actualizado',
          detail: `El producto ha sido ${nuevoEstatus ? 'activado' : 'desactivado'}`
        });
        this.mostrarDialogoEstatus = false;
        this.cargarProductos(); // Refresca la tabla
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo cambiar el estatus del producto'
        });
      }
    });*/
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
}
