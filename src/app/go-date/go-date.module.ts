import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';

import { GoDateRoutingModule } from './go-date-routing.module';
import { PerfilComponent } from './components/perfil/perfil.component';
import { ListadoGenteAfinComponent } from './components/listado-gente-afin/listado-gente-afin.component';
import { ListadoAmigosComponent } from './components/listado-amigos/listado-amigos.component';
import { ListadoGenteCercaComponent } from './components/listado-gente-cerca/listado-gente-cerca.component';
import { ListadoLesGustoComponent } from './components/listado-les-gusto/listado-les-gusto.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    ListadoGenteAfinComponent,
    PerfilComponent,
    ListadoAmigosComponent,
    ListadoGenteCercaComponent,
    ListadoLesGustoComponent
  ],
  imports: [
    SharedModule,
    GoDateRoutingModule,
    FormsModule,
    ReactiveFormsModule,
  ]
})
export class GoDateModule { }
