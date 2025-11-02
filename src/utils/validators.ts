// src/utils/validators.ts

/**
 * Validadores para formularios
 */
export const validadores = {
  /**
   * Validar campo requerido
   */
  requerido: (nombreCampo: string) => (valor: any): string | null => {
    if (!valor || (typeof valor === 'string' && !valor.trim())) {
      return '${nombreCampo} es requerido';
    }
    return null;
  },

  /**
   * Validar email
   */
  email: (valor: string): string | null => {
    if (!valor) {
      return 'El email es requerido';
    }
    
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regexEmail.test(valor)) {
      return 'Email inválido';
    }
    
    return null;
  },

  /**
   * Validar contraseña
   */
  contrasena: (valor: string): string | null => {
    if (!valor) {
      return 'La contraseña es requerida';
    }
    
    if (valor.length < 6) {
      return 'Mínimo 6 caracteres';
    }
    
    return null;
  },

  /**
   * Validar confirmación de contraseña
   */
  confirmarContrasena: (contrasena: string) => (valor: string): string | null => {
    if (!valor) {
      return 'Confirma tu contraseña';
    }
    
    if (valor !== contrasena) {
      return 'Las contraseñas no coinciden';
    }
    
    return null;
  },

  /**
   * Validar número positivo
   */
  numeroPositivo: (nombreCampo: string) => (valor: number): string | null => {
    if (!valor || valor <= 0) {
      return '${nombreCampo} debe ser mayor a 0';
    }
    return null;
  },

  /**
   * Validar longitud máxima
   */
  longitudMaxima: (max: number) => (valor: string): string | null => {
    if (valor && valor.length > max) {
      return 'Máximo ${max} caracteres';
    }
    return null;
  },

  /**
   * Validar longitud mínima
   */
  longitudMinima: (min: number, nombreCampo: string) => (valor: string): string | null => {
    if (valor && valor.length < min) {
      return '${nombreCampo} debe tener al menos ${min} caracteres';
    }
    return null;
  },
};