# 1. CONOCIMIENTOS SQL

**1.1) Describe el funcionamiento general de la sentencia JOIN.**
<br>Esta sentencia se utiliza para enlazar/combinar registros de dos o mas tablas en una sola consulta, estas deben tener columnas en común, normalmente se utilizan llaves primarias y foráneas. Esto con el fin de mostrar la información en común almacenada en diferentes tablas.

**1.2) ¿Cuáles son los tipos de JOIN y cuál es el funcionamiento de los mismos?**

- INNER JOIN:  Regresa solo la información (filas) que tienen coincidencias en ambas tablas de acuerdo con la condición de unión. 
- LEFT JOIN (LEFT OUTER JOIN): Regresa solo la información (filas) que exista en la tabla izquierda (principal) y añade la información de la tabla derecha (secundaria) de acuerdo con la condición de unión. En caso de no existir coincidencia el dato se muestra nulo, puede también mostrar solo la información de la tabla izquierda si así se especifica en la cláusula where.
- RIGHT JOIN (RIGHT OUTER JOIN): Regresa solo información (filas) que exista en la tabla derecha (secundaria) y añade la información de la tabla izquierda (principal) de acuerdo con la condición de unión. En caso de no existir coincidencia el dato se muestra nulo, puede también mostrar solo la información de la tabla derecha si así se especifica en la cláusula where.
- FULL JOIN(FULL OUTER JOIN): Regresa todas las filas de ambas tablas (información completa), en caso de no tener alguna coincidencia se muestra el dato como nulo. Esta al igual que las anteriores requiere condición de unión.
- CROSS JOIN: Regresa la información combinada de cada fila de la tabla principal con la cada fila de la tabla secundaria. Está a excepción de las anteriores no puede tener condición de unión.

**1.3) ¿Cuál el funcionamiento general de los TRIGGER y qué propósito tienen?**
<br>Un trigger es un tipo de objeto que se ejecuta automáticamente antes o después de realizar alguna acción en una tabla o vista, estas acciones pueden ser INSERT, UPDATE o DELETE. <br>
Tiene como propósito automatizar tareas o realizar algún ajuste ya sea en la tabla origen o alguna otra que tenga relación con las reglas del negocio, con fines de mantener la integridad de la información o validar los cambios que se realizaron o realizaran.

**1.4) ¿Qué es y para qué sirve un STORED PROCEDURE?**
<br>Es un conjunto de instrucciones SQL que se guardan en un objeto de base de datos y que puede ejecutarse cuando sea necesario.
Su propósito principal es centralizar la lógica del negocio dentro del mismo motor/servidor de base de datos con el fin de facilitar el mantenimiento, reutilización de código, así como la consistencia/validación de procesos.
<br>También se utiliza para:  
- Automatizar tareas complejas como consultas avanzadas, procesos del negocio o la ejecución de código T-SQL.
- Optimizar el rendimiento evitando repetición de código y reduciendo el tiempo de respuesta al ejecutar operaciones directamente en el servidor.
- Manejar transacciones para asegurar que las operaciones realizadas en una o más tablas se complete correctamente, en caso de ocurrir un error pueden deshacer los cambios (rollback) y manejar el error apropiadamente (retornar o almacenar).
- Realizar cargas masivas e integraciones de forma segura y controlada, manteniendo la consistencia de la información

Hacer las consultas necesarias para: <br>
**1.5) Traer todos los productos que tengan una venta.**<br>
``` SQL
SELECT DISTINCT p.idProducto,p.nombre
FROM Productos p 
INNER JOIN Ventas v ON p.idProducto = v.idProducto
```
**1.6) Traer todos los productos que tengan ventas y la cantidad total de productos vendidos.**<br>
``` SQL
SELECT p.idProducto,p.nombre, SUM(v.cantidad) totalventas
FROM Productos p 
INNER JOIN Ventas v ON p.idProducto = v.idProducto
GROUP BY p.idProducto,p.nombre
```
**1.7) Traer todos los productos (independientemente de si tienen ventas o no) y la suma total ($) vendida por producto.**<br>
``` SQL
SELECT p.idProducto,p.nombre, ISNULL(SUM(v.cantidad),0)*p.precio totalventas
FROM Productos p 
LEFT JOIN Ventas v ON p.idProducto = v.idProducto
GROUP BY p.idProducto,p.nombre,p.precio
```