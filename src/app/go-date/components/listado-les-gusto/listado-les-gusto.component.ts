import { Component, OnInit } from '@angular/core';
import { PerfilTarjeta } from '../../models/PerfilTarjeta';
import { RestUserServicio } from '../../services/rest-user.service';

@Component({
  selector: 'app-listado-les-gusto',
  templateUrl: './listado-les-gusto.component.html',
  styleUrls: ['./listado-les-gusto.component.scss']
})
export class ListadoLesGustoComponent implements OnInit {

  public listaLesGusto: PerfilTarjeta[] = [];
  public myId: number = 595;

  constructor(
    private restService: RestUserServicio
  ) { }

  ngOnInit(): void {
    this.getListadoLesGusto();
  }

  public getListadoLesGusto() {
    this.restService.getListadoLesGusto(this.myId).subscribe(
      (response) => {
        this.listaLesGusto = response;
    });
  }
}
