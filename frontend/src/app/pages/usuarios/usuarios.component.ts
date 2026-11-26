import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToolbarModule } from 'primeng/toolbar';
import { TooltipModule } from 'primeng/tooltip';
import {
  CARGOS_OPCIONES,
  CargoUsuario,
  ESTADOS_OPCIONES,
  EstadoUsuario,
  Usuario
} from '../../models/usuario.model';
import { AuthService } from '../../services/auth.service';
import { UsuarioService } from '../../services/usuario.service';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ToolbarModule,
    CardModule,
    TableModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    PasswordModule,
    DropdownModule,
    TagModule,
    TooltipModule
  ],
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.css'
})
export class UsuariosComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly usuarioService = inject(UsuarioService);
  private readonly authService = inject(AuthService);
  private readonly messageService = inject(MessageService);
  private readonly confirmationService = inject(ConfirmationService);
  private readonly router = inject(Router);

  readonly cargos = CARGOS_OPCIONES;
  readonly estados = ESTADOS_OPCIONES;

  readonly usuarios = signal<Usuario[]>([]);
  readonly loading = signal(false);
  readonly saving = signal(false);
  readonly dialogVisible = signal(false);
  readonly editingUserId = signal<number | null>(null);
  readonly currentUser = signal<Usuario | null>(this.authService.getCurrentUser());
  readonly isAdmin = computed(() => this.currentUser()?.cargo === 'Administrativo');

  readonly totalUsuarios = computed(() => this.usuarios().length);
  readonly totalActivos = computed(
    () => this.usuarios().filter((u) => u.estado === 'Activado').length
  );
  readonly totalDesactivados = computed(
    () => this.usuarios().filter((u) => u.estado === 'Desactivado').length
  );
  readonly totalMedicos = computed(
    () => this.usuarios().filter((u) => u.cargo === 'Doctor' || u.cargo === 'Especialista').length
  );

  readonly usuarioForm = this.fb.nonNullable.group({
    identificacion: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(30)]],
    nombre: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
    apellido: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
    email: ['', [Validators.required, Validators.email]],
    cargo: ['Doctor' as CargoUsuario, [Validators.required]],
    telefono: ['', [Validators.required, Validators.minLength(7), Validators.maxLength(30)]],
    nombre_usuario: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(80)]],
    contrasena: [''],
    estado: ['Activado' as EstadoUsuario, [Validators.required]]
  });

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  cargarUsuarios(): void {
    this.loading.set(true);
    this.usuarioService.listar().subscribe({
      next: (data) => {
        this.usuarios.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.messageService.add({
          severity: 'error',
          summary: 'Error de conexión',
          detail: 'No se pudo obtener la lista de usuarios desde la API.'
        });
      }
    });
  }

  abrirNuevo(): void {
    this.editingUserId.set(null);
    this.usuarioForm.reset({
      identificacion: '',
      nombre: '',
      apellido: '',
      email: '',
      cargo: 'Doctor',
      telefono: '',
      nombre_usuario: '',
      contrasena: '',
      estado: 'Activado'
    });
    const pwdControl = this.usuarioForm.get('contrasena');
    pwdControl?.setValidators([Validators.required, Validators.minLength(6), Validators.maxLength(128)]);
    pwdControl?.updateValueAndValidity();
    this.dialogVisible.set(true);
  }

  abrirEditar(usuario: Usuario): void {
    if (!this.isAdmin()) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Permiso denegado',
        detail: 'Solo los usuarios administrativos pueden editar usuarios.'
      });
      return;
    }
    this.editingUserId.set(usuario.id);
    this.usuarioForm.reset({
      identificacion: usuario.identificacion,
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      email: usuario.email,
      cargo: usuario.cargo,
      telefono: usuario.telefono,
      nombre_usuario: usuario.nombre_usuario,
      contrasena: '',
      estado: usuario.estado
    });
    const pwdControl = this.usuarioForm.get('contrasena');
    pwdControl?.setValidators([Validators.minLength(6), Validators.maxLength(128)]);
    pwdControl?.updateValueAndValidity();
    this.dialogVisible.set(true);
  }

  guardarUsuario(): void {
    if (this.usuarioForm.invalid) {
      this.usuarioForm.markAllAsTouched();
      return;
    }

    this.saving.set(true);
    const raw = this.usuarioForm.getRawValue();
    const editId = this.editingUserId();

    if (editId !== null && !this.isAdmin()) {
      this.saving.set(false);
      this.dialogVisible.set(false);
      this.messageService.add({
        severity: 'warn',
        summary: 'Permiso denegado',
        detail: 'Solo los usuarios administrativos pueden editar usuarios.'
      });
      return;
    }

    if (editId === null) {
      this.usuarioService.crear(raw).subscribe({
        next: () => {
          this.saving.set(false);
          this.dialogVisible.set(false);
          this.messageService.add({
            severity: 'success',
            summary: 'Usuario creado',
            detail: 'La cuenta se guardó correctamente en la base de datos.'
          });
          this.cargarUsuarios();
        },
        error: (err) => this.handleApiError(err, 'No se pudo crear el usuario.')
      });
      return;
    }

    const updatePayload = {
      identificacion: raw.identificacion,
      nombre: raw.nombre,
      apellido: raw.apellido,
      email: raw.email,
      cargo: raw.cargo,
      telefono: raw.telefono,
      nombre_usuario: raw.nombre_usuario,
      estado: raw.estado,
      ...(raw.contrasena.trim() ? { contrasena: raw.contrasena.trim() } : {})
    };

    this.usuarioService.actualizar(editId, updatePayload).subscribe({
      next: () => {
        this.saving.set(false);
        this.dialogVisible.set(false);
        this.messageService.add({
          severity: 'success',
          summary: 'Usuario actualizado',
          detail: 'Los cambios fueron guardados correctamente.'
        });
        this.cargarUsuarios();
      },
      error: (err) => this.handleApiError(err, 'No se pudo actualizar el usuario.')
    });
  }

  toggleEstado(usuario: Usuario): void {
    if (!this.isAdmin()) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Permiso denegado',
        detail: 'Solo los usuarios administrativos pueden activar o desactivar usuarios.'
      });
      return;
    }
    const nuevoEstado: EstadoUsuario =
      usuario.estado === 'Activado' ? 'Desactivado' : 'Activado';

    this.usuarioService.cambiarEstado(usuario.id, nuevoEstado).subscribe({
      next: (actualizado) => {
        this.usuarios.update((lista) =>
          lista.map((u) => (u.id === actualizado.id ? actualizado : u))
        );
        this.messageService.add({
          severity: nuevoEstado === 'Activado' ? 'success' : 'warn',
          summary: 'Estado actualizado',
          detail: `${actualizado.nombre} ${actualizado.apellido} ahora está ${actualizado.estado}.`
        });
      },
      error: (err) => this.handleApiError(err, 'No se pudo cambiar el estado del usuario.')
    });
  }

  canDeleteUsuario(usuario: Usuario): boolean {
    return (
      this.isAdmin() &&
      usuario.cargo !== 'Administrativo' &&
      usuario.id !== this.currentUser()?.id
    );
  }

  confirmarEliminar(usuario: Usuario): void {
    if (!this.isAdmin()) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Permiso denegado',
        detail: 'Solo los usuarios administrativos pueden eliminar usuarios.'
      });
      return;
    }
    if (usuario.cargo === 'Administrativo' || usuario.id === this.currentUser()?.id) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Acción no permitida',
        detail: 'No se puede eliminar un usuario administrativo ni la cuenta con sesión activa.'
      });
      return;
    }
    this.confirmationService.confirm({
      message: `¿Está seguro de eliminar permanentemente a ${usuario.nombre} ${usuario.apellido} (ID: ${usuario.identificacion})?`,
      header: 'Confirmar eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí, eliminar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.usuarioService.eliminar(usuario.id).subscribe({
          next: () => {
            this.usuarios.update((lista) => lista.filter((u) => u.id !== usuario.id));
            this.messageService.add({
              severity: 'success',
              summary: 'Usuario eliminado',
              detail: 'El registro fue eliminado de la base de datos.'
            });
          },
          error: (err) => this.handleApiError(err, 'No se pudo eliminar el usuario.')
        });
      }
    });
  }

  cerrarSesion(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  getCargoSeverity(cargo: CargoUsuario): 'info' | 'success' | 'warning' {
    switch (cargo) {
      case 'Doctor':
        return 'info';
      case 'Especialista':
        return 'success';
      case 'Administrativo':
        return 'warning';
    }
  }

  hasError(controlName: string): boolean {
    const control = this.usuarioForm.get(controlName);
    return Boolean(control && control.invalid && (control.dirty || control.touched));
  }

  private handleApiError(err: { error?: { detail?: string } }, fallback: string): void {
    this.saving.set(false);
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: err?.error?.detail ?? fallback
    });
  }
}
