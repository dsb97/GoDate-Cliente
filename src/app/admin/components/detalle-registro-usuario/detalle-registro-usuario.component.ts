import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Usuario } from '../../models/usuario';
import { Preferencias } from '../../models/preferencias';
import { AdminServiceService } from '../../services/admin-service.service';
import { ModoEdicion } from '../../models/modo';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { TipoPreferencias } from '../../models/tipoPreferencias';
import { ToastrService } from 'ngx-toastr';
import { LoginServiceService } from 'src/app/login/services/login-service.service';
import { User } from 'src/app/login/model/user';


@Component({
  selector: 'app-detalle-registro-usuario',
  templateUrl: './detalle-registro-usuario.component.html',
  styleUrls: ['./detalle-registro-usuario.component.scss']
})
export class DetalleRegistroUsuarioComponent implements OnInit {

  public tituloPantalla = '';
  public idUsuario: number = 0;
  public modo?: number;
  public usuario!: Usuario;
  public modoEdicion: typeof ModoEdicion = ModoEdicion;
  public tipoPreferencias: typeof TipoPreferencias = TipoPreferencias;
  public formUsuario!: FormGroup;
  public submitted: boolean = false;
  public gustosGenero: Array<{ id: number, descripcion: string }> = [
    { id: 1, descripcion: 'Hombre' },
    { id: 2, descripcion: 'Mujer' },
    { id: 3, descripcion: 'No binario' },
  ]
  public roles: Array<{ id: number, descripcion: string }> = [
    { id: 1, descripcion: 'Administrador' },
    { id: 2, descripcion: 'Ususario' },
  ]

  public tipoRelacion: Array<{ intensidad: number, descripcion: string }> = [
    { intensidad: 0, descripcion: 'Cerrada' },
    { intensidad: 50, descripcion: 'Abierta' },
    { intensidad: 100, descripcion: 'Poliamorosa' },
  ]

  constructor(
    private adminService: AdminServiceService,
    private loginService: LoginServiceService,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private router: Router,
    private toastr: ToastrService,
  ) {
    this.formUsuario = this.formBuilder.group({
      //----------------USUARIO----------------
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      apellidos: ['', [Validators.required, Validators.minLength(3)]],
      correo: ['', [Validators.required, Validators.email]],
      pass: ['', this.modo === this.modoEdicion.creacionAdmin ? [Validators.required] : []],
      genero: ['', [Validators.required]],
      fecha_nacimiento: ['', [Validators.required]],
      ciudad: ['', [Validators.required]],
      descripcion: ['', [Validators.required]],
      //IMPLEMENTAR EL LUNES
      foto: ['', [Validators.required]],
      numHijos: ['', [Validators.required]],
      gustosGenero: this.formBuilder.array([], [Validators.required]),
      //----------------PREFERENCIAS----------------
      relacion: ['', Validators.required],
      edadMaxima: ['', Validators.required],
      edadMinima: ['', Validators.required],
      deportes: ['', Validators.required],
      arte: ['', Validators.required],
      cultura: ['', Validators.required],
      politica: ['', Validators.required],
      hijos: [''],
      //----------------ADMINISTRACIÓN----------------
      roles: this.formBuilder.array([], (this.modo === (this.modoEdicion.edicionAdmin || this.modoEdicion.creacionAdmin) ? [Validators.required] : [])),
      activo: ['']
    });
  }

