import { Preferencias } from "./preferencias";

export interface usuarioResponse {
    id: number,
    nombre: string,
    apellidos: string,
    foto: string,
    conectado: number,
    activo: number,
    correo?: string,
    pass?: string,
    id_genero?: number,
    fecha_nacimiento?: Date,
    ciudad?: string,
    descripcion?: string,
    hijos?: number,
    gustosGenero?: number[],
    preferencias?: Preferencias[]
    roles?: number[],
    file? : any
}
