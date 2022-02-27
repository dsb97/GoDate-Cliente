import { UserResponse } from "./req-response";

export class User {

  static userFromJSON(obj: UserResponse) {
    return new User(
      obj['id'],
      obj['correo'],
      obj['nombre'],
      obj['apellidos'],
      obj['foto'],
      obj['roles']
    );
  }

  constructor(
    public id: number,
    public correo: string,
    public nombre: string,
    public apellidos: string,
    public foto: string,
    public roles: number[]
    ){}
}