  async ngOnInit(): Promise<void> {

    await this.route.queryParams.subscribe(params => {
      this.modo = parseInt(params['modo'] + '');
      switch (this.modo) {
        case this.modoEdicion.creacionAdmin:
          this.idUsuario = 0;
          this.usuario = new Usuario(0, '', '', 'https://picsum.photos/350', 0, 0);
          this.rellenarFormulario();
          this.tituloPantalla = 'Nuevo usuario';
          break;

        case this.modoEdicion.edicionAdmin:
          this.idUsuario = parseInt(params['id'] + '');
          this.adminService.detalleUsuario(this.idUsuario).subscribe({
            next: (res) => {
              this.usuario = res;
              this.rellenarFormulario();
            }
          });
          this.tituloPantalla = 'Editar usuario';
          break;

        case this.modoEdicion.perfilEditar:
          this.idUsuario = parseInt(params['id'] + '');
          this.adminService.detalleUsuario(this.idUsuario).subscribe({
            next: (res) => {
              this.usuario = res;
              this.tituloPantalla = `Perfil de ${this.usuario.nombre}`;
              this.rellenarFormulario();
            }
          });
          break;

        case this.modoEdicion.creacionFuera:
          this.idUsuario = 0;
          this.usuario = new Usuario(0, '', '', '././assets/images/DefaultUser.png', 0, 0);
          this.usuario.roles = [2];
          this.rellenarFormulario();
          this.tituloPantalla = '¡Bienvenido a GoDate!';
          break;

        default:
          break;
      }


    });
  }


  /**
   * Rellena el formulario con la información del usuario
   */
  rellenarFormulario() {
    this.formUsuario.controls['foto'].setValue(this.usuario.foto);
    this.formUsuario.controls['nombre'].setValue(this.usuario.nombre);
    this.formUsuario.controls['apellidos'].setValue(this.usuario.apellidos);
    this.formUsuario.controls['correo'].setValue(this.usuario.correo);
    this.formUsuario.controls['pass'].setValue(this.usuario.pass);
    this.formUsuario.controls['fecha_nacimiento'].setValue(this.usuario.fecha_nacimiento);
    this.formUsuario.controls['ciudad'].setValue(this.usuario.ciudad);
    this.formUsuario.controls['descripcion'].setValue(this.usuario.descripcion);
    this.formUsuario.controls['numHijos'].setValue(this.usuario.hijos);
    this.formUsuario.controls['genero'].setValue(this.usuario.id_genero);
    this.formUsuario.controls['edadMinima'].setValue(this.buscarIntensidad(this.usuario.preferencias, this.tipoPreferencias.edadMin));
    this.formUsuario.controls['edadMaxima'].setValue(this.buscarIntensidad(this.usuario.preferencias, this.tipoPreferencias.edadMax));
    this.formUsuario.controls['relacion'].setValue(this.buscarIntensidad(this.usuario.preferencias, this.tipoPreferencias.relacion));
    this.formUsuario.controls['deportes'].setValue(this.buscarIntensidad(this.usuario.preferencias, this.tipoPreferencias.deportes));
    this.formUsuario.controls['cultura'].setValue(this.buscarIntensidad(this.usuario.preferencias, this.tipoPreferencias.cultura));
    this.formUsuario.controls['arte'].setValue(this.buscarIntensidad(this.usuario.preferencias, this.tipoPreferencias.arte));
    this.formUsuario.controls['politica'].setValue(this.buscarIntensidad(this.usuario.preferencias, this.tipoPreferencias.politica));

    this.formUsuario.controls['hijos'].setValue(this.usuario.hijos == 1)

    this.formUsuario.controls['activo'].setValue(this.usuario.activo == 1)

    const formArrayGustosGenero: FormArray = this.formUsuario.get('gustosGenero') as FormArray;
    this.usuario.gustosGenero?.forEach(element => {
      formArrayGustosGenero.push(new FormControl(element));
    });

    const formArrayRoles: FormArray = this.formUsuario.get('roles') as FormArray;
    this.usuario.roles?.forEach(element => {
      formArrayRoles.push(new FormControl(element));
    });



  }

  /**
   * Asigna el género escogido en el select a la variable correspondiente en el formulario
   * @param event Evento OnChange del select
   */
  cambiarGenero(event: any) {
    console.log(event.target);
    this.formulario['genero'].setValue(event.target.value);
  }

