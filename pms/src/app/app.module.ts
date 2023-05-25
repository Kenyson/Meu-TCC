import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PmsHeaderComponent } from './components/pms-header/pms-header.component';
import { PmsFooterComponent } from './components/pms-footer/pms-footer.component';
import { PmsBodyComponent } from './components/pms-body/pms-body.component';
import { PmsGridComponent } from './components/pms-grid/pms-grid.component';
import { PmsPacienteComponent } from './components/pms-paciente/pms-paciente.component';
import { PmsMedicoComponent } from './components/pms-medico/pms-medico.component';
import { PmsNewPacienteComponent } from './components/pms-medico/pms-new-paciente/pms-new-paciente.component';



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
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
