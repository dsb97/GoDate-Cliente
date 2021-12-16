import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { PerfilReducido } from '../models/PerfilReducido';
import { PerfilTarjeta } from '../models/PerfilTarjeta';
import { PerfilTarjetaResponse } from '../models/PerfilTarjetaResponse';
import { PerfilReducidoResponse } from '../models/req-resp';


@Injectable({
  providedIn: 'root'
})
export class RestUserServicio {

  public baseURL: string = 'http://127.0.0.1:8000/api/user/';
  public urlListadoAfinidades: string = 'listarAfinidades/';
  public urlListadoAmigos: string = 'listarAmigos/';
  public urlListadoGenteCerca: string = 'listarGenteCerca/';
  public urlListadoLesGusto: string = 'listarLesGusto/';
  constructor(private http: HttpClient) { }

  public getListaAfinidades(usuario: number) {
    let url = this.baseURL + this.urlListadoAfinidades + usuario.toString();
    
    return this.http.get<PerfilReducidoResponse[]>(url).pipe(
      map((resp:PerfilReducidoResponse[]) => {
        return resp.map(lA => PerfilReducido.listaAfinesFromJSON(lA))
      })
    );
  }

  public getListaAmigos(usuario: number) {
    let url = this.baseURL + this.urlListadoAmigos + usuario.toString();
    
    return this.http.get<PerfilTarjeta[]>(url).pipe(
      map((resp:PerfilTarjetaResponse[]) => {
        return resp.map(lA => PerfilTarjeta.perfilTarjetaFromJSON(lA))
      })
    );
  }

  public getListadoGenteCerca(usuario: number) {
    let url = this.baseURL + this.urlListadoGenteCerca + usuario.toString();
    
    return this.http.get<PerfilTarjeta[]>(url).pipe(
      map((resp:PerfilTarjetaResponse[]) => {
        return resp.map(lA => PerfilTarjeta.perfilTarjetaFromJSON(lA))
      })
    );
  }

  public getListadoLesGusto(usuario: number) {
    let url = this.baseURL + this.urlListadoLesGusto + usuario.toString();
    
    return this.http.get<PerfilTarjeta[]>(url).pipe(
      map((resp:PerfilTarjetaResponse[]) => {
        return resp.map(lA => PerfilTarjeta.perfilTarjetaFromJSON(lA))
      })
    );
  }

  public darLike(id_o: number, id_d: number) {
    let url = this.baseURL + 'like';
    let data = {
      "id_o": id_o,
      "id_d": id_d
    }
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this.http.post<any>(url, data, {headers: headers});
  }

  public darDislike(id_o: number, id_d: number) {
    let url = this.baseURL + 'dislike';
    let data = {
      "id_o": id_o,
      "id_d": id_d
    }
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this.http.post<any>(url, data, {headers: headers});
  }

  public cerrarSesion(id: number) {
    let url = this.baseURL + 'cerrarSesion/' + id;
    let data = {
      "id": id
    }
    return this.http.get<any>(url);
  }
}
