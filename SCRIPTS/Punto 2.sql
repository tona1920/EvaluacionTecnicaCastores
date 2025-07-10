CREATE DATABASE DBTEST
GO

USE DBTEST
GO

CREATE TABLE Rol (
  idRol INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(50) NOT NULL,
  descripcion VARCHAR(100) NOT NULL,
  estatus BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE Usuarios (
  idUsuario INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  correo VARCHAR(50) NOT NULL,
  contrasena VARCHAR(25) NOT NULL,
  idRol INT NOT NULL,
  estatus BOOLEAN NOT NULL DEFAULT TRUE,
  FOREIGN KEY (idRol) REFERENCES Rol(idRol)
);

CREATE TABLE Productos (
  idProducto INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(200) NOT NULL,
  cantidad INT NOT NULL DEFAULT 0,
  precio DECIMAL(16,2) NOT NULL,
  dtFechaCreacion DATETIME DEFAULT CURRENT_TIMESTAMP,
  estatus BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE LogProducto (
  idLogProducto INT AUTO_INCREMENT PRIMARY KEY,
  idUsuario INT NOT NULL,
  idProducto INT NOT NULL,
  cantidad INT,
  estatusAnterior TINYINT,
  estatusNuevo TINYINT,
  comentario VARCHAR(200),
  dtFecha DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (idUsuario) REFERENCES Usuarios(idUsuario),
  FOREIGN KEY (idProducto) REFERENCES Productos(idProducto)
);

CREATE TABLE Ventas (
  idVentas INT AUTO_INCREMENT PRIMARY KEY,
  idUsuario INT NOT NULL,
  idProducto INT NOT NULL,
  cantidad INT,
  comentario VARCHAR(200),
  dtFecha DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (idUsuario) REFERENCES Usuarios(idUsuario),
  FOREIGN KEY (idProducto) REFERENCES Productos(idProducto)
);

CREATE TABLE EntradaProducto (
  idEntradaProducto INT AUTO_INCREMENT PRIMARY KEY,
  idUsuario INT NOT NULL,
  idProducto INT NOT NULL,
  cantidad INT,
  comentario VARCHAR(200),
  dtFecha DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (idUsuario) REFERENCES Usuarios(idUsuario),
  FOREIGN KEY (idProducto) REFERENCES Productos(idProducto)
);

CREATE TABLE Modulo(
  idModulo INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(50) NOT null,
  ruta VARCHAR(200) NOT null,
  dtFecha DATETIME DEFAULT CURRENT_TIMESTAMP,
  estatus BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE ModuloRol(
  idModuloRol INT AUTO_INCREMENT PRIMARY KEY,
  idRol INT NOT null,
  idModulo INT NOT null,
  FOREIGN KEY (idRol) REFERENCES Rol(idRol),
  FOREIGN KEY (idModulo) REFERENCES Modulo(idModulo)
);