package com.Castores.BackEnd.repository;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Repository;

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
	
	@Transactional
	public int insertarProducto(ProductoEntity producto) {
	        Query query = entityManager.createNativeQuery(
	        		"INSERT INTO Productos (nombre, cantidad, precio, estatus) VALUES (:nombre, :cantidad, :precio, :estatus)"
	        );

	        query.setParameter("nombre", producto.getNombre());
	        query.setParameter("cantidad", producto.getCantidad());
	        query.setParameter("precio", producto.getPrecio());
	        query.setParameter("estatus", producto.isEstatus());
	        query.executeUpdate();

	        return 1;
	}
}
