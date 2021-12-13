import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  //variable
  public imgLogo: string;

  constructor() {
    this.imgLogo = "";
  }

  ngOnInit(): void {
    this.imgLogo = "./assets/images/LogoIzq.png";
  }

}
