import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PmsBodyComponent } from './pms-body.component';

describe('PmsBodyComponent', () => {
  let component: PmsBodyComponent;
  let fixture: ComponentFixture<PmsBodyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PmsBodyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PmsBodyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
