import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SiteSidenavComponent } from './site-sidenav.component';

describe('SiteSidenavComponent', () => {
    let component: SiteSidenavComponent;
    let fixture: ComponentFixture<SiteSidenavComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [SiteSidenavComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SiteSidenavComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
