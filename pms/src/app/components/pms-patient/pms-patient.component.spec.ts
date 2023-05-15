import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PmsPatientComponent } from './pms-patient.component';

describe('PmsPatientComponent', () => {
  let component: PmsPatientComponent;
  let fixture: ComponentFixture<PmsPatientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PmsPatientComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PmsPatientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
