import RNFS from 'react-native-fs';
import { Platform } from 'react-native';

class StorageService {
  // Carpeta donde se guardan las imágenes
  private carpetaImagenes = `${RNFS.DocumentDirectoryPath}/recibos`;

  /*Inicializar carpeta de imágenes*/
  private async inicializarCarpeta(): Promise<void> {
    const existe = await RNFS.exists(this.carpetaImagenes);
    if (!existe) {
      await RNFS.mkdir(this.carpetaImagenes);
    }
  }

  /*Guardar imagen localmente y retornar la ruta*/
  async subirRecibo(uri: string, userId: string): Promise<string> {
    try {
      await this.inicializarCarpeta();

      // Generar nombre único
      const nombreArchivo = `recibo_${userId}_${Date.now()}.jpg`;
      const rutaDestino = `${this.carpetaImagenes}/${nombreArchivo}`;

      // Copiar imagen a la carpeta de la app
      await RNFS.copyFile(uri, rutaDestino);

      console.log('✅ Imagen guardada localmente:', rutaDestino);
      
      // Retornar ruta local (se guarda en Firestore)
      return `file://${rutaDestino}`;
    } catch (error) {
      console.error('Error al guardar imagen:', error);
      throw new Error('Error al guardar la imagen');
    }
  }

  /*Guardar foto de perfil localmente*/
  async subirFotoPerfil(uri: string, userId: string): Promise<string> {
    try {
      await this.inicializarCarpeta();

      const nombreArchivo = `perfil_${userId}.jpg`;
      const rutaDestino = `${this.carpetaImagenes}/${nombreArchivo}`;

      // Si ya existe, eliminarla
      const existe = await RNFS.exists(rutaDestino);
      if (existe) {
        await RNFS.unlink(rutaDestino);
      }

      await RNFS.copyFile(uri, rutaDestino);
      
      console.log('✅ Foto de perfil guardada localmente:', rutaDestino);
      
      return `file://${rutaDestino}`;
    } catch (error) {
      console.error('Error al guardar foto de perfil:', error);
      throw new Error('Error al guardar la foto');
    }
  }

  /*Eliminar imagen local*/
  async eliminarImagen(urlImagen: string): Promise<void> {
    try {
      // Extraer ruta del file://
      const ruta = urlImagen.replace('file://', '');
      
      const existe = await RNFS.exists(ruta);
      if (existe) {
        await RNFS.unlink(ruta);
        console.log('✅ Imagen local eliminada:', ruta);
      }
    } catch (error) {
      console.error('Error al eliminar imagen:', error);
      // No lanzar error - si no existe, no pasa nada
    }
  }

  /*Verificar si una imagen existe*/
  async existeImagen(urlImagen: string): Promise<boolean> {
    try {
      const ruta = urlImagen.replace('file://', '');
      return await RNFS.exists(ruta);
    } catch (error) {
      return false;
    }
  }
}

export default new StorageService();