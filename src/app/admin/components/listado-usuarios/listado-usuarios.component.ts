import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Usuario } from '../../models/usuario';
import { AdminServiceService } from '../../services/admin-service.service'
import { Router } from '@angular/router';
import { LoginServiceService } from 'src/app/login/services/login-service.service';
import { ModoEdicion } from '../../models/modo';

@Component({
  selector: 'app-listado-usuarios',
  templateUrl: './listado-usuarios.component.html',
  styleUrls: ['./listado-usuarios.component.scss']
})
export class ListadoUsuariosComponent implements OnInit {

  public listaUsuarios: Usuario[] = [];
  public modoEdicion: typeof ModoEdicion = ModoEdicion;


  constructor(
    private adminService: AdminServiceService,
    private toastr: ToastrService,
    private router: Router,
    public loginService: LoginServiceService,
  ) {
  }

  ngOnInit(): void {
    this.adminService.getListaUsuarios().subscribe(
      (response) => {
        this.listaUsuarios = response;

        this.cargarTabla();
      });

  }

  cargarTabla(): void {
    setTimeout(() => {
      $('#tablaDatos').DataTable({
        pagingType: 'full_numbers',
        pageLength: 10,
        processing: true,
        lengthMenu: [5, 10, 20, 50],
        language: {
          "lengthMenu": "Mostrar _MENU_ registros por página",
          "zeroRecords": "Sin resultados",
          "info": "Mostrando página _PAGE_ de _PAGES_",
          "infoEmpty": "Sin registros disponibles",
          "infoFiltered": "(_MAX_ registros totales)",
          "search": "Filtrar: ",
          "searchPlaceholder": "Escriba para empezar",
          "paginate": {
            "first": "<<",
            "last": ">>",
            "next": ">",
            "previous": "<",
          },
        }
      });
    }, 1);
  }

  eliminar(id_usuario: number): void {
    this.adminService.eliminarUsuario(id_usuario).subscribe(
      {
        next: (response) => {
          this.toastr.success(response.mensaje, '');
          this.adminService.getListaUsuarios().subscribe(
            (response) => {
              this.listaUsuarios = response;
            });
        },
        error: e => {
          this.toastr.error('No se pudo eliminar el usuario', '')
        }
      }
    );
  }

  editar(id_usuario: number): void {
    this.router.navigate(['/admin/editar'], { queryParams: { id: id_usuario, modo: this.modoEdicion.edicionAdmin } });
  }

  nuevoUsuario(): void {
    this.router.navigate(['/admin/nuevo'], { queryParams: { modo: this.modoEdicion.creacionAdmin } });
  }




}
