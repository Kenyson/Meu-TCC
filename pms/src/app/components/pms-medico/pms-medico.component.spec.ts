import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PmsMedicoComponent } from './pms-medico.component';

describe('PmsMedicoComponent', () => {
  let component: PmsMedicoComponent;
  let fixture: ComponentFixture<PmsMedicoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PmsMedicoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PmsMedicoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
