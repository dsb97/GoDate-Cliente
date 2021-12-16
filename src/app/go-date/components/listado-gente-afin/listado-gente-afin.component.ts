import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { PerfilReducido } from '../../models/PerfilReducido';
import { RestUserServicio } from '../../services/rest-user.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-listado-gente-afin',
  templateUrl: './listado-gente-afin.component.html',
  styleUrls: ['./listado-gente-afin.component.scss']
})
export class ListadoGenteAfinComponent implements OnInit {
  public listaAfines: PerfilReducido[] = [];
  
  public myId: number = 595;
  
  constructor(
    private restService: RestUserServicio,
    private toastr: ToastrService
    ) { }

  ngOnInit(): void {
    this.getListaAfinidades();
  }



  public getListaAfinidades() {
    this.restService.getListaAfinidades(this.myId).subscribe(
      (response) => {
        this.listaAfines = response;
    });
  }

  public like() {
    let id_d = this.listaAfines[0].id;
    let id_o = this.myId;

    this.restService.darLike(id_o, id_d).subscribe({
      next: (match) => {
        if(match == "true") {
          this.toastr.success('Tuviste una conexión con ' + this.listaAfines[0].nombre + '. Puedes ver el resto de conexiones en la pestaña Amigos', '¡Match!');
        }
        this.listaAfines = this.listaAfines.slice(1, this.listaAfines.length);
      },
      error: e => {
        this.toastr.error('Se produjo un error. No se ha guardado esta acción.', '¡Ups!');
      }
    });
  }

  public dislike() {
    let id_d = this.listaAfines[0].id;
    let id_o = this.myId;

    this.restService.darDislike(id_o, id_d).subscribe({
      next: () => {
        this.listaAfines = this.listaAfines.slice(1, this.listaAfines.length);
      },
      error: e => {
        this.toastr.error('Se produjo un error. No se ha guardado esta acción.', '¡Ups!');
      }
    });
  }
}
