import { PerfilTarjetaResponse } from './PerfilTarjetaResponse';

export class PerfilTarjeta {
    
    public static perfilTarjetaFromJSON(obj: PerfilTarjetaResponse) {
        return new PerfilTarjeta(
            obj['id'],
            obj['nombre'],
            obj['apellidos'],
            obj['fecha_nacimiento'],
            obj['foto'],
            obj['conectado']
        );
    }
    constructor(
        public id: number,
        public nombre: string,
        public apellidos: string,
        public fecha_nacimiento: string,
        public foto: string,
        public conectado: number
    ) { }

    get edad() {
        //año mes dia
        var x = this.fecha_nacimiento.split('-');
        var dob = new Date(parseInt(x[0]), parseInt(x[1]), parseInt(x[2]));
        var diff_ms = Date.now() - dob.getTime();
        var age_dt = new Date(diff_ms);

        return Math.abs(age_dt.getUTCFullYear() - 1970);
    }

    get iconoConectado(){
        return (this.conectado == 0 ? 'n' : '') + 'online';
    }
}