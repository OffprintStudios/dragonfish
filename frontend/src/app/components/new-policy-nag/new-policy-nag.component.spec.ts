import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewPolicyNagComponent } from './new-policy-nag.component';

describe('NewPolicyNagComponent', () => {
  let component: NewPolicyNagComponent;
  let fixture: ComponentFixture<NewPolicyNagComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewPolicyNagComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewPolicyNagComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
