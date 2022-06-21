import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayReorderGraphComponent } from './display-reorder-graph.component';

describe('DisplayReorderGraphComponent', () => {
  let component: DisplayReorderGraphComponent;
  let fixture: ComponentFixture<DisplayReorderGraphComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DisplayReorderGraphComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DisplayReorderGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
