import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PortHomeComponent } from './port-home.component';

describe('PortHomeComponent', () => {
  let component: PortHomeComponent;
  let fixture: ComponentFixture<PortHomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PortHomeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PortHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