  /**
  * Asigna el tipo de relación escogido en el select a la variable correspondiente en el formulario
  * @param event Evento OnChange del select
  */
  cambiarRelacion(event: any) {
    this.formulario['relacion'].setValue(event.target.value, {
      onlySelf: true,
    });
  }

  /**
  * Asigna los géneros escogidos en los checkboxes a la variable correspondiente en el formulario
  * @param event Evento OnChange del checkbox
  */
  cambiarGustosGenero(e: any) {
    const checkArray: FormArray = this.formUsuario.get('gustosGenero') as FormArray;
    if (e.target.checked) {
      checkArray.push(new FormControl(e.target.value));
    } else {
      let i: number = 0;
      checkArray.controls.forEach((item: any) => {
        if (item.value == e.target.value) {
          checkArray.removeAt(i);
          return;
        }
        i++;
      });
    }
  }

  /**
  * Asigna los roles escogidos en los checkbox a la variable correspondiente en el formulario
  * @param event Evento OnChange del checkbox
  */
  cambiarRoles(e: any) {
    const checkArray: FormArray = this.formUsuario.get('roles') as FormArray;
    if (e.target.checked) {
      checkArray.push(new FormControl(e.target.value));
    } else {
      let i: number = 0;
      checkArray.controls.forEach((item: any) => {
        if (item.value == e.target.value) {
          checkArray.removeAt(i);
          return;
        }
        i++;
      });
    }
  }

  /**
  * Asigna la preferencia Hijos en el checkbox a la variable correspondiente en el formulario
  * @param event Evento OnChange del checkbox
  */
  cambiarPreferenciasHijos(event: any) {
    this.formulario['hijos'].setValue(event.target.checked ? 100 : 0);
  }

  /**
   * Asigna el usuario activado en el checkbox a la variable correspondiente en el formulario
   * @param event Evento OnChange del checkbox
   */
  cambiarActivo(event: any) {
    this.formulario['activo'].setValue(event.target.checked ? 1 : 0);
  }

  onSubmit() {
    this.submitted = true;
    if (this.formUsuario.invalid) {
      //Comprobación de por qué no se envió el formulario
      const invalid = [];
      const controls = this.formUsuario.controls;
      for (const name in controls) {
        if (controls[name].invalid) {
          invalid.push(name);
        }
      }
      console.log(invalid);

    } else {
      let usuarioModificado = this.generarUsuario();

      switch (this.modo) {
        case this.modoEdicion.creacionAdmin:
          this.adminService.nuevoUsuario(usuarioModificado).subscribe({
            next: (respuesta) => {
              this.toastr.success(respuesta.mensaje, '');
              this.router.navigate(['/admin/usuarios']);
            },
            error: (error) => {
              this.toastr.error(error.error.mensaje, '');
            }
          });
          break;

        case this.modoEdicion.edicionAdmin:
          this.adminService.actualizarUsuario(usuarioModificado).subscribe({
            next: (respuesta) => {
              this.toastr.success(respuesta.mensaje, '');
              this.router.navigate(['/admin/usuarios']);
            },
            error: (error) => {
              this.toastr.error(error.error.mensaje, '');
            }
          });
          break;

        case this.modoEdicion.perfilEditar:
          this.adminService.actualizarUsuario(usuarioModificado).subscribe({
            next: (respuesta) => {
              this.toastr.success(respuesta.mensaje, '');
              this.router.navigate(['/home']);
              let logedUser = new User(
                usuarioModificado.id,
                usuarioModificado.correo!,
                usuarioModificado.nombre,
                usuarioModificado.apellidos,
                usuarioModificado.foto,
                usuarioModificado.roles!);
              this.loginService.setLoggedUser(logedUser);
            },
            error: (error) => {
              this.toastr.error(error.error.mensaje, '');
            }
          });
          break;

        case this.modoEdicion.creacionFuera:
          this.adminService.nuevoUsuario(usuarioModificado).subscribe({
            next: (respuesta) => {
              this.toastr.success(respuesta.mensaje, '');
              this.router.navigate(['']);
            },
            error: (error) => {
              this.toastr.error(error.error.mensaje, '');
            }
          });
          break;
        default:
          break;
      }
    }
  }

