import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PmsFooterComponent } from './pms-footer.component';

describe('PmsFooterComponent', () => {
  let component: PmsFooterComponent;
  let fixture: ComponentFixture<PmsFooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PmsFooterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PmsFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
