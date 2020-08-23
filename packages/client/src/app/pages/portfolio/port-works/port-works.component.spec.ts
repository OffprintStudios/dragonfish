import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PortWorksComponent } from './port-works.component';

describe('PortWorksComponent', () => {
  let component: PortWorksComponent;
  let fixture: ComponentFixture<PortWorksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PortWorksComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PortWorksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
