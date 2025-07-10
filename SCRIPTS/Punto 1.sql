CREATE DATABASE DBPRUEBAS
GO

USE DBPRUEBAS
GO

CREATE TABLE Productos (
    idProducto INT AUTO_INCREMENT NOT NULL,
    nombre VARCHAR(50) NOT NULL,
    precio DECIMAL(16,2) NOT NULL,
    PRIMARY KEY (idProducto)
);

CREATE TABLE Ventas (
    idVenta INT AUTO_INCREMENT NOT NULL,
    idProducto INT NOT NULL,
    cantidad INT NOT NULL,
    PRIMARY KEY (idVenta),
    FOREIGN KEY (idProducto) REFERENCES Productos(idProducto)
);

insert into Productos(nombre,precio)
values('LAPTOP',3000),('PC',4000),('MOUSE',100),('TECLADO',150),('MONITOR',2000),('MICROFONO',350),('AUDIFONOS',450)

insert into Ventas(idProducto,cantidad)
values(5,6),(1,15),(6,13),(6,4),(2,3),(5,1),(4,5),(2,5),(6,2),(1,8)

SELECT DISTINCT p.idProducto,p.nombre
FROM Productos p 
INNER JOIN Ventas v ON p.idProducto = v.idProducto

SELECT p.idProducto,p.nombre, SUM(v.cantidad) totalventas
FROM Productos p 
INNER JOIN Ventas v ON p.idProducto = v.idProducto
GROUP BY  p.idProducto,p.nombre

SELECT p.idProducto,p.nombre, COALESCE(SUM(v.cantidad),0)*p.precio totalventas
FROM Productos p 
LEFT JOIN Ventas v ON p.idProducto = v.idProducto
GROUP BY  p.idProducto,p.nombre,p.precio