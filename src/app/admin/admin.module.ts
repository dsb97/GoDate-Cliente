import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { ListadoUsuariosComponent } from './components/listado-usuarios/listado-usuarios.component';
import { DataTablesModule } from 'angular-datatables';
import { DetalleRegistroUsuarioComponent } from './components/detalle-registro-usuario/detalle-registro-usuario.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    ListadoUsuariosComponent,
    DetalleRegistroUsuarioComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    DataTablesModule,
    FormsModule,
    ReactiveFormsModule,
  ]
})
export class AdminModule { }
