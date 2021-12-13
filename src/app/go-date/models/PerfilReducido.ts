import { PerfilReducidoResponse } from './req-resp';

export class PerfilReducido {
    
    public static listaAfinesFromJSON(obj: PerfilReducidoResponse) {
        return new PerfilReducido(
            obj['id'],
            obj['nombre'],
            obj['apellidos'],
            obj['genero'],
            obj['fecha_nacimiento'],
            obj['ciudad'],
            obj['descripcion'],
            obj['foto'],
            obj['hijos'],
            obj['conectado'],
            obj['activo'],
            obj['porcentaje']
        );
    }
    constructor(
        public id: number,
        public nombre: string,
        public apellidos: string,
        public genero: string,
        public fecha_nacimiento: string,
        public ciudad: string,
        public descripcion: string,
        public foto: string,
        public hijos: string,
        public conectado: number,
        public activo: number,
        public porcentaje: number
    ) { }

    get edad() {
        //año mes dia
        var x = this.fecha_nacimiento.split('-');
        var dob = new Date(parseInt(x[0]), parseInt(x[1]), parseInt(x[2]));
        var diff_ms = Date.now() - dob.getTime();
        var age_dt = new Date(diff_ms);

        return Math.abs(age_dt.getUTCFullYear() - 1970);
    }

    get iconoGenero() {
        var ret: string = 'gender-'
        switch (this.genero) {
            case 'Hombre':
                ret += 'male';
                break;
            case 'Mujer':
                ret += 'female';
                break;
            case 'No binario':
                //No es este icono, pero es que no hay otro :S
                ret += 'ambiguous';
                break;
        }

        return ret;
    }

    get iconoConectado(){
        return (this.conectado == 0 ? 'n' : '') + 'online';
    }
}