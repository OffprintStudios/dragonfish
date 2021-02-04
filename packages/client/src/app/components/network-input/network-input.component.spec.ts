import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NetworkInputComponent } from './network-input.component';

describe('NetworkInputComponent', () => {
    let component: NetworkInputComponent;
    let fixture: ComponentFixture<NetworkInputComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [NetworkInputComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(NetworkInputComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
