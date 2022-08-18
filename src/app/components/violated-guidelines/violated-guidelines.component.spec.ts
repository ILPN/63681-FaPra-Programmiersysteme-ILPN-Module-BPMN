import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViolatedGuidelinesComponent } from './violated-guidelines.component';

describe('ViolatedGuidelinesComponent', () => {
  let component: ViolatedGuidelinesComponent;
  let fixture: ComponentFixture<ViolatedGuidelinesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViolatedGuidelinesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViolatedGuidelinesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
