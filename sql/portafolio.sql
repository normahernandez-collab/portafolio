-- XAMPP: phpMyAdmin > Importar. InfinityFree: crea la base en el panel e importa este archivo
-- (omite las dos primeras instrucciones, porque allí la base ya viene creada).
CREATE DATABASE IF NOT EXISTS portafolio CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE portafolio;

CREATE TABLE IF NOT EXISTS mensajes (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(80) NOT NULL,
  correo VARCHAR(120) NOT NULL,
  telefono VARCHAR(20) NOT NULL,
  asunto VARCHAR(120) NOT NULL,
  mensaje TEXT NOT NULL,
  ip VARCHAR(45) NULL,
  creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS testimonios (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(80) NOT NULL,
  rol VARCHAR(120) NOT NULL,
  texto TEXT NOT NULL,
  aprobado TINYINT(1) NOT NULL DEFAULT 0,
  creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;
