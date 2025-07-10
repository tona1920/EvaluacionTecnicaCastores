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

-- Modificar tabla de usuario para poder guardar contraseñas encriptadas
ALTER TABLE Usuarios MODIFY contrasena VARCHAR(250);

--Insertamos roles
INSERT INTO Rol (nombre, descripcion) VALUES 
('Administrador', 'Acceso total al inventario, sin permiso para realizar salidas de productos.'),
('Almacenista', 'Opera salidas y consultas de inventario, sin modificar ni agregar productos.');

-- insertar el usuario administrador
INSERT INTO Usuarios (nombre, correo, contrasena, idRol, estatus) 
VALUES ('admin', 'admin@gmail.com', '$2a$10$62RWiu5g40xyNaMCK.AmKeh2JL1wNj/aLrfb3JuuzGSvqNNEN2OGa', 1, TRUE);


CREATE PROCEDURE sp_insertar_usuario(
    IN sNombre VARCHAR(100),
    IN sCorreo VARCHAR(50),
    IN sContrasena VARCHAR(250),
    IN iRol INT
)
BEGIN
    DECLARE iUsuario INT;
    DECLARE sErrores JSON DEFAULT JSON_ARRAY();
    DECLARE sResultado JSON;
    DECLARE err_msg TEXT;
    DECLARE viRol INT DEFAULT NULL;
    DECLARE viUsuario INT DEFAULT NULL;

    DECLARE EXIT HANDLER FOR SQLEXCEPTION 
    BEGIN
        GET DIAGNOSTICS CONDITION 1
            err_msg = MESSAGE_TEXT;
        
        SET sErrores = JSON_ARRAY_APPEND(sErrores, '$', JSON_OBJECT('Error interno', err_msg));
        ROLLBACK;
        
        SET sResultado = JSON_OBJECT(
            'iCode', 500,
            'sMensaje', 'Errores al registrar el usuario.',
            'aErrores', sErrores
        );
        SELECT sResultado AS resultado;
    END;

    START TRANSACTION;

    -- Validar Rol
    SELECT idRol INTO viRol FROM Rol WHERE idRol = iRol LIMIT 1;
    IF viRol IS NULL THEN
        SET sErrores = JSON_ARRAY_APPEND(sErrores, '$', JSON_OBJECT('Rol', 'No existe el rol.'));
    END IF;

    -- Validar Correo existente
    SELECT idUsuario INTO viUsuario FROM Usuarios WHERE correo = sCorreo LIMIT 1;
    IF viUsuario IS NOT NULL THEN
        SET sErrores = JSON_ARRAY_APPEND(sErrores, '$', JSON_OBJECT('Correo', 'El correo ya fue registrado.'));
    END IF;

    -- Retornar errores si existen
    IF JSON_LENGTH(sErrores) > 0 THEN
        SET sResultado = JSON_OBJECT(
            'iCode', 400,
            'sMensaje', 'Errores de validación',
            'aErrores', sErrores
        );
        SELECT sResultado AS resultado;
        ROLLBACK;
    ELSE
        -- Insertar usuario
        INSERT INTO Usuarios (nombre, correo, contrasena, idRol, estatus) 
        VALUES (sNombre, sCorreo, sContrasena, iRol, TRUE);

        SET iUsuario = LAST_INSERT_ID();

        -- Resultado exitoso
        SET sResultado = JSON_OBJECT(
            'iCode', 200,
            'sMensaje', 'Se insertó el usuario',
            'iIdUsuario', iUsuario
        );
        SELECT sResultado AS resultado;

        COMMIT;
    END IF;
END

