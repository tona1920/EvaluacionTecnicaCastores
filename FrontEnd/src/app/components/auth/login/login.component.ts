import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  ReactiveFormsModule,
  FormBuilder,
  Validators,
  FormGroup,
} from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { AuthService } from '../../../services/auth/auth.service';
import { MessageService } from 'primeng/api';
import { take } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    PasswordModule,
    ButtonModule,
    DialogModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
form!: FormGroup;
  hidePassword = true;

  ngOnInit(): void {
    this.form = this.fb.group({
      usuario: ['', [Validators.required]],
      contrasena: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  constructor(
    private auth: AuthService,
    private fb: FormBuilder,
    private router: Router,
    private messageService: MessageService
  ) { }

  get f() {
    return this.form.controls;
  }

  login() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.auth
      .login(this.f['usuario'].value, this.f['contrasena'].value)
      .subscribe({
        next: (res) => {
          this.auth.userStatus$.pipe(take(1)).subscribe(estatus => {
            if (estatus === 1)  {
              this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'La operación se completó correctamente', life: 1500 });
              this.router.navigate(['/home']);
            } else {
              this.messageService.add({ severity: 'error', summary: 'Error al Iniciar Sesión', detail:'La cuenta esta inactiva.', life: 1500 });
              this.auth.logout();
              this.router.navigate(['/login']);
            }
          });
        },
        error: (err) => {
          this.messageService.add({ severity: 'error', summary: 'Error al Iniciar Sesión', detail: err.error?.smensaje || 'Error en el login.', life: 1500 });
        },
      });
  }
}
