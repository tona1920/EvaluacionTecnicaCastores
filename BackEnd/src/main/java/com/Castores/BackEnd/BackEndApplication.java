package com.Castores.BackEnd;

import java.sql.Connection;

import javax.sql.DataSource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.ConfigurationProperties;

import jakarta.annotation.PostConstruct;

@SpringBootApplication
@ConfigurationProperties(prefix="datasource.primary")
public class BackEndApplication {
	@Autowired
	private DataSource dataSource;
	public static void main(String[] args) {
		SpringApplication.run(BackEndApplication.class, args);
	}
	@PostConstruct
    public void verificarConexion() {
	 try (Connection conn = dataSource.getConnection()) {
	        System.out.println("🔎 Conectado a:");
	        System.out.println("  URL     → " + conn.getMetaData().getURL());
	        System.out.println("  URL     → " + conn.getMetaData().getDatabaseProductName());
	        System.out.println("  Usuario → " + conn.getMetaData().getUserName());
	    } catch (Exception e) {
	        e.printStackTrace();
	    }
    }
}
