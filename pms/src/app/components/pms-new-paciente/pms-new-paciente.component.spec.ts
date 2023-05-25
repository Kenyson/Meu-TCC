import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PmsNewPacienteComponent } from './pms-new-paciente.component';

describe('PmsNewPacienteComponent', () => {
  let component: PmsNewPacienteComponent;
  let fixture: ComponentFixture<PmsNewPacienteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PmsNewPacienteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PmsNewPacienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
