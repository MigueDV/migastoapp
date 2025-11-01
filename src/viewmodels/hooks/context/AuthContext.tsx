import React, { createContext, useState, useEffect, ReactNode } from 'react'; //useState para el estado, useEffect para efectos secundarios
import { onAuthStateChanged } from 'firebase/auth'; //Observador de Firebase que detecta cambios en el estado de autenticación
import { auth } from '../../../services/firebase/config';
import authService from '../../../services/firebase/authService';
import userService from '../../../services/userService';
import { User } from '../../../models/User';
import { PRESUPUESTO_DEFAULT } from '../../../utils/constants';

interface AuthContextData {
  user: User | null;    //Usuario actual o null si no está autenticado
  loading: boolean;     //Estado de carga
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, displayName: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
}

export const AuthContext = createContext<AuthContextData>({} as AuthContextData);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);      //Almacena los datos del usuario autenticado
  const [loading, setLoading] = useState(true);             //Indica si se está procesando una operación

  useEffect(() => {
    // Observador de cambios en la autenticación
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Usuario autenticado: obtener o crear perfil
        let userProfile = await userService.obtenerPerfilUsuario(firebaseUser.uid);

         // Crear perfil si no existe
        if (!userProfile) {
          userProfile = {
            uid: firebaseUser.uid,
            email: firebaseUser.email!,
            displayName: firebaseUser.displayName || '',
            photoURL: firebaseUser.photoURL || undefined,
            monthlyBudget: PRESUPUESTO_DEFAULT,
            createdAt: new Date(),
          };
          await userService.crearPerfilUsuario(userProfile);
        }

        setUser(userProfile);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return unsubscribe; // Cleanup: desuscribirse al desmontar
  }, []);
  
   // INICIO DE SESIÓN
   
  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      await authService.iniciarSesion(email, password);
      // onAuthStateChanged se encarga de actualizar el estado
    } catch (error) {
      throw error; // Propagar error al componente que llama
    } finally {
      setLoading(false);
    }
  };

    // REGISTRO DE NUEVO USUARIO    

  const register = async (
    email: string,
    password: string,
    displayName: string
  ) => {
    try {
      setLoading(true);
      const newUser = await authService.registrar(email, password, displayName);

      // Crear perfil completo en Firestore
      const userProfile: User = {
        ...newUser,
        monthlyBudget: PRESUPUESTO_DEFAULT,
      };
      await userService.crearPerfilUsuario(userProfile);
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

    // CERRAR SESIÓN

  const logout = async () => {
    try {
      setLoading(true);
      await authService.cerrarSesion();
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

   // ACTUALIZAR PERFIL DE USUARIO

  const updateProfile = async (data: Partial<User>) => {
    if (!user) return;

    try {
      await userService.actualizarPerfilUsuario(user.uid, data);
      setUser({ ...user, ...data });
    } catch (error) {
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};