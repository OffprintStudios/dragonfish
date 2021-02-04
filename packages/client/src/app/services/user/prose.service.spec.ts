import { TestBed } from '@angular/core/testing';

import { ProseService } from './prose.service';

describe('ProseService', () => {
    let service: ProseService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(ProseService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
