import { TestBed } from '@angular/core/testing';

import { DisplayErrorService } from './display-error.service';

describe('DisplayErrorServiceService', () => {
  let service: DisplayErrorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DisplayErrorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
