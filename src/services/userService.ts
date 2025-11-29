import { updateProfile } from 'firebase/auth';
import { auth } from './firebase/config';
import firestoreService from './firebase/firestoreService';
import storageService from './firebase/storageService';
import { User } from '../models/User';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from './firebase/config';

const NOMBRE_COLECCION = 'usuarios';

class UserService {
  /*Crear perfil de usuario en Firestore*/
  async crearPerfilUsuario(usuario: User): Promise<void> {
    try {
      await firestoreService.crearDocumento(
        NOMBRE_COLECCION,
        usuario,
        usuario.uid
      );
    } catch (error) {
      console.error('Error al crear perfil de usuario:', error);
      throw new Error('Error al crear perfil de usuario');
    }
  }

  /*Obtener perfil de usuario*/
  async obtenerPerfilUsuario(userId: string): Promise<User | null> {
    try {
      return await firestoreService.obtenerDocumento<User>(
        NOMBRE_COLECCION,
        userId
      );
    } catch (error) {
      console.error('Error al obtener perfil de usuario:', error);
      throw new Error('Error al obtener perfil de usuario');
    }
  }

  escucharPerfilUsuario(
    userId: string,
    callback: (usuario: User | null) => void
  ): () => void {
    const ref = doc(db, NOMBRE_COLECCION, userId);
    const unsubscribe = onSnapshot(ref, (snap) => {
      if (!snap.exists()) {
        callback(null);
        return;
      }
      const data = snap.data();
      const usuario: User = {
        uid: data.uid,
        email: data.email,
        displayName: data.displayName || '',
        photoURL: data.photoURL || undefined,
        currency: data.currency || 'USD',
        monthlyBudget: data.monthlyBudget ?? 0,
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(data.createdAt),
      };
      callback(usuario);
    });
    return unsubscribe;
  }

  /*Actualizar perfil de usuario*/
  async actualizarPerfilUsuario(
    userId: string,
    datos: Partial<User>
  ): Promise<void> {
    try {
      await firestoreService.actualizarDocumento(
        NOMBRE_COLECCION,
        userId,
        datos
      );
    } catch (error) {
      console.error('Error al actualizar perfil:', error);
      throw new Error('Error al actualizar perfil');
    }
  }

  /*Actualizar nombre de usuario*/
  async actualizarNombre(nuevoNombre: string): Promise<void> {
    try {
      const usuarioActual = auth.currentUser;
      if (!usuarioActual) throw new Error('No hay usuario autenticado');

      await updateProfile(usuarioActual, { displayName: nuevoNombre });
      await this.actualizarPerfilUsuario(usuarioActual.uid, {
        displayName: nuevoNombre,
      });
    } catch (error) {
      console.error('Error al actualizar nombre:', error);
      throw new Error('Error al actualizar nombre');
    }
  }

  /*Actualizar foto de perfil*/
  async actualizarFotoPerfil(
    uriImagen: string,
    userId: string
  ): Promise<string> {
    try {
      const usuarioActual = auth.currentUser;
      if (!usuarioActual) throw new Error('No hay usuario autenticado');

      // Guardar imagen localmente
      const photoURL = await storageService.subirFotoPerfil(uriImagen, userId);

      // Actualizar en Firebase Auth
      await updateProfile(usuarioActual, { photoURL });

      // Actualizar en Firestore
      await this.actualizarPerfilUsuario(userId, { photoURL });

      return photoURL;
    } catch (error) {
      console.error('Error al actualizar foto de perfil:', error);
      throw new Error('Error al actualizar foto de perfil');
    }
  }

  /*Actualizar presupuesto mensual*/
  async actualizarPresupuestoMensual(
    userId: string,
    presupuesto: number
  ): Promise<void> {
    try {
      await this.actualizarPerfilUsuario(userId, {
        monthlyBudget: presupuesto,
      });
    } catch (error) {
      console.error('Error al actualizar presupuesto:', error);
      throw new Error('Error al actualizar presupuesto');
    }
  }
  
}

export default new UserService();