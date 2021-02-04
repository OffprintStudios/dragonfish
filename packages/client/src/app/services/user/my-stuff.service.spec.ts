import { TestBed } from '@angular/core/testing';

import { MyStuffService } from './my-stuff.service';

describe('MyStuffService', () => {
    let service: MyStuffService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(MyStuffService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
