import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ModoEdicion } from 'src/app/admin/models/modo';
import { User } from 'src/app/login/model/user';
import { PerfilTarjeta } from '../../models/PerfilTarjeta';
import { RestUserServicio } from '../../services/rest-user.service';

@Component({
  selector: 'app-listado-les-gusto',
  templateUrl: './listado-les-gusto.component.html',
  styleUrls: ['./listado-les-gusto.component.scss']
})
export class ListadoLesGustoComponent implements OnInit {

  public listaLesGusto: PerfilTarjeta[] = [];
  public user: User = JSON.parse(window.sessionStorage.getItem("user") || '{}');
  public modo: typeof ModoEdicion = ModoEdicion;
  
  constructor(
    private restService: RestUserServicio,
    private router: Router,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.getListadoLesGusto();
  }

  public getListadoLesGusto() {
    this.restService.getListadoLesGusto(this.user.id).subscribe(
      (response) => {
        this.listaLesGusto = response;
    });
  }

  public irAPerfil(id_usuario: number) {
    this.router.navigate(['/home/perfilUsuario'], { queryParams: { id: id_usuario, modo: this.modo.perfilVer } });
  }

  public like(id_usuario: number, nombre: string) {
    let id_d = id_usuario;
    let id_o = this.user.id;

    this.restService.darLike(id_o, id_d).subscribe({
      next: (match) => {
        if(match == "true") {
          this.toastr.success('Tuviste una conexión con ' + nombre + '. Puedes ver el resto de conexiones en la pestaña Amigos', '¡Match!');
        }

        //this.listaAfines = this.listaAfines.slice(1, this.listaAfines.length);

        // if(this.listaAfines.length == 0) {
        //   this.getListaAfinidades();
        // }


        let filter = this.listaLesGusto.findIndex(persona => persona.id == id_usuario);


        let arrayIzquierda = this.listaLesGusto.slice(0, filter);
        let arrayDerecha = this.listaLesGusto.slice(filter + 1, this.listaLesGusto.length);
        Array.prototype.push.apply(arrayIzquierda, arrayDerecha);
        
        this.listaLesGusto = arrayIzquierda;

      },
      error: e => {
        this.toastr.error('Se produjo un error. No se ha guardado esta acción.', '¡Ups!');
      }
    });
  }

  public dislike(id_usuario: number) {
    let id_d = id_usuario;
    let id_o = this.user.id;

    this.restService.darDislike(id_o, id_d).subscribe({
      next: () => {
        //this.listaAfines = this.listaAfines.slice(1, this.listaAfines.length);

        // if(this.listaAfines.length == 0) {
        //   this.getListaAfinidades();
        // }

        let filter = this.listaLesGusto.findIndex(persona => persona.id == id_usuario);


        let arrayIzquierda = this.listaLesGusto.slice(0, filter);
        let arrayDerecha = this.listaLesGusto.slice(filter + 1, this.listaLesGusto.length);
        Array.prototype.push.apply(arrayIzquierda, arrayDerecha);
        
        this.listaLesGusto = arrayIzquierda;

      },
      error: e => {
        this.toastr.error('Se produjo un error. No se ha guardado esta acción.', '¡Ups!');
      }
    });
  }
}
