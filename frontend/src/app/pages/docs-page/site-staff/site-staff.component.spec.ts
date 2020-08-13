import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SiteStaffComponent } from './site-staff.component';

describe('SiteStaffComponent', () => {
  let component: SiteStaffComponent;
  let fixture: ComponentFixture<SiteStaffComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SiteStaffComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SiteStaffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
