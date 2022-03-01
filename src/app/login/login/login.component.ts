import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from '../model/user';
import { LoginServiceService } from '../services/login-service.service';
import { ToastrService } from 'ngx-toastr';
import { ModoEdicion } from 'src/app/admin/models/modo';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public clase: string;
  login: FormGroup;
  submitted: boolean = false;
  // user?: User;
  public roles = {
    "Administrador" : 1,
    "Usuario" :  2
  }
  public modosEdicion : typeof ModoEdicion = ModoEdicion;


  constructor(private formBuilder: FormBuilder,
    private restUserService: LoginServiceService,
    private router: Router,
    private toastr: ToastrService) {
    try {
      if (this.restUserService.getLoggedUser().id) {
        window.location.href = '/home';
      }
    } catch (error) {
      
    }

    this.clase = '';

    this.login = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.pattern]],
    });
  }

  ngOnInit(): void {
    this.cargarInicio();
  }

  cargarInicio() {
    let r = Math.round(Math.random() * (3 - 1) + 1);
    switch (r) {
      case 1:
        this.clase = 'hetero';
        break;
      case 2:
        this.clase = 'gay';
        break;
      case 3:
        this.clase = 'lesbiana';
        break;
      default:
        this.clase = 'gay';
        break;
    }
  }

  //Devuelve los controles del formulario (esto se usa en el html)
  get formulario() {
    return this.login.controls;
  }


  onSubmit() {
    this.submitted = true;
    if (this.login.invalid) return;

    this.restUserService.login(this.login.value.email, this.login.value.password).subscribe({
      next: (user) => {
        if (user) {
          window.location.href = '/home';
          this.restUserService.setLoggedUser(user);
        }
      },
      error: e => {
        this.toastr.error(e.error.mensaje ? e.error.mensaje : 'El usuario no existe en el sistema', 'Error');
      }
    })
  }

  registro() {
    this.router.navigate(['/alta'], {queryParams: {modo: this.modosEdicion.creacionFuera}});
  }

}
