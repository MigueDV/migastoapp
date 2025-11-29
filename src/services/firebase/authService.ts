import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    updateProfile,
    User as FirebaseUser,
  } from 'firebase/auth';
  import { auth } from './config';
  import { User } from '../../models/User';
  
  class AuthService {
    /*Registrar nuevo usuario*/
    async registrar(
      email: string,
      contrasena: string,
      nombreCompleto: string
    ): Promise<User> {
      try {
        const credencialUsuario = await createUserWithEmailAndPassword(
          auth,
          email,
          contrasena
        );
  
        await updateProfile(credencialUsuario.user, { displayName: nombreCompleto });
  
        return this.mapearUsuarioFirebase(credencialUsuario.user);
      } catch (error: any) {
        throw this.manejarErrorAuth(error);
      }
    }
  
    /*Iniciar sesión*/
    async iniciarSesion(email: string, contrasena: string): Promise<User> {
      try {
        const credencialUsuario = await signInWithEmailAndPassword(
          auth,
          email,
          contrasena
        );
        return this.mapearUsuarioFirebase(credencialUsuario.user);
      } catch (error: any) {
        throw this.manejarErrorAuth(error);
      }
    }
  
    /*Cerrar sesión*/
    async cerrarSesion(): Promise<void> {
      try {
        await signOut(auth);
      } catch (error: any) {
        throw this.manejarErrorAuth(error);
      }
    }
  
    /*Obtener usuario actual*/
    obtenerUsuarioActual(): FirebaseUser | null {
      return auth.currentUser;
    }
  
    private mapearUsuarioFirebase(usuarioFirebase: FirebaseUser): User {
      return {
        uid: usuarioFirebase.uid,
        email: usuarioFirebase.email!,
        displayName: usuarioFirebase.displayName || '',
        photoURL: usuarioFirebase.photoURL || undefined,
        monthlyBudget: 2000,
        currency: 'USD',
        createdAt: new Date(usuarioFirebase.metadata.creationTime!),
      };
    }
  
    private manejarErrorAuth(error: any): Error {
      let mensaje = 'Error de autenticación';
  
      switch (error.code) {
        case 'auth/email-already-in-use':
          mensaje = 'Este email ya está registrado';
          break;
        case 'auth/invalid-email':
          mensaje = 'Email inválido';
          break;
        case 'auth/weak-password':
          mensaje = 'Contraseña muy débil (mínimo 6 caracteres)';
          break;
        case 'auth/user-not-found':
        case 'auth/wrong-password':
        case 'auth/invalid-credential':
          mensaje = 'Email o contraseña incorrectos';
          break;
        case 'auth/too-many-requests':
          mensaje = 'Demasiados intentos. Intenta más tarde';
          break;
      }
  
      return new Error(mensaje);
    }
  }
  
  export default new AuthService();