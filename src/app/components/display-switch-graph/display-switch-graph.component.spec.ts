import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplaySwitchGraphComponent } from './display-switch-graph.component';

describe('DisplaySwitchGraphComponent', () => {
  let component: DisplaySwitchGraphComponent;
  let fixture: ComponentFixture<DisplaySwitchGraphComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DisplaySwitchGraphComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DisplaySwitchGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
