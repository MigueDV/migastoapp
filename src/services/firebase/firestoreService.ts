import {
    collection,
    doc,
    addDoc,
    updateDoc,
    deleteDoc,
    getDoc,
    getDocs,
    query,
    where,
    orderBy,
    Timestamp,
    QueryConstraint,
    setDoc,
  } from 'firebase/firestore';
  import { db } from './config';
  
  class FirestoreService {
    /*Crear documento*/
    async crearDocumento<T>(
      nombreColeccion: string,
      datos: T,
      idDocumento?: string
    ): Promise<string> {
      try {
        const datosDocumento = {
          ...datos,
          creadoEn: Timestamp.now(),
          actualizadoEn: Timestamp.now(),
        };
  
        if (idDocumento) {
          const referenciaDoc = doc(db, nombreColeccion, idDocumento);
          await setDoc(referenciaDoc, datosDocumento);
          return idDocumento;
        } else {
          const referenciaDoc = await addDoc(
            collection(db, nombreColeccion),
            datosDocumento
          );
          return referenciaDoc.id;
        }
      } catch (error) {
        console.error('Error al crear documento:', error);
        throw new Error('Error al crear documento');
      }
    }
  
    /*Actualizar documento*/
    async actualizarDocumento<T>(
      nombreColeccion: string,
      idDocumento: string,
      datos: Partial<T>
    ): Promise<void> {
      try {
        const referenciaDoc = doc(db, nombreColeccion, idDocumento);
        await updateDoc(referenciaDoc, {
          ...datos,
          actualizadoEn: Timestamp.now(),
        });
      } catch (error) {
        console.error('Error al actualizar documento:', error);
        throw new Error('Error al actualizar documento');
      }
    }
  
    /*Eliminar documento*/
    async eliminarDocumento(
      nombreColeccion: string,
      idDocumento: string
    ): Promise<void> {
      try {
        const referenciaDoc = doc(db, nombreColeccion, idDocumento);
        await deleteDoc(referenciaDoc);
      } catch (error) {
        console.error('Error al eliminar documento:', error);
        throw new Error('Error al eliminar documento');
      }
    }
  
    /*Obtener documento por ID*/
    async obtenerDocumento<T>(
      nombreColeccion: string,
      idDocumento: string
    ): Promise<T | null> {
      try {
        const referenciaDoc = doc(db, nombreColeccion, idDocumento);
        const documentoSnap = await getDoc(referenciaDoc);
  
        if (documentoSnap.exists()) {
          return { id: documentoSnap.id, ...documentoSnap.data() } as T;
        }
        return null;
      } catch (error) {
        console.error('Error al obtener documento:', error);
        throw new Error('Error al obtener documento');
      }
    }
  
    /*Consultar documentos*/
    async consultarDocumentos<T>(
      nombreColeccion: string,
      restricciones: QueryConstraint[]
    ): Promise<T[]> {
      try {
        const consulta = query(collection(db, nombreColeccion), ...restricciones);
        const consultaSnapshot = await getDocs(consulta);
  
        return consultaSnapshot.docs.map((documento) => {
          const datos = documento.data();
          return {
            id: documento.id,
            ...datos,
            fecha: datos.fecha?.toDate(),
            creadoEn: datos.creadoEn?.toDate(),
            actualizadoEn: datos.actualizadoEn?.toDate(),
          } as T;
        });
      } catch (error) {
        console.error('Error al consultar documentos:', error);
        throw new Error('Error al consultar documentos');
      }
    }
  }
  
  export default new FirestoreService();