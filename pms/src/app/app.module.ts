import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PmsHeaderComponent } from './components/pms-header/pms-header.component';
import { PmsFooterComponent } from './components/pms-footer/pms-footer.component';
import { PmsBodyComponent } from './components/pms-body/pms-body.component';
import { PmsGridComponent } from './components/pms-grid/pms-grid.component';
import { PmsPacienteComponent } from './components/pms-paciente/pms-paciente.component';
import { PmsMedicoComponent } from './components/pms-medico/pms-medico.component';
import { PmsNewPacienteComponent } from './components/pms-new-paciente/pms-new-paciente.component';
import { LoginComponent } from './components/login/login.component';
import { CadastroComponent } from './components/cadastro/cadastro.component';
import { PmsNewReceitaComponent } from './components/pms-new-receita/pms-new-receita.component';
import { AuthService } from 'src/app/services/auth.service';

@NgModule({
  declarations: [
    AppComponent,
    PmsHeaderComponent,
    PmsFooterComponent,
    PmsBodyComponent,
    PmsGridComponent,
    PmsPacienteComponent,
    PmsMedicoComponent,
    PmsNewPacienteComponent,
    LoginComponent,
    CadastroComponent,
    PmsNewReceitaComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule
  ],
  providers: [AuthService],
  bootstrap: [AppComponent]
})
export class AppModule { }
