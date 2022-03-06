import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/login/model/user';
import { RestUserServicio } from 'src/app/go-date/services/rest-user.service';
import { ToastrService } from 'ngx-toastr';
import { ModoEdicion } from 'src/app/admin/models/modo';
import { LoginServiceService } from 'src/app/login/services/login-service.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  //variable
  public imgLogo: string;
  public roles = {
    "Administrador" : 1,
    "Usuario" :  2
  }
  public user!: User;
  public modoEdicion: typeof ModoEdicion = ModoEdicion;


  constructor
  (
    private router: Router,
    private restUserServicio: RestUserServicio,
    private loginService: LoginServiceService,
    private toastr: ToastrService
  ) {
    this.imgLogo = "./assets/images/LogoIzq.png";
  }

  ngOnInit(): void {
    this.user = this.loginService.getLoggedUser();
    this.loginService.usuarioTrigger.subscribe({
      next: (data: User) => {
        this.user = data;
      },
    });
  }

  perfil() {
    this.router.navigate(['/home/perfil'], {queryParams: { id: this.user.id, modo: this.modoEdicion.perfilEditar }});
  }

  cerrarSesion() {
    this.restUserServicio.cerrarSesion(this.user.id).subscribe({
      next: () => {
        this.loginService.removeLoggedUser();
        window.location.href = '/';
      },
      error: e => {
        this.toastr.error('Se produjo un error al cerrar sesión', '¡Ups!');
      }
    });
  }

  home() {
    if(this.router.url.includes('admin')) {
      this.router.navigate(['/admin/usuarios']);
    } else {
      this.router.navigate(['/home']);

    }
  }

}
