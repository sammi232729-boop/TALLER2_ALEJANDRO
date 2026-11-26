import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { CARGOS_OPCIONES, CargoUsuario } from '../../models/usuario.model';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    CardModule,
    InputTextModule,
    PasswordModule,
    DropdownModule,
    ButtonModule
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly messageService = inject(MessageService);

  readonly cargos = CARGOS_OPCIONES;
  readonly loading = signal(false);
  readonly errorMensaje = signal<string | null>(null);

  readonly registerForm = this.fb.nonNullable.group({
    identificacion: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(30)]],
    nombre: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
    apellido: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
    email: ['', [Validators.required, Validators.email]],
    cargo: ['Doctor' as CargoUsuario, [Validators.required]],
    telefono: ['', [Validators.required, Validators.minLength(7), Validators.maxLength(30)]],
    nombre_usuario: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(80)]],
    contrasena: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(128)]]
  });

  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.errorMensaje.set(null);

    this.authService.register(this.registerForm.getRawValue()).subscribe({
      next: (usuario) => {
        this.loading.set(false);
        this.messageService.add({
          severity: 'success',
          summary: 'Registro exitoso',
          detail: `Cuenta creada para ${usuario.nombre} ${usuario.apellido}. Ya puede iniciar sesión con su identificación (${usuario.identificacion}).`
        });
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.loading.set(false);
        const detail =
          err?.error?.detail ??
          'Ocurrió un error al registrar el usuario. Verifique los datos e intente nuevamente.';
        this.errorMensaje.set(detail);
        this.messageService.add({
          severity: 'error',
          summary: 'Error de registro',
          detail
        });
      }
    });
  }

  hasError(controlName: string): boolean {
    const control = this.registerForm.get(controlName);
    return Boolean(control && control.invalid && (control.dirty || control.touched));
  }
}
