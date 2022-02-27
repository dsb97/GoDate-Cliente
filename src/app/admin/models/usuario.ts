import { Preferencias } from "./preferencias";
import { usuarioResponse } from "./usuarioResponse";
export class Usuario {

  static usuarioFromJSON(obj: usuarioResponse) {
    return new Usuario(
      obj['id'],
      obj['nombre'],
      obj['apellidos'],
      obj['foto'],
      obj['conectado'],
      obj['activo']
    );
  }

  constructor(
    public id: number,
    public nombre: string,
    public apellidos: string,
    public foto: string,
    public conectado: number,
    public activo: number,
    public correo?: string,
    public id_genero?: number,
    public fecha_nacimiento?:Date,
    public ciudad?: string,
    public descripcion?: string,
    public hijos?:number,
    public gustosGenero?: number[],
    public preferencias?: Preferencias[]
    ){}
}
