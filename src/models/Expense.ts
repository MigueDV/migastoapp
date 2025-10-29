export interface Expense {
    id: string;
    userId: string;
    monto: number;
    categoria: string;
    descripcion: string;
    fecha: Date;
    imagenUrl?: string;
    creadoEn: Date;
    actualizadoEn: Date;
}

export interface CreateExpenseDTO {
    monto: number;
    categoria: string;
    descripcion: string;
    fecha: Date;
    imagenRecibo?: string;
}

export interface UpdateExpenseDTO {
    monto?: number;
    categoria?: string;
    descripcion?: string;
    fecha?: Date;
    imagenRecibo?: string;
}