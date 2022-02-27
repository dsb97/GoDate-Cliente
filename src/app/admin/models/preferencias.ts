import { preferenciasResponse } from "./preferenciasResponse";

export class Preferencias {

    static preferenciasFromJSON(obj: preferenciasResponse) {
        return new Preferencias(
            obj['id'],
            obj['descripcion'],
            obj['intensidad']
        );
    }

    constructor(
        public id: number,
        public descripcion: string,
        public intentsidad: number
    ) { }
}
