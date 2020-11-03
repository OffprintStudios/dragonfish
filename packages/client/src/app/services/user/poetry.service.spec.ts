import { TestBed } from '@angular/core/testing';

import { PoetryService } from './poetry.service';

describe('PoetryService', () => {
  let service: PoetryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PoetryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
