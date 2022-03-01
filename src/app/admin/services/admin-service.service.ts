import { HttpClient, HttpHeaders } from '@angular/common/http';
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

  public eliminarUsuario(id_usuario: Number) {
    let url = this.baseURL + this.urlBorrarUsuario + id_usuario;
    return this.http.delete<any>(url).pipe(
      map((resp: any) => {
        return resp;
      })
    );
  }

  public detalleUsuario(id_usuario: number) {
    let url = this.baseURL + this.urlDetalleUsuario + id_usuario;
    return this.http.get<Usuario>(url).pipe(
      map((resp: Usuario) => {
        return resp;
      })
    )
  }

  public actualizarUsuario(usuario: Usuario) {
    let url = this.baseURL + this.urlActualizarUsuario;

    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    
    return this.http.post<any>(url, usuario, { headers: headers }).pipe(
      map((resp: any) => {
        return resp;
      })
    );


  }
}
