import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FindWorksComponent } from './find-works.component';

describe('FindWorksComponent', () => {
  let component: FindWorksComponent;
  let fixture: ComponentFixture<FindWorksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FindWorksComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FindWorksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
