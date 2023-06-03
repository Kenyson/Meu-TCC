import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PmsNewReceitaComponent } from './pms-new-receita.component';

describe('PmsNewReceitaComponent', () => {
  let component: PmsNewReceitaComponent;
  let fixture: ComponentFixture<PmsNewReceitaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PmsNewReceitaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PmsNewReceitaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
