import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PmsHeaderComponent } from './components/pms-header/pms-header.component';
import { PmsFooterComponent } from './components/pms-footer/pms-footer.component';
import { PmsBodyComponent } from './components/pms-body/pms-body.component';
import { PmsGridComponent } from './components/pms-grid/pms-grid.component';
import { PmsPatientComponent } from './components/pms-patient/pms-patient.component';


@NgModule({
  declarations: [
    AppComponent,
    PmsHeaderComponent,
    PmsFooterComponent,
    PmsBodyComponent,
    PmsGridComponent,
    PmsPatientComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
