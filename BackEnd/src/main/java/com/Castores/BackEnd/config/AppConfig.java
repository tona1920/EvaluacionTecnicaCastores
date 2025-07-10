package com.Castores.BackEnd.config;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

public class AppConfig {
	private static final PasswordEncoder encoder = new BCryptPasswordEncoder();

    public static String encriptar(String sPassword) {
        return encoder.encode(sPassword);
    }

    public static boolean verificar(String sPassword, String sPasswordEncriptado) {
        return encoder.matches(sPassword, sPasswordEncriptado);
    }
}
