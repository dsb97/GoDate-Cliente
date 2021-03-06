import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/login/model/user';
import { PerfilTarjeta } from '../../models/PerfilTarjeta';
import { RestUserServicio } from '../../services/rest-user.service';



@Component({
  selector: 'app-listado-amigos',
  templateUrl: './listado-amigos.component.html',
  styleUrls: ['./listado-amigos.component.scss']
})
export class ListadoAmigosComponent implements OnInit {

  public listaAmigos: PerfilTarjeta[] = [];
  public user: User = JSON.parse(window.sessionStorage.getItem("user") || '{}');

  constructor(
    private restService: RestUserServicio
  ) { }

  ngOnInit(): void {
    this.getListaAmigos();
  }

  public getListaAmigos() {
    this.restService.getListaAmigos(this.user.id).subscribe(
      (response) => {
        this.listaAmigos = response;
    });
  }
}
