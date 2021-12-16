import { Component, OnInit } from '@angular/core';
import { PerfilTarjeta } from '../../models/PerfilTarjeta';
import { RestUserServicio } from '../../services/rest-user.service';



@Component({
  selector: 'app-listado-amigos',
  templateUrl: './listado-amigos.component.html',
  styleUrls: ['./listado-amigos.component.scss']
})
export class ListadoAmigosComponent implements OnInit {

  public listaAmigos: PerfilTarjeta[] = [];
  public myId: number = 595;

  constructor(
    private restService: RestUserServicio
  ) { }

  ngOnInit(): void {
    this.getListaAmigos();
  }

  public getListaAmigos() {
    this.restService.getListaAmigos(this.myId).subscribe(
      (response) => {
        this.listaAmigos = response;
    });
  }
}
