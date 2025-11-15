    import { useState } from 'react';
    import { Alert, Platform } from 'react-native';
    import {
    launchCamera,
    launchImageLibrary,
    ImagePickerResponse,
    CameraOptions,
    ImageLibraryOptions,
    } from 'react-native-image-picker';
    import {
    check,
    request,
    PERMISSIONS,
    RESULTS,
    } from 'react-native-permissions';

    export const useImagePicker = () => {
    const [imagen, setImagen] = useState<string | null>(null);
    const [cargando, setCargando] = useState(false);

    /**
     * Solicitar permisos de cámara
     */
    const solicitarPermisoCamara = async (): Promise<boolean> => {
        const permiso = Platform.select({
        ios: PERMISSIONS.IOS.CAMERA,
        android: PERMISSIONS.ANDROID.CAMERA,
        });

        if (!permiso) return false;

        const resultado = await check(permiso);

        if (resultado === RESULTS.GRANTED) {
        return true;
        }

        const resultadoSolicitud = await request(permiso);
        return resultadoSolicitud === RESULTS.GRANTED;
    };

    /**
     * Solicitar permisos de galería
     */
    const solicitarPermisoGaleria = async (): Promise<boolean> => {
        if (Platform.OS === 'ios') {
        const permiso = PERMISSIONS.IOS.PHOTO_LIBRARY;
        const resultado = await check(permiso);

        if (resultado === RESULTS.GRANTED) {
            return true;
        }

        const resultadoSolicitud = await request(permiso);
        return resultadoSolicitud === RESULTS.GRANTED;
        }

        // Android 13+ no necesita permiso para leer imágenes
        if (Platform.OS === 'android' && Platform.Version >= 33) {
        return true;
        }

        // Android < 13
        const permiso = PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE;
        const resultado = await check(permiso);

        if (resultado === RESULTS.GRANTED) {
        return true;
        }

        const resultadoSolicitud = await request(permiso);
        return resultadoSolicitud === RESULTS.GRANTED;
    };

    /**
     * Seleccionar imagen de galería
     */
    const seleccionarImagen = async (): Promise<string | undefined> => {
        try {
        const tienePermiso = await solicitarPermisoGaleria();
        if (!tienePermiso) {
            Alert.alert(
            'Permiso necesario',
            'Necesitamos acceso a tu galería para seleccionar imágenes'
            );
            return;
        }

        setCargando(true);

        const opciones: ImageLibraryOptions = {
            mediaType: 'photo',
            quality: 0.8,
            maxWidth: 1024,
            maxHeight: 1024,
        };

        launchImageLibrary(opciones, (respuesta: ImagePickerResponse) => {
            setCargando(false);

            if (respuesta.didCancel) {
            console.log('Usuario canceló la selección');
            return;
            }

            if (respuesta.errorCode) {
            console.error('Error al seleccionar:', respuesta.errorMessage);
            Alert.alert('Error', 'Error al seleccionar imagen');
            return;
            }

            if (respuesta.assets && respuesta.assets[0]) {
            const uri = respuesta.assets[0].uri;
            if (uri) {
                setImagen(uri);
            }
            }
        });
        } catch (error) {
        console.error('Error al seleccionar imagen:', error);
        Alert.alert('Error', 'Error al seleccionar imagen');
        setCargando(false);
        }
    };

    /**
     * Tomar foto con cámara
     */
    const tomarFoto = async (): Promise<string | undefined> => {
        try {
        const tienePermiso = await solicitarPermisoCamara();
        if (!tienePermiso) {
            Alert.alert(
            'Permiso necesario',
            'Necesitamos acceso a tu cámara para tomar fotos'
            );
            return;
        }

        setCargando(true);

        const opciones: CameraOptions = {
            mediaType: 'photo',
            quality: 0.8,
            maxWidth: 1024,
            maxHeight: 1024,
            saveToPhotos: false,
        };

        launchCamera(opciones, (respuesta: ImagePickerResponse) => {
            setCargando(false);

            if (respuesta.didCancel) {
            console.log('Usuario canceló la cámara');
            return;
            }

            if (respuesta.errorCode) {
            console.error('Error en cámara:', respuesta.errorMessage);
            Alert.alert('Error', 'Error al tomar foto');
            return;
            }

            if (respuesta.assets && respuesta.assets[0]) {
            const uri = respuesta.assets[0].uri;
            if (uri) {
                setImagen(uri);
            }
            }
        });
        } catch (error) {
        console.error('Error al tomar foto:', error);
        Alert.alert('Error', 'Error al tomar foto');
        setCargando(false);
        }
    };

    /**
     * Quitar imagen
     */
    const quitarImagen = () => {
        setImagen(null);
    };

    return {
        imagen,
        cargando,
        seleccionarImagen,
        tomarFoto,
        quitarImagen,
        setImagen,
    };
    };
