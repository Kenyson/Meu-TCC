import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PmsHeaderComponent } from './pms-header.component';

describe('PmsHeaderComponent', () => {
  let component: PmsHeaderComponent;
  let fixture: ComponentFixture<PmsHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PmsHeaderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PmsHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
