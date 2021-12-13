import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';

import { GoDateRoutingModule } from './go-date-routing.module';
import { PerfilComponent } from './components/perfil/perfil.component';
import { ListadoGenteAfinComponent } from './components/listado-gente-afin/listado-gente-afin.component';


@NgModule({
  declarations: [
    ListadoGenteAfinComponent,
    PerfilComponent
  ],
  imports: [
    SharedModule,
    GoDateRoutingModule
  ]
})
export class GoDateModule { }
