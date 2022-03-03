import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {
  public title = 'GoDate';
  public clase: string = '';

  constructor(public router: Router){
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
}
