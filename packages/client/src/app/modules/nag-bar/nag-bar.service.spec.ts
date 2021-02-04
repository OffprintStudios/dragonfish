import { TestBed } from '@angular/core/testing';

import { NagBarService } from './nag-bar.service';

describe('NagBarService', () => {
    let service: NagBarService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(NagBarService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
