import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PmsPacienteComponent } from './pms-paciente.component';

describe('PmsPacienteComponent', () => {
  let component: PmsPacienteComponent;
  let fixture: ComponentFixture<PmsPacienteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PmsPacienteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PmsPacienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
