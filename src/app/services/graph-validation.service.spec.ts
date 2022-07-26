import { TestBed } from '@angular/core/testing';

import { GraphValidationService } from './graph-validation.service';

describe('GraphValidationService', () => {
  let service: GraphValidationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GraphValidationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
