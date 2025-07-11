import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {
  ReactiveFormsModule,
  FormsModule,
  FormGroup,
  FormBuilder,
  Validators,
} from '@angular/forms';
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
import { UsuariosService } from '../../../services/usuarios/usuarios.service';
import { AuthService } from '../../../services/auth/auth.service';
import { Rol, Usuario, UsuarioDTO } from '../../../models/producto';

@Component({
  selector: 'app-usuarios',
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
    Dialog,
  ],
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.scss',
})
export class UsuariosComponent {
  usuarios: any[] = [];

  roles: Rol[] = [
    { nombre: 'Administrador', idRol: 1 },
    { nombre: 'Almacenista', idRol: 2 },
  ];
  searchValue: string = '';
  idSeleccionado!: number;
  nombreSeleccionado: string = '';

  mostrarDialogoPassword: boolean = false;
  passwordGenerada: string = '';
  nombreUsuario: string = '';

  loading: boolean = true;
  visible: boolean = false;
  estatusSeleccionado!: boolean;

  mostrarDialogoEstatus: boolean = false;
  mostrarDialogoModificar: boolean = false;

  form!: FormGroup;
  constructor(
    private service: UsuariosService,
    private router: Router,
    private messageService: MessageService,
    private authService: AuthService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.obtenerProductos();
    this.form = this.fb.group({
      nombre: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(50),
        ],
      ],
      correo: ['', [Validators.required, Validators.email]],
      idRol: [null, [Validators.required, Validators.min(1)]],
    });
  }

  filtrarGlobal(event: any, table: any) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  clear(table: Table) {
    table.clear();
    this.searchValue = '';
  }

  showDialog() {
    this.visible = true;
    this.form.reset();
  }
  abrirDialogo(user: Usuario): void {
    this.idSeleccionado = user.idUsuario;
    this.form.reset({
      nombre: user.nombre,
      correo: user.correo,
      idRol: user.idRol,
    });
    this.mostrarDialogoModificar = true;
  }

  abrirDialogoEstatus(id: number, nombre: string, estatus: boolean): void {
    this.idSeleccionado = id;
    this.nombreSeleccionado = nombre;
    this.estatusSeleccionado = estatus;
    this.mostrarDialogoEstatus = true;
  }

  obtenerProductos() {
    this.service.getUsuarios().subscribe({
      next: (data) => {
        this.usuarios = data.map((p) => ({
          ...p,
          estatusTexto: p.estatus ? 'Activo' : 'Inactivo',
        }));
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error al cargar productos',
          detail: err.message || 'Ocurrió un error inesperado.',
          life: 3000,
        });
      },
    });
  }

  reset() {
    this.obtenerProductos();
  }

  guardar(): void {
    if (this.form.valid) {
      const form = this.form.value;

      const user: UsuarioDTO = {
        idUsuario: 0,
        nombre: form.nombre,
        correo: form.correo,
        idRol: form.idRol,
        estatus: true,
      };
      this.service.crearUsuario(user).subscribe({
        next: (resp) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Usuario creado',
          });

          this.passwordGenerada = resp.adata.sPassword;
          this.nombreUsuario = resp.adata.sUsername;
          this.mostrarDialogoPassword = true;

          this.visible = false;
          this.form.reset();
          this.obtenerProductos();
        },
        error: (err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudo crear el usuario.',
          });
        },
      });
    } else {
      this.messageService.add({
        severity: 'warn',
        summary: 'Formulario inválido',
        detail: 'Completa todos los campos',
      });
    }
  }

  cambiarEstatus(): void {
    const user: UsuarioDTO = {
      idUsuario: this.idSeleccionado,
      nombre: 'nombre',
      correo: 'correo@gmail.com',
      idRol: 1,
      estatus: !this.estatusSeleccionado,
    };
    this.service.actualizarEstatus(user).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Estatus actualizado',
          detail: `El usuario ha sido ${
            !this.estatusSeleccionado ? 'activado' : 'desactivado'
          }`,
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
              detail: mensaje,
            });
          });
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudo actualizar el usuario',
          });
        }
      },
    });
  }
}
