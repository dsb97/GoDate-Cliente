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
import { ciudades } from '../../models/ciudades';
import { User } from 'src/app/login/model/user';


@Component({
    selector: 'app-detalle-registro-usuario',
    templateUrl: './detalle-registro-usuario.component.html',
    styleUrls: ['./detalle-registro-usuario.component.scss']
})
export class DetalleRegistroUsuarioComponent implements OnInit {

    public peticionCiudades: boolean = false;
    public ciudades: string[] = [];
    public fechaMin: Date = new Date();
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
        { intensidad: 1, descripcion: 'Cerrada, exclusiva' },
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
        this.fechaMin.setMonth(this.fechaMin.getMonth() - (12 * 18));
        this.formUsuario = this.crearFormulario();
    }

    async ngOnInit(): Promise<void> {

        this.route.queryParams.subscribe(params => {
            this.modo = parseInt(params['modo'] + '');
            switch (this.modo) {
                case this.modoEdicion.creacionAdmin:
                    this.inicializarComponenteCreacionAdmin();
                    break;

                case this.modoEdicion.edicionAdmin:
                    this.inicializarComponenteEdicionAdmin(parseInt(params['id'] + ''));
                    break;

                case this.modoEdicion.perfilEditar:
                    this.inicializarComponentePerfilEditar(parseInt(params['id'] + ''));
                    break;

                case this.modoEdicion.creacionFuera:
                    this.inicializarComponenteCreacionFuera();
                    break;

                case this.modoEdicion.perfilVer:
                    this.inicializarComponentePerfilVer(parseInt(params['id'] + ''));
                    break;

                default:
                    break;
            }
        });

        this.formulario['edadMaxima'].addValidators(Validators.min(this.formulario['edadMinima'].value));
        //Esto lo iba a hacer con una consulta a base de datos, pero tarda la vida y se queda pilladísimo
        this.ciudades = ciudades();
    }


    /**
     * Crea el usuario con los campos a utilizar
     * @returns `FormBuilder` con el formulario inicializado
     */
    crearFormulario() {
        return this.formBuilder.group({
            //----------------USUARIO----------------
            nombre: ['', [Validators.required, Validators.minLength(3)]],
            apellidos: ['', [Validators.required, Validators.minLength(3)]],
            correo: ['', [Validators.required, Validators.email]],
            pass: ['', []],
            genero: ['', [Validators.required]],
            fecha_nacimiento: ['', [Validators.required]],
            ciudad: ['', [Validators.required]],
            descripcion: ['', [Validators.required]],
            foto: ['', [Validators.required]],
            numHijos: [0, [Validators.required]],
            gustosGenero: this.formBuilder.array([], [Validators.required]),
            //----------------PREFERENCIAS----------------
            relacion: ['', Validators.required],
            edadMaxima: ['', [Validators.required]],
            edadMinima: ['', [Validators.min(18), Validators.required]],
            deportes: ['', Validators.required],
            arte: ['', Validators.required],
            cultura: ['', Validators.required],
            politica: ['', Validators.required],
            hijos: [''],
            //----------------ADMINISTRACIÓN----------------
            roles: this.formBuilder.array([], (this.modo === (this.modoEdicion.edicionAdmin || this.modoEdicion.creacionAdmin) ? [Validators.required] : [])),
            activo: [''],
        });
    }

    /**
     * Inicializa el componente cuando se muestra el formulario de creación en el listado de usuarios
     */
    private inicializarComponenteCreacionAdmin() {
        this.idUsuario = 0;
        this.usuario = new Usuario(0, '', '', 'https://picsum.photos/350', 0, 0);
        this.usuario.hijos = 0;
        this.usuario.preferencias = [];
        this.usuario.preferencias.push(new Preferencias(7, 'Edad mínima', 18));
        this.usuario.preferencias.push(new Preferencias(8, 'Edad máxima', 99));
        this.rellenarFormulario();
        this.tituloPantalla = 'Nuevo usuario';
        this.formulario['pass'].addValidators(Validators.required);
        this.formulario['pass'].addValidators(Validators.pattern('(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9]).{8,}'));
    }

    /**
     * Inicializa el componente cuando se muestra el formulario sin iniciar sesión
     */
    private inicializarComponenteCreacionFuera() {
        this.idUsuario = 0;
        this.usuario = new Usuario(0, '', '', '././assets/images/DefaultUser.png', 0, 0);
        this.usuario.roles = [2];
        this.usuario.hijos = 0;
        this.usuario.preferencias = [];
        this.usuario.preferencias.push(new Preferencias(7, this.tipoPreferencias.edadMin, 18));
        this.usuario.preferencias.push(new Preferencias(8, this.tipoPreferencias.edadMax, 99));
        this.rellenarFormulario();
        this.tituloPantalla = 'Da el paso y únete a nuestra comunidad';
        this.formulario['pass'].addValidators(Validators.required);
        this.formulario['pass'].addValidators(Validators.pattern(new RegExp('(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9]).{8,}')));
    }

    /**
     * Inicializa el componente cuando se muestra el formulario al editar el perfil, desde el botón 'Editar perfil'
     * @param id_usuario `number` ID del usuario registrado
     */
    private inicializarComponentePerfilEditar(id_usuario: number) {
        this.idUsuario = id_usuario;
        this.adminService.detalleUsuario(this.idUsuario).subscribe({
            next: (res) => {
                this.usuario = res;
                this.tituloPantalla = `Perfil de ${this.formulario['nombre']}`;
                this.rellenarFormulario();
            }
        });
    }

    /**
     * Inicializa el componente cuando se muestra el formulario al editar el perfil,
     * desde el botón con el icono de lápiz en la lista de usuario
     * @param id_usuario `number` ID del usuario registrado
     */
    private inicializarComponenteEdicionAdmin(id_usuario: number) {
        this.idUsuario = id_usuario;
        this.adminService.detalleUsuario(this.idUsuario).subscribe({
            next: (res) => {
                this.usuario = res;
                this.rellenarFormulario();
            }
        });
        this.tituloPantalla = 'Editar usuario';
    }

    /**
     * Inicializa el componente cuando se muestra el formulario de detalle del perfil
     * (botón 'Ver perfil' en listado de amigos, les gusto, gente cerca y citas)
     * @param id_usuario `number` ID del usuario registrado
     */
    private inicializarComponentePerfilVer(id_usuario: number) {
        this.idUsuario = id_usuario;
        this.adminService.detalleUsuario(this.idUsuario).subscribe({
            next: (res: Usuario) => {
                this.usuario = res;
                console.log(this.tituloPerfil(this.usuario));
                this.tituloPantalla = `Perfil de ${this.tituloPerfil(this.usuario)}`;
                this.rellenarFormulario();
            }
        });
    }

    /**
     * Asigna al `FormGroup` la información del usuario
     */
    public rellenarFormulario() {
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
    public cambiarGenero(event: any) {
        this.formulario['genero'].setValue(event.target.value);
    }

    /**
    * Asigna el tipo de relación escogido en el select a la variable correspondiente en el formulario
    * @param event Evento OnChange del select
    */
    public cambiarRelacion(event: any) {
        this.formulario['relacion'].setValue(event.target.value, {
            onlySelf: true,
        });
    }

    /**
    * Asigna los géneros escogidos en los checkboxes a la variable correspondiente en el formulario
    * @param event Evento OnChange del checkbox
    */
    public cambiarGustosGenero(e: any) {
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
    public cambiarRoles(e: any) {
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
    public cambiarPreferenciasHijos(event: any) {
        this.formulario['hijos'].setValue(event.target.checked ? 100 : 0);
    }

    /**
     * Asigna el usuario activado en el checkbox a la variable correspondiente en el formulario
     * @param event Evento OnChange del checkbox
     */
    public cambiarActivo(event: any) {
        this.formulario['activo'].setValue(event.target.checked ? 1 : 0);
    }

    /**
     * Método que se ejecuta cuando se hace el submit del formulario
     */
    public onSubmit() {
        this.submitted = true;
        if (!this.formUsuario.invalid) {
            let usuarioModificado = this.generarUsuario();

            switch (this.modo) {
                case this.modoEdicion.creacionAdmin:
                    this.peticionCreacionAdmin(usuarioModificado);
                    break;

                case this.modoEdicion.edicionAdmin:
                    this.peticionEdicionAdmin(usuarioModificado);
                    break;

                case this.modoEdicion.perfilEditar:
                    this.peticionPerfilEditar(usuarioModificado);
                    break;

                case this.modoEdicion.creacionFuera:
                    this.peticionCreacionFuera(usuarioModificado);
                    break;
                default:
                    break;
            }
        }
    }

    /**
     * Petición que se realiza si se accede al formulario sin iniciar sesión
     * @param usuarioModificado Usuario a enviar a la petición
     */
    private peticionCreacionFuera(usuarioModificado: Usuario) {
        this.adminService.nuevoUsuario(usuarioModificado).subscribe({
            next: (respuesta) => {
                this.toastr.success(respuesta.mensaje, '');
                this.router.navigate(['']);
            },
            error: (error) => {
                this.toastr.error(error.error.mensaje, '');
            }
        });
    }

    /**
     * Petición que se realiza si se accede al formulario al editar el perfil personal (botón 'Editar perfil')
     * @param usuarioModificado Usuario a enviar a la petición
     */
    private peticionPerfilEditar(usuarioModificado: Usuario) {
        this.adminService.actualizarUsuario(usuarioModificado).subscribe({
            next: (respuesta) => {
                this.toastr.success(respuesta.mensaje, '');

                let logedUser = new User(
                    usuarioModificado.id,
                    usuarioModificado.correo!,
                    usuarioModificado.nombre,
                    usuarioModificado.apellidos,
                    usuarioModificado.foto,
                    usuarioModificado.roles!);
                this.loginService.setLoggedUser(logedUser);
                this.loginService.usuarioTrigger.emit(logedUser);
                if (logedUser.roles.includes(1)) {
                    this.router.navigate(['/admin/usuarios']);
                } else {
                    this.router.navigate(['/home']);
                }
            },
            error: (error) => {
                this.toastr.error(error.error.mensaje, '');
            }
        });
    }

    /**
     * Petición que se realiza si se accede al formulario desde el listado de usuarios (botón lápiz de edición)
     * @param usuarioModificado Usuario a enviar a la petición
     */
    private peticionEdicionAdmin(usuarioModificado: Usuario) {
        this.adminService.actualizarUsuario(usuarioModificado).subscribe({
            next: (respuesta) => {
                this.toastr.success(respuesta.mensaje, '');
                this.router.navigate(['/admin/usuarios']);
            },
            error: (error) => {
                this.toastr.error(error.error.mensaje, '');
            }
        });
    }

    /**
     * Petición que se realiza si se accede al formulario de creación desde el listado de usuarios
     * @param usuarioModificado Usuario a enviar a la petición
     */
    private peticionCreacionAdmin(usuarioModificado: Usuario) {
        this.adminService.nuevoUsuario(usuarioModificado).subscribe({
            next: (respuesta) => {
                this.toastr.success(respuesta.mensaje, '');
                this.router.navigate(['/admin/usuarios']);
            },
            error: (error) => {
                this.toastr.error(error.error.mensaje, '');
            }
        });
    }

    /**
     * Método que se ejecuta al pulsar la flecha de atrás o el botón cancelar
     */
    public volver() {
        switch (this.modo) {
            case this.modoEdicion.creacionFuera:
                this.router.navigate(['']);
                break;
            case this.modoEdicion.edicionAdmin:
                this.router.navigate(['/admin/usuarios']);
                break;
            case this.modoEdicion.perfilEditar:
            case this.modoEdicion.perfilVer:
                this.router.navigate(['/home']);
                break;
        }
    }

    /**
     * Obtiene los controles del `FormGroup`
     */
    get formulario() {
        return this.formUsuario.controls;
    }

    /**
     * Obtiene la lista de las ciudades para el listGroup de ciudades
     */
    public listaCiudades() {
        if (this.ciudades.length == 0 && this.peticionCiudades == false) {
            this.peticionCiudades = true;

            //console.log('Hice una petición');

            //this.adminService.listaCiudades().subscribe({
            //   next: (resp) => {
            //     debugger;
            //     console.log(resp);
            //     this.ciudades = resp;
            //   },
            //   error: (error) => {
            //     this.ciudades = [];
            //   }
            // });
        }

    }

    /**
     * Busca la intensidad de la preferencia
     * @param array Array de preferencias del usuario
     * @param descripcion Descripción de la preferencia a buscar
     * @returns Intensidad de la preferencia
     */
    public buscarIntensidad(array: any, descripcion: string): number {
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
     * Genera el usuario con la información introducida en el formulario
     * @returns Usuario con la información del formulario
     */
    public generarUsuario() {
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


    /**
     * A partir de una fecha con formato YYYY-DD-MM, obtiene un objeto `Date`.
     * Si la fecha es nula, se devuelve la fecha mínima del sistema.
     * @param fecha Fecha a formatear
     * @returns objeto `Date` fecha
     */
    public getFechaSeleccionada(fecha: string): Date {
        if (fecha != undefined && fecha != null && fecha != '') {
            let array: string[] = fecha.split('-');
            return new Date(parseInt(array[0]), parseInt(array[1]) + 1, parseInt(array[2]));
        } else {
            return new Date(1970, 1, 1);
        }
    }

    /**
     * Método que obtiene la foto seleccionada en el formulario
     */
    public obtenerFoto(event: any) {
        if (event.target.files.length > 0) {

            let formData = new FormData();
            formData.append('file', event.target.files[0])

            this.adminService.subirFoto(formData).subscribe({
                next: (resp: any) => {
                    this.formulario['foto'].setValue(resp.mensaje);
                    this.usuario.foto = resp.mensaje;
                },
                error: (error) => {
                    this.toastr.error('No se pueden subir imágenes de perfil en estos momentos');
                }
            })
        }
    }

    /**
     * Abre la foto de perfil en una nueva ventana
     * @param foto URL de la foto
     */
    public abrirFoto(foto: string) {
        window.open(foto);
    }

    /**
     * Devuelve el icono del género del usuario
     * @param id_g ID de género
     * @returns Icono con el género correspondiente
     */
    public iconoGenero(id_g: number) {
        var ret: string = 'gender-'
        switch (id_g) {
            case 1:
                ret += 'male';
                break;
            case 2:
                ret += 'female';
                break;
            case 3:
                //No es este icono, pero es que no hay otro :S
                ret += 'ambiguous';
                break;
        }

        return ret;
    }

    /**
     * -----------------ATENCIÓN: ESTOS MÉTODOS IRÍAN DENTRO DEL MODELO USUARIO-----------------
     * -------------------PERO POR ALGÚN MOTIVO LOS OBTIENE COMO UN UNDEFINED-------------------
     */

    /**
     * Establece el título del formulario perfil de usuario
     * @param usuario `Usuario` Usuario del cual obtener el título 
     * @returns Título del formulario
     */
    public tituloPerfil(usuario: Usuario) {
        return usuario.nombre + ' ' + usuario.apellidos + ', ' + this.edad(usuario.fecha_nacimiento!) + ' años';
    }

    /**
     * Obtiene una edad a partir de una fecha
     * @param fecha `string` Fecha de nacimiento
     * @returns Edad de la persona
     */
    public edad(fecha: any) {
        let fecha_nacimiento = this.getFechaSeleccionada(fecha);
        let resta = Date.now() - fecha_nacimiento.getTime();
        let edad = new Date(resta);

        return Math.abs(edad.getUTCFullYear() - 1970);
    }

}