  volver() {
    switch (this.modo) {
      case this.modoEdicion.creacionFuera:
        this.router.navigate(['']);
        break;
      case this.modoEdicion.edicionAdmin:
        this.router.navigate(['/admin/usuarios']);
        break;
      case this.modoEdicion.perfilEditar:
        this.router.navigate(['/home']);
        break;
    }
  }

  get formulario() {
    return this.formUsuario.controls;
  }

  /**
   * Busca la intensidad de la preferencia
   * @param array Array de preferencias del usuario
   * @param descripcion Descripción de la preferencia a buscar
   * @returns Intensidad de la preferencia
   */
  buscarIntensidad(array: any, descripcion: string): number {
    let intensidad = 0;
    try {
      intensidad = array.find((obj: Preferencias) => {
        return obj.descripcion == descripcion
      }).intensidad;
    } catch (error) {
      intensidad = 0;
    }
    return intensidad;
  }

  /**
   * Genera el usuario con la información del usuario
   * @returns Usuario con la información del formulario
   */
  generarUsuario() {
    //---------------------Gustos género--------------------
    let arrayGustosGenero: number[] = [];
    const formArrayGustosGenero: FormArray = this.formUsuario.get('gustosGenero') as FormArray;
    formArrayGustosGenero.controls.forEach((item: any) => {
      arrayGustosGenero.push(item.value)
    });

    //---------------------Preferencias---------------------
    //Relacion
    let relacion = new Preferencias(1, this.tipoPreferencias.relacion, this.formUsuario.value.relacion);
    //Deportes
    let deportes = new Preferencias(2, this.tipoPreferencias.deportes, this.formUsuario.value.deportes);
    //Arte
    let arte = new Preferencias(3, this.tipoPreferencias.arte, this.formUsuario.value.arte);
    //Cultura
    let cultura = new Preferencias(4, this.tipoPreferencias.cultura, this.formUsuario.value.cultura);
    //Política
    let politica = new Preferencias(5, this.tipoPreferencias.politica, this.formUsuario.value.politica);
    //Hijos
    let hijos = new Preferencias(6, this.tipoPreferencias.hijos, this.formUsuario.value.hijos);
    //Edad minima
    let edadMinima = new Preferencias(7, this.tipoPreferencias.edadMin, this.formUsuario.value.edadMinima);
    //Edad máxima
    let edadMaxima = new Preferencias(8, this.tipoPreferencias.edadMax, this.formUsuario.value.edadMaxima);

    let arrayPreferencias = [relacion, deportes, arte, cultura, politica, hijos, edadMaxima, edadMinima];


    //----------------------Roles---------------------
    let arrayRoles: number[] = [];
    const formArrayRoles: FormArray = this.formUsuario.get('roles') as FormArray;
    formArrayRoles.controls.forEach((item: any) => {
      arrayRoles.push(parseInt(item.value + ''))
    });

    //---------------------Usuario---------------------

    return new Usuario(
      this.idUsuario,
      this.formUsuario.value.nombre,
      this.formUsuario.value.apellidos,
      this.formUsuario.value.foto,
      0,
      this.formUsuario.value.activo ? 1 : 0,
      this.formUsuario.value.correo,
      this.formUsuario.value.pass,
      this.formUsuario.value.genero,
      this.formUsuario.value.fecha_nacimiento,
      this.formUsuario.value.ciudad,
      this.formUsuario.value.descripcion,
      this.formUsuario.value.numHijos,
      arrayGustosGenero,
      arrayPreferencias,
      arrayRoles,
    );

  }
}
