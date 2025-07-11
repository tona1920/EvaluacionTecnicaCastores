package com.Castores.BackEnd.repository;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Repository;

import com.Castores.BackEnd.model.HistorialProductos;
import com.Castores.BackEnd.model.ProductoEntity;
import com.Castores.BackEnd.model.Rutas;
import com.Castores.BackEnd.model.Usuario;
import com.Castores.BackEnd.model.UsuarioEntity;

import jakarta.persistence.EntityManager;
import jakarta.persistence.NoResultException;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.Query;
import jakarta.transaction.Transactional;

@Repository
public class UsuarioRepository {

	@PersistenceContext
	private EntityManager entityManager;
	
	public UsuarioEntity buscarPorUsername(String username) {
        try {
            String sql =  """
            		 SELECT tu.idusuario, tu.nombre, tu.contrasena,tr.idrol,tu.estatus
					 FROM Usuarios tu 
					 INNER JOIN Rol tr ON tu.idrol = tr.idrol 
					 WHERE tu.correo =:correo and tu.estatus =true and tr.estatus=true
            		 """;
            Object[] result = (Object[]) entityManager.createNativeQuery(sql)
                .setParameter("correo", username)
                .getSingleResult();

            UsuarioEntity user = new UsuarioEntity();
            user.setIdUsuario(((Number) result[0]).intValue());
            user.setNombre((String) result[1]);
            user.setContrasena((String) result[2]);
            user.setIdRol(((Number) result[3]).intValue());
            user.setEstatus(((boolean) result[4]));
            return user;
        } catch (NoResultException e) {
            return null;
        }
    }
	
	public List<UsuarioEntity> obtenerUsuarios() {
        String sSQL =  """
        		 SELECT tu.idusuario, tu.nombre, tu.correo, tr.idrol, tr.nombre, tu.estatus
         		 FROM Usuarios tu 
         		 INNER JOIN Rol tr ON tu.idrol = tr.idrol 
        		 """;
        Query oQuery = entityManager.createNativeQuery(sSQL);
        
        List<Object[]> lstResultados = oQuery.getResultList();
        
		List<UsuarioEntity> lstUsuarios = new ArrayList<>();

	    for (Object[] fila : lstResultados) {
	    	UsuarioEntity dto = new UsuarioEntity(
	    	    ((Number) fila[0]).intValue(),                    
	            (String) fila[1], 
	            (String) fila[2], 
	            "",
	            ((Number) fila[3]).intValue(),
	            (String) fila[4],
	            ((boolean) fila[5])
	        );
	    	lstUsuarios.add(dto);
	    }

	    return lstUsuarios;
}
	
	public List<Rutas> buscarRuta(Integer idUsuario) {
            String sSQL =  """
            		select m.nombre,m.ruta,m.icono 
					from usuarios u 
					inner join modulorol rm on u.idRol = rm.idRol
					inner join modulo m on rm.idModulo = m.idModulo and m.estatus =1
					WHERE u.idUsuario =:idUsuario and u.estatus =1
            		 """;
            Query oQuery = entityManager.createNativeQuery(sSQL);
            oQuery.setParameter("idUsuario", idUsuario);
            
            List<Object[]> lstResultados = oQuery.getResultList();
            
    		List<Rutas> lstRutas = new ArrayList<>();

    	    for (Object[] fila : lstResultados) {
    	    	Rutas dto = new Rutas(
    	            (String) fila[0],                    
    	            (String) fila[1],  
    	            (String) fila[2]
    	        );
    	    	lstRutas.add(dto);
    	    }

    	    return lstRutas;
    }
	
	public String insertarUsuario(Usuario oRequest, String password) {
		Query oQuery = entityManager.createNativeQuery(
				"CALL sp_insertar_usuario(:nombre, :correo, :password, :iRol)"
	    );
	        
	    oQuery.setParameter("nombre", oRequest.getNombre());
	    oQuery.setParameter("correo", oRequest.getCorreo());
	    oQuery.setParameter("password", password);
	    oQuery.setParameter("iRol", oRequest.getIdRol());

	    return (String) oQuery.getSingleResult();
	}

	@Transactional
	public int actualizar(Usuario user) {
	        Query oQuery = entityManager.createNativeQuery(
	        		"update usuarios  set estatus=:estatus where idUsuario=:idUsuario"
	        );
	        oQuery.setParameter("estatus", user.getEstatus());
	        oQuery.setParameter("idUsuario", user.getIdUsuario());
	        oQuery.executeUpdate();

	        return 1;
	}
}
