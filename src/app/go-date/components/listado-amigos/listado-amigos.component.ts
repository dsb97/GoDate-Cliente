import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/login/model/user';
import { PerfilTarjeta } from '../../models/PerfilTarjeta';
import { RestUserServicio } from '../../services/rest-user.service';
import { Router } from '@angular/router';
import { ModoEdicion } from 'src/app/admin/models/modo';


@Component({
  selector: 'app-listado-amigos',
  templateUrl: './listado-amigos.component.html',
  styleUrls: ['./listado-amigos.component.scss']
})
export class ListadoAmigosComponent implements OnInit {

  public listaAmigos: PerfilTarjeta[] = [];
  public user: User = JSON.parse(window.sessionStorage.getItem("user") || '{}');
  public modo: typeof ModoEdicion = ModoEdicion;

  constructor(
    private restService: RestUserServicio,
    private router: Router
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

  public irAPerfil(id_usuario: number) {
    this.router.navigate(['/home/perfilUsuario'], { queryParams: { id: id_usuario, modo: this.modo.perfilVer } });
  }
}
