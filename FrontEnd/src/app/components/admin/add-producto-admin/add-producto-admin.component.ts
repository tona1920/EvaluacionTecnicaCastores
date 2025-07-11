import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReactiveFormsModule, FormsModule} from '@angular/forms';

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
  selector: 'app-add-producto-admin',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    ButtonModule,
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
  templateUrl: './add-producto-admin.component.html',
  styleUrl: './add-producto-admin.component.scss'
})
export class AddProductoAdminComponent {
  productos: any[] = [];
  searchValue: string = '';
  loading: boolean = true;

  constructor(
  private service: ProductosService, 
  private messageService: MessageService){}
 
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

  reset() {
    this.obtenerProductos();
  }
  
  obtenerProductos(){
    this.service.getHistorico().subscribe({
      next: data => {
        this.productos = data.map(p => ({
          ...p,
          estatusTexto: p.accion == 1 ? 'Entrada' : 'Salida'
        }));
        this.loading = false;
        console.log(this.productos);
        
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
