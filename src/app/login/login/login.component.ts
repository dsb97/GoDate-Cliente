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

    this.login = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.pattern('(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9]).{8,}')]],
    });
  }

  ngOnInit(): void {
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
          if(user.roles.includes(2)){
            window.location.href = '/home';
          } else {
          window.location.href = '/admin/usuarios';
          }
          this.restUserService.setLoggedUser(user);
        }
      },
      error: e => {
        this.toastr.error(e.error.mensaje ? e.error.mensaje : 'Error desconocido', 'Error');
      }
    })
  }

  registro() {
    this.router.navigate(['/alta'], {queryParams: {modo: this.modosEdicion.creacionFuera}});
  }

}
