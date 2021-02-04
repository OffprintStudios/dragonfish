import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FindUsersComponent } from './find-users.component';

describe('FindUsersComponent', () => {
    let component: FindUsersComponent;
    let fixture: ComponentFixture<FindUsersComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [FindUsersComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(FindUsersComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
