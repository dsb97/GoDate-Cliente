import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/login/model/user';
import { PerfilTarjeta } from '../../models/PerfilTarjeta';
import { RestUserServicio } from '../../services/rest-user.service';

@Component({
  selector: 'app-listado-gente-cerca',
  templateUrl: './listado-gente-cerca.component.html',
  styleUrls: ['./listado-gente-cerca.component.scss']
})
export class ListadoGenteCercaComponent implements OnInit {
  
  public listaGenteCerca: PerfilTarjeta[] = [];
  public user: User = JSON.parse(window.sessionStorage.getItem("user") || '{}');

  constructor(
    private restService: RestUserServicio
  ) { }

  ngOnInit(): void {
    this.getListadoGenteCerca();
  }

  public getListadoGenteCerca() {
    this.restService.getListadoGenteCerca(this.user.id).subscribe(
      (response) => {
        this.listaGenteCerca = response;
    });
  }
}

