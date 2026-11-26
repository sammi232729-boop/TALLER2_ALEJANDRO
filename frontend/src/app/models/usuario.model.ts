export type CargoUsuario = 'Doctor' | 'Especialista' | 'Administrativo';
export type EstadoUsuario = 'Activado' | 'Desactivado';

export interface Usuario {
  id: number;
  identificacion: string;
  nombre: string;
  apellido: string;
  email: string;
  cargo: CargoUsuario;
  telefono: string;
  nombre_usuario: string;
  estado: EstadoUsuario;
  fecha_creacion?: string;
  fecha_actualizacion?: string;
}

export interface LoginPayload {
  identificacion: string;
  contrasena: string;
}

export interface LoginResponse {
  mensaje: string;
  usuario: Usuario;
}

export interface RegisterPayload {
  identificacion: string;
  nombre: string;
  apellido: string;
  email: string;
  cargo: CargoUsuario;
  telefono: string;
  nombre_usuario: string;
  contrasena: string;
}

export interface UsuarioPayload extends RegisterPayload {
  estado: EstadoUsuario;
}

export interface UsuarioUpdatePayload {
  identificacion: string;
  nombre: string;
  apellido: string;
  email: string;
  cargo: CargoUsuario;
  telefono: string;
  nombre_usuario: string;
  contrasena?: string;
  estado: EstadoUsuario;
}

export const CARGOS_OPCIONES: { label: string; value: CargoUsuario }[] = [
  { label: 'Doctor', value: 'Doctor' },
  { label: 'Especialista', value: 'Especialista' },
  { label: 'Administrativo', value: 'Administrativo' }
];

export const ESTADOS_OPCIONES: { label: string; value: EstadoUsuario }[] = [
  { label: 'Activado', value: 'Activado' },
  { label: 'Desactivado', value: 'Desactivado' }
];
