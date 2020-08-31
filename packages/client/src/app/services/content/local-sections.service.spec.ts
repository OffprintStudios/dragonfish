import { TestBed } from '@angular/core/testing';

import { LocalSectionsService } from './local-sections.service';

describe('SectionsService', () => {
  let service: LocalSectionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LocalSectionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
