import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    CardModule,
    InputTextModule,
    PasswordModule,
    ButtonModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly messageService = inject(MessageService);

  readonly loading = signal(false);
  readonly errorMensaje = signal<string | null>(null);

  readonly loginForm = this.fb.nonNullable.group({
    identificacion: ['', [Validators.required, Validators.minLength(3)]],
    contrasena: ['', [Validators.required]]
  });

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.errorMensaje.set(null);

    this.authService.login(this.loginForm.getRawValue()).subscribe({
      next: (res) => {
        this.loading.set(false);
        this.messageService.add({
          severity: 'success',
          summary: 'Bienvenido',
          detail: `${res.usuario.nombre} ${res.usuario.apellido} (${res.usuario.cargo})`
        });
        this.router.navigate(['/usuarios']);
      },
      error: (err) => {
        this.loading.set(false);
        const detail =
          err?.error?.detail ??
          'No fue posible conectar con el servidor. Verifique que el API esté activo.';
        this.errorMensaje.set(detail);
        this.messageService.add({
          severity: err?.status === 403 ? 'warn' : 'error',
          summary: 'Acceso denegado',
          detail
        });
      }
    });
  }

  hasError(controlName: string): boolean {
    const control = this.loginForm.get(controlName);
    return Boolean(control && control.invalid && (control.dirty || control.touched));
  }
}
