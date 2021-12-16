import { Component, OnInit } from '@angular/core';
import { PerfilTarjeta } from '../../models/PerfilTarjeta';
import { RestUserServicio } from '../../services/rest-user.service';

@Component({
  selector: 'app-listado-gente-cerca',
  templateUrl: './listado-gente-cerca.component.html',
  styleUrls: ['./listado-gente-cerca.component.scss']
})
export class ListadoGenteCercaComponent implements OnInit {
  
  public listaGenteCerca: PerfilTarjeta[] = [];
  public myId: number = 609;

  constructor(
    private restService: RestUserServicio
  ) { }

  ngOnInit(): void {
    this.getListadoGenteCerca();
  }

  public getListadoGenteCerca() {
    this.restService.getListadoGenteCerca(this.myId).subscribe(
      (response) => {
        this.listaGenteCerca = response;
    });
  }
}

