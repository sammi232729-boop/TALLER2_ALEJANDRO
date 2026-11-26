-- ============================================================================
-- Examen 2 - Computación Gráfica (Universidad de Nariño)
-- Base de datos: db_jeisonCuastumal_sebastianPerez
-- Sistema de Gestión de Cuentas de Usuario Hospitalario
-- ============================================================================

CREATE DATABASE IF NOT EXISTS `db_jeisonCuastumal_sebastianPerez`
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE `db_jeisonCuastumal_sebastianPerez`;

DROP TABLE IF EXISTS `usuarios`;

CREATE TABLE `usuarios` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `identificacion` VARCHAR(30) NOT NULL,
  `nombre` VARCHAR(100) NOT NULL,
  `apellido` VARCHAR(100) NOT NULL,
  `email` VARCHAR(150) NOT NULL,
  `cargo` ENUM('Doctor', 'Especialista', 'Administrativo') NOT NULL,
  `telefono` VARCHAR(30) NOT NULL,
  `nombre_usuario` VARCHAR(80) NOT NULL,
  `contrasena` VARCHAR(255) NOT NULL,
  `estado` ENUM('Activado', 'Desactivado') NOT NULL DEFAULT 'Activado',
  `fecha_creacion` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `fecha_actualizacion` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_usuarios_identificacion` (`identificacion`),
  UNIQUE KEY `uq_usuarios_email` (`email`),
  UNIQUE KEY `uq_usuarios_nombre_usuario` (`nombre_usuario`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- Usuarios iniciales de prueba (contraseñas cifradas con PBKDF2-HMAC-SHA256)
-- 1) Identificación: 1001 | Contraseña: Admin123!    | Estado: Activado
-- 2) Identificación: 1002 | Contraseña: Doctor123!   | Estado: Activado
-- 3) Identificación: 1003 | Contraseña: Inactivo123! | Estado: Desactivado
-- ============================================================================
INSERT INTO `usuarios` (
  `identificacion`, `nombre`, `apellido`, `email`, `cargo`, `telefono`, `nombre_usuario`, `contrasena`, `estado`
) VALUES
(
  '1001',
  'Jeison',
  'Cuastumal',
  'jeison.cuastumal@hospital.edu.co',
  'Administrativo',
  '3105550101',
  'jcuastumal',
  'a1b2c3d4e5f60718293a4b5c6d7e8f90$87bc2a891e42774531a50ad74e2e37eff3288d2e31f637d1b4291d0bf79795b8',
  'Activado'
),
(
  '1002',
  'Sebastian',
  'Perez',
  'sebastian.perez@hospital.edu.co',
  'Doctor',
  '3105550102',
  'sperez',
  '11223344556677889900aabbccddeeff$4146c706766f62b6cfe3d95e08a8c2166265bddcd6082ab8fc65cac8689353fd',
  'Activado'
),
(
  '1003',
  'Laura',
  'Gomez',
  'laura.gomez@hospital.edu.co',
  'Especialista',
  '3105550103',
  'lgomez',
  'ffeeddccbbaa00998877665544332211$242485cab83ca745803df5c48b4fce5114f80acf8c8fbc7e81bc69d94fe39983',
  'Desactivado'
);