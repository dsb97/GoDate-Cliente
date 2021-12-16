import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/login/model/user';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  public imgLogo: string;

  constructor() {
    this.imgLogo = "./assets/images/Logo.png"
  }

  ngOnInit(): void {

  }

}
