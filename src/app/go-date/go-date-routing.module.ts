import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DetalleRegistroUsuarioComponent } from '../admin/components/detalle-registro-usuario/detalle-registro-usuario.component';
import { ListadoAmigosComponent } from './components/listado-amigos/listado-amigos.component';
import { ListadoGenteAfinComponent } from './components/listado-gente-afin/listado-gente-afin.component';
import { ListadoGenteCercaComponent } from './components/listado-gente-cerca/listado-gente-cerca.component';
import { ListadoLesGustoComponent } from './components/listado-les-gusto/listado-les-gusto.component';
import { PerfilComponent } from './components/perfil/perfil.component';

const routes: Routes = [
  {
    path: '',
    component: ListadoGenteAfinComponent
  },
  {
    path: 'perfil',
    component: DetalleRegistroUsuarioComponent
  },
  {
    path: 'listaAmigos',
    component: ListadoAmigosComponent
  },
  {
    path: 'listaLesGusto',
    component: ListadoLesGustoComponent
  },
  {
    path: 'listaGenteCerca',
    component: ListadoGenteCercaComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GoDateRoutingModule { }
