import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DetalleRegistroUsuarioComponent } from './components/detalle-registro-usuario/detalle-registro-usuario.component';
import { ListadoUsuariosComponent } from './components/listado-usuarios/listado-usuarios.component';

const routes: Routes = [
  {
    path: 'usuarios',
    component: ListadoUsuariosComponent
  },
  {
    path: 'editar',
    component: DetalleRegistroUsuarioComponent
  },
  {
    path: 'nuevo',
    component: DetalleRegistroUsuarioComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
