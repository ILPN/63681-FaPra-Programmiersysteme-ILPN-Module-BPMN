import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayDraggableGraphComponent } from './display-draggable-graph.component';

describe('DisplayDraggableGraphComponent', () => {
  let component: DisplayDraggableGraphComponent;
  let fixture: ComponentFixture<DisplayDraggableGraphComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DisplayDraggableGraphComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DisplayDraggableGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
