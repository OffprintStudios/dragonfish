import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FindBlogsComponent } from './find-blogs.component';

describe('FindBlogsComponent', () => {
    let component: FindBlogsComponent;
    let fixture: ComponentFixture<FindBlogsComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [FindBlogsComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(FindBlogsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
