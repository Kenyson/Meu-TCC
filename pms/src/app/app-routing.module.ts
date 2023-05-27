import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { CadastroComponent } from './components/cadastro/cadastro.component';
import { PmsMedicoComponent } from './components/pms-medico/pms-medico.component';
import { PmsPacienteComponent } from './components/pms-paciente/pms-paciente.component';
import { PmsNewPacienteComponent } from './components/pms-new-paciente/pms-new-paciente.component';

const routes: Routes = [
  {
    path:'login',
    component:LoginComponent
  },
  {
    path:'cadastro',
    component:CadastroComponent
  },
  {
    path:'medico',
    component:PmsMedicoComponent
  },
  {
    path:'paciente',
    component:PmsPacienteComponent
  },
  {
    path:'newPaciente',
    component:PmsNewPacienteComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
