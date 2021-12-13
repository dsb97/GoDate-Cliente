import { Component, OnInit } from '@angular/core';
import { PerfilReducido } from '../../models/PerfilReducido';
import { RestUserServicio } from '../../services/rest-user.service';

@Component({
  selector: 'app-listado-gente-afin',
  templateUrl: './listado-gente-afin.component.html',
  styleUrls: ['./listado-gente-afin.component.scss']
})
export class ListadoGenteAfinComponent implements OnInit {

  public listaAfines: PerfilReducido[] = [];
  
  public myId: number = 595;
  //public 
  constructor(
    private restService: RestUserServicio
    ) { }

  ngOnInit(): void {
    this.getList();
  }


  public getList() {
    this.restService.getList().subscribe(
      (response) => {
        this.listaAfines = response;
    });
  }

  public like() {
    let id1 = this.listaAfines[0].id;
    let id2 = this.myId;
    let ids = {id1, id2};
    

    this.listaAfines = this.listaAfines.slice(1, this.listaAfines.length);
  }

  public dislike() {
    let id1 = this.listaAfines[0].id;
    let id2 = this.myId;
    let ids = {id1, id2};
    

    this.listaAfines = this.listaAfines.slice(1, this.listaAfines.length);
  }
}
