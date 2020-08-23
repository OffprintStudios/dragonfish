import { TestBed } from '@angular/core/testing';

import { WorksService } from './works.service';

describe('WorksService', () => {
  let service: WorksService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WorksService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
