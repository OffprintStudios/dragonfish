import { TestBed } from '@angular/core/testing';

import { DocsService } from './docs.service';

describe('DocsService', () => {
    let service: DocsService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(DocsService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
