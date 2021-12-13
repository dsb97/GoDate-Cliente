import { MatchResponse } from './req-resp';
export class Match {
    public match?: string;
    constructor (match?: string){
        (this.match = match);
    }
}