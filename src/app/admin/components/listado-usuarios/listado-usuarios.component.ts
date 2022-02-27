import { Component, OnInit } from '@angular/core';
import { Usuario } from '../../models/usuario';
import { AdminServiceService } from '../../services/admin-service.service'

@Component({
  selector: 'app-listado-usuarios',
  templateUrl: './listado-usuarios.component.html',
  styleUrls: ['./listado-usuarios.component.scss']
})
export class ListadoUsuariosComponent implements OnInit {

  public listaUsuarios: Usuario[] = [];
  constructor(private adminService: AdminServiceService) { }

  ngOnInit(): void {
    this.adminService.getListaUsuarios().subscribe(
      (response) => {
        this.listaUsuarios = response;
    });
  }

}
