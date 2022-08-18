import { TestBed } from '@angular/core/testing';

import { DisplayViolatedGuidelinesService } from './display-violated-guidelines.service';

describe('DisplayViolatedGuidelinesServiceService', () => {
  let service: DisplayViolatedGuidelinesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DisplayViolatedGuidelinesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
