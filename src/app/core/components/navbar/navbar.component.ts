import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/login/model/user';
import { RestUserServicio } from 'src/app/go-date/services/rest-user.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  //variable
  public imgLogo: string;
  public user: User = JSON.parse(window.sessionStorage.getItem('user') || '{}');


  constructor
  (
    private restUserServicio: RestUserServicio,
    private toastr: ToastrService
  ) {
    this.imgLogo = "./assets/images/LogoIzq.png";
  }

  ngOnInit(): void {

  }

  cerrarSesion() {
    this.restUserServicio.cerrarSesion(this.user.id).subscribe({
      next: () => {
        window.sessionStorage.clear();
        window.location.href = '/';
      },
      error: e => {
        this.toastr.error('Se produjo un error al cerrar sesión', '¡Ups!');
      }
    });
  }

}
