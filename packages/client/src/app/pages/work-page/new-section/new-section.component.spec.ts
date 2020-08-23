import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewSectionComponent } from './new-section.component';

describe('NewSectionComponent', () => {
  let component: NewSectionComponent;
  let fixture: ComponentFixture<NewSectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewSectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
