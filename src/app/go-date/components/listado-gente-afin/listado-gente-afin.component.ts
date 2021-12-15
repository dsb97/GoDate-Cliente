import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { PerfilReducido } from '../../models/PerfilReducido';
import { RestUserServicio } from '../../services/rest-user.service';
import {Toast} from 'bootstrap'


@Component({
  selector: 'app-listado-gente-afin',
  templateUrl: './listado-gente-afin.component.html',
  styleUrls: ['./listado-gente-afin.component.scss']
})
export class ListadoGenteAfinComponent implements OnInit {
  @ViewChild('myToast',{static:true}) toastEl!: ElementRef<HTMLDivElement>;
  toast: Toast | null = null;

  public listaAfines: PerfilReducido[] = [];
  
  public myId: number = 595;
  
  constructor(
    private restService: RestUserServicio
    ) { }

  ngOnInit(): void {
    this.getListaAfinidades();
    this.toast = new Toast(this.toastEl.nativeElement,{});

  }

  public showToast (){
    this.toast!.show();
  }

  public getListaAfinidades() {
    this.restService.getListaAfinidades(this.myId).subscribe(
      (response) => {
        this.listaAfines = response;
    });
  }

  public like() {
    let id_d = this.listaAfines[0].id;
    let id_o = this.myId;

    this.restService.darLike(id_o, id_d).subscribe({
      next: (match) => {
        console.log(match);
        this.listaAfines = this.listaAfines.slice(1, this.listaAfines.length);
        if(true) {
          this.showToast();
        }
        // this.notificationService.showMessage(`Usuario ${user.email} logeado.`, 'principal', {queryParams: this.user});
        // this.user = user;
      },
      error: e => {
        // this.notificationService.showMessage(`Fallo en el login: `+e)
        console.log(e);
      }
    });
    
    
    
  }

  public dislike() {
    let id1 = this.listaAfines[0].id;
    let id2 = this.myId;
    let ids = {id1, id2};
    

    this.listaAfines = this.listaAfines.slice(1, this.listaAfines.length);
  }
}
