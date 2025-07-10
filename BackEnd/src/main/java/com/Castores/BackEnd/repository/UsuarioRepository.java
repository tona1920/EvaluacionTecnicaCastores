package com.Castores.BackEnd.repository;

import org.springframework.stereotype.Repository;

import com.Castores.BackEnd.model.Usuario;
import com.Castores.BackEnd.model.UsuarioEntity;

import jakarta.persistence.EntityManager;
import jakarta.persistence.NoResultException;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.Query;

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
	
}
