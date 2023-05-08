import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PmsGridComponent } from './pms-grid.component';

describe('PmsGridComponent', () => {
  let component: PmsGridComponent;
  let fixture: ComponentFixture<PmsGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PmsGridComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PmsGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
