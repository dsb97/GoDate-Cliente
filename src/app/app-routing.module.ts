import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListadoGenteAfinComponent } from './go-date/components/listado-gente-afin/listado-gente-afin.component';
const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./go-date/go-date.module').then((m) => m.GoDateModule)
  },
  {
    path: '**',
    redirectTo: ''
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
