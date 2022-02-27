import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { Usuario } from '../models/usuario';
import { usuarioResponse } from '../models/usuarioResponse';

@Injectable({
  providedIn: 'root'
})
export class AdminServiceService {

  public baseURL: string = 'http://127.0.0.1:8000/api/admin/';
  public urlListarUsuarios: string = 'listarUsuarios/';
  public urlDetalleUsuario: string = 'detalleUsuario/';
  public urlAltaUsuario: string = 'altaUsuario/';
  public urlActualizarUsuario: string = 'actualizarUsuario/';
  public urlBorrarUsuario: string = 'borrarUsuario/';

  constructor(private http: HttpClient) { }

  public getListaUsuarios() {
    let url = this.baseURL + this.urlListarUsuarios;

    return this.http.get<Usuario[]>(url).pipe(
      map((resp: usuarioResponse[]) => {
        return resp.map(lA => Usuario.usuarioFromJSON(lA))
      })
    );
  }
}
