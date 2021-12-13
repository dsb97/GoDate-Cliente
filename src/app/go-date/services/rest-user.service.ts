import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { PerfilReducido } from '../models/PerfilReducido';
import { PerfilReducidoResponse } from '../models/req-resp';


@Injectable({
  providedIn: 'root'
})
export class RestUserServicio {

  public urlListado: string = 'http://127.0.0.1:8000/api/user/listarAfinidades/595';
  public urlLike: string = 'http://127.0.0.1:8000/api/user/'
  constructor(private http: HttpClient) { }

  public getList() {
    return this.http.get<PerfilReducidoResponse[]>(this.urlListado).pipe(
      map((resp:PerfilReducidoResponse[]) => {
        return resp.map(lA => PerfilReducido.listaAfinesFromJSON(lA))
      })
    );
  }

  public darLike() {
    
  }
}
