import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModoEdicion } from 'src/app/admin/models/modo';
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
  public modo : typeof ModoEdicion = ModoEdicion;

  constructor(
    private restService: RestUserServicio,
    private router: Router
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

  public irAPerfil(id_usuario: number) {
    this.router.navigate(['/home/perfilUsuario'], { queryParams: { id: id_usuario, modo: this.modo.perfilVer } });
  }
}

