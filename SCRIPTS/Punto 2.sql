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
  icono VARCHAR(100) not null,
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

-- insertar rutas
INSERT INTO Modulo (nombre, icono, ruta, estatus) 
VALUES 
  ('Inicio', 'pi pi-home', 'administrador/home', true),
  ('Registro de Actividades', 'pi pi-history', 'administrador/historico', true),
   ('Usuarios', 'pi pi-users', 'administrador/usuarios', true),
  ('Ventas y Almacén', 'pi pi-shopping-cart', 'almacen/home', true);

INSERT INTO ModuloRol(idRol,idModulo)
VALUES
	(1,1),(1,2),(1,3),(2,4);

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

CREATE PROCEDURE sp_actualizar_producto(
    IN sNombre VARCHAR(200),
    IN iCantidad INT,
    IN iPrecio DECIMAL(16,2),
    IN sComentario VARCHAR(250),
    IN bEstatus BOOLEAN,
    IN iUsuario INT,
    IN iProducto INT,
    IN iAccion INT -- 1: Actualizar Producto, 2: Actualizar estatus, 3: Agregar stock, 4: Registrar venta
)
main_block: BEGIN
    DECLARE sErrores JSON DEFAULT JSON_ARRAY();
    DECLARE sResultado JSON;
    DECLARE err_msg TEXT;
    DECLARE viRol INT DEFAULT NULL;
    DECLARE vCantidadActual INT DEFAULT NULL;
    DECLARE vEstatusActual BOOLEAN DEFAULT NULL;

    -- Manejo de errores internos
    DECLARE EXIT HANDLER FOR SQLEXCEPTION 
    BEGIN
        GET DIAGNOSTICS CONDITION 1 err_msg = MESSAGE_TEXT;
        SET sErrores = JSON_ARRAY_APPEND(sErrores, '$', JSON_OBJECT('Error interno', err_msg));
        ROLLBACK;
        SET sResultado = JSON_OBJECT('iCode', 500, 'sMensaje', 'Error interno', 'aErrores', sErrores);
        SELECT sResultado AS resultado;
    END;

    START TRANSACTION;

    -- Validar existencia del usuario y obtener rol
    SELECT idRol INTO viRol FROM Usuarios WHERE idUsuario = iUsuario AND estatus = 1 LIMIT 1;
    IF viRol IS NULL THEN
        SET sErrores = JSON_ARRAY_APPEND(sErrores, '$', JSON_OBJECT('Usuario', 'El usuario no existe o está inactivo.'));
    END IF;

    -- Validar existencia del producto y obtener estado actual
    SELECT cantidad, estatus INTO vCantidadActual, vEstatusActual
    FROM Productos
    WHERE idProducto = iProducto
    LIMIT 1;

    IF vCantidadActual IS NULL THEN
        SET sErrores = JSON_ARRAY_APPEND(sErrores, '$', JSON_OBJECT('Producto', 'El producto no existe.'));
    END IF;

    -- Validar acción permitida
    IF iAccion NOT IN (1, 2, 3, 4) THEN
        SET sErrores = JSON_ARRAY_APPEND(sErrores, '$', JSON_OBJECT('Acción', 'Acción no válida.'));
    END IF;

    -- Validar acción según rol
    IF (iAccion IN (1, 2, 3) AND viRol != 1) OR (iAccion = 4 AND viRol != 2) THEN
        SET sErrores = JSON_ARRAY_APPEND(sErrores, '$', JSON_OBJECT('Rol', 'Rol no autorizado para esta acción.'));
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
        LEAVE main_block;
    END IF;

    -- Acción 1: Actualizar producto (admin)
    IF iAccion = 1 AND viRol = 1 THEN
        INSERT INTO LogProducto (idUsuario, idProducto, cantidad, estatusAnterior, estatusNuevo, comentario)
        VALUES (iUsuario, iProducto, vCantidadActual, vEstatusActual, bEstatus, COALESCE(sComentario, ''));

        UPDATE Productos 
        SET nombre = COALESCE(sNombre, nombre),
            cantidad = COALESCE(iCantidad, cantidad),
            precio = COALESCE(iPrecio, precio),
            estatus = COALESCE(bEstatus, estatus)
        WHERE idProducto = iProducto;

        SET sResultado = JSON_OBJECT('iCode', 200, 'sMensaje', 'Producto actualizado.', 'iIdUsuario', iUsuario);
        SELECT sResultado AS resultado;
        COMMIT;
        LEAVE main_block;
    END IF;

    -- Acción 2: Actualizar estatus (admin)
    IF iAccion = 2 AND viRol = 1 THEN
        INSERT INTO LogProducto (idUsuario, idProducto, cantidad, estatusAnterior, estatusNuevo, comentario)
        VALUES (iUsuario, iProducto, vCantidadActual, vEstatusActual, bEstatus, COALESCE(sComentario, ''));

        UPDATE Productos 
        SET estatus = bEstatus
        WHERE idProducto = iProducto;

        SET sResultado = JSON_OBJECT('iCode', 200, 'sMensaje', 'Estatus actualizado.', 'iIdUsuario', iUsuario);
        SELECT sResultado AS resultado;
        COMMIT;
        LEAVE main_block;
    END IF;

    -- Acción 3: Agregar stock (admin)
    IF iAccion = 3 AND viRol = 1 THEN
        INSERT INTO LogProducto (idUsuario, idProducto, cantidad, estatusAnterior, estatusNuevo, comentario)
        VALUES (iUsuario, iProducto, vCantidadActual, vEstatusActual, vEstatusActual, COALESCE(sComentario, ''));

        INSERT INTO EntradaProducto (idUsuario, idProducto, cantidad, comentario)
        VALUES (iUsuario, iProducto, iCantidad, COALESCE(sComentario, ''));

        UPDATE Productos 
        SET cantidad = cantidad + iCantidad
        WHERE idProducto = iProducto;

        SET sResultado = JSON_OBJECT('iCode', 200, 'sMensaje', 'Stock actualizado.', 'iIdUsuario', iUsuario);
        SELECT sResultado AS resultado;
        COMMIT;
        LEAVE main_block;
    END IF;

    -- Acción 4: Registrar venta (vendedor)
    IF iAccion = 4 AND viRol = 2 THEN
        IF vCantidadActual < iCantidad THEN
            SET sErrores = JSON_ARRAY_APPEND(sErrores, '$', JSON_OBJECT('Stock', 'Cantidad insuficiente para realizar la venta.'));
            SET sResultado = JSON_OBJECT('iCode', 400, 'sMensaje', 'No se pudo registrar la venta', 'aErrores', sErrores);
            SELECT sResultado AS resultado;
            ROLLBACK;
            LEAVE main_block;
        END IF;

        INSERT INTO LogProducto (idUsuario, idProducto, cantidad, estatusAnterior, estatusNuevo, comentario)
        VALUES (iUsuario, iProducto, vCantidadActual, vEstatusActual, vEstatusActual, COALESCE(sComentario, ''));

        INSERT INTO Ventas (idUsuario, idProducto, cantidad, comentario)
        VALUES (iUsuario, iProducto, iCantidad, COALESCE(sComentario, ''));

        UPDATE Productos 
        SET cantidad = cantidad - iCantidad
        WHERE idProducto = iProducto;

        SET sResultado = JSON_OBJECT('iCode', 200, 'sMensaje', 'Venta registrada.', 'iIdUsuario', iUsuario);
        SELECT sResultado AS resultado;
        COMMIT;
        LEAVE main_block;
    END IF;

END main_block;
