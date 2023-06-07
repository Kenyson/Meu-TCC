import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { CadastroComponent } from './components/cadastro/cadastro.component';
import { PmsMedicoComponent } from './components/pms-medico/pms-medico.component';
import { PmsPacienteComponent } from './components/pms-paciente/pms-paciente.component';
import { PmsNewPacienteComponent } from './components/pms-new-paciente/pms-new-paciente.component';
import { PmsNewReceitaComponent } from './components/pms-new-receita/pms-new-receita.component';
import { AuthGuard } from './services/auth-guard.service';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'cadastro',
    component: CadastroComponent,
  },
  {
    path: 'medico',
    component: PmsMedicoComponent,
    canActivate: [AuthGuard],
    data: { userType: 'medico' }
  },
  {
    path: 'paciente',
    component: PmsPacienteComponent,
    canActivate: [AuthGuard],
    data: { userType: 'paciente' }
  },
  {
    path: 'newPaciente',
    component: PmsNewPacienteComponent,
    canActivate: [AuthGuard],
    data: { userType: 'medico' }
  },
  {
    path: 'receita',
    component: PmsNewReceitaComponent,
    canActivate: [AuthGuard],
    data: { userType: 'medico' }
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
