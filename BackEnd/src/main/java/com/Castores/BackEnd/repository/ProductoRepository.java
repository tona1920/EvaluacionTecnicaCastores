package com.Castores.BackEnd.repository;

import java.math.BigDecimal;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Repository;

import com.Castores.BackEnd.model.HistorialProductos;
import com.Castores.BackEnd.model.Producto;
import com.Castores.BackEnd.model.ProductoEntity;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.Query;
import jakarta.transaction.Transactional;

@Repository
public class ProductoRepository {
	@PersistenceContext
	private EntityManager entityManager;
	
	public List<ProductoEntity> obtenerProductos(String sQuery){
		Query oQuery = entityManager.createNativeQuery(sQuery);
		List<Object[]> lstResultados = oQuery.getResultList();
		List<ProductoEntity> lstProductos  = new ArrayList<>();
		
		for (Object[] fila : lstResultados) {
			ProductoEntity dto = new ProductoEntity(
				((Number) fila[0]).intValue(),
				(String) fila[1],
				((Number) fila[2]).intValue(),
				(BigDecimal) fila[3],
				(Boolean) fila[4]
			);
			lstProductos.add(dto);
        }

        return lstProductos;
	}
	
	
	public List<HistorialProductos> obtenerHistorial(){
		Query oQuery = entityManager.createNativeQuery(" select p.nombre, 1 as accion , e.cantidad, e.dtFecha , u.nombre "
				+ "from productos p "
				+ "inner join entradaproducto e on p.idProducto = e.idProducto "
				+ "inner join usuarios u on e.idUsuario  = u.idUsuario "
				+ "union all "
				+ "select p.nombre, 2 as accion, v.cantidad, v.dtFecha , u.nombre "
				+ "from productos p "
				+ "inner join ventas v on p.idProducto = v.idProducto "
				+ "inner join usuarios u on v.idUsuario  = u.idUsuario");
		
		List<Object[]> lstResultados = oQuery.getResultList();
		List<HistorialProductos> lstHistorial = new ArrayList<>();

	    for (Object[] fila : lstResultados) {
	        HistorialProductos dto = new HistorialProductos(
	            (String) fila[0],                             
	            ((Number) fila[1]).intValue(),               
	            ((Number) fila[2]).intValue(),             
	            ((Timestamp) fila[3]).toLocalDateTime(),    
	            (String) fila[4]                       
	        );
	        lstHistorial.add(dto);
	    }

	    return lstHistorial;
	}
	
	@Transactional
	public int insertarProducto(ProductoEntity producto) {
	        Query oQuery = entityManager.createNativeQuery(
	        		"INSERT INTO Productos (nombre, cantidad, precio, estatus) VALUES (:nombre, :cantidad, :precio, :estatus)"
	        );

	        oQuery.setParameter("nombre", producto.getNombre());
	        oQuery.setParameter("cantidad", producto.getCantidad());
	        oQuery.setParameter("precio", producto.getPrecio());
	        oQuery.setParameter("estatus", producto.isEstatus());
	        oQuery.executeUpdate();

	        return 1;
	}
	

	@Transactional
	public String modificarProducto(Producto producto) {
        Query oQuery = entityManager.createNativeQuery(
                "CALL sp_actualizar_producto(:sNombre, :iCantidad, :iPrecio, :sComentario, :bEstatus, :iUsuario, :iProducto, :iAccion)"
            );

        oQuery.setParameter("sNombre", producto.getNombre());
        oQuery.setParameter("iCantidad", producto.getCantidad());
        oQuery.setParameter("iPrecio", producto.getPrecio());
        oQuery.setParameter("sComentario", producto.getComentario());
        oQuery.setParameter("bEstatus", producto.getEstatus());
        oQuery.setParameter("iUsuario", producto.getIdUsuario());
        oQuery.setParameter("iProducto", producto.getIdProducto());
        oQuery.setParameter("iAccion", producto.getAccion());
	    return (String) oQuery.getSingleResult();
	}
	
	
}
