import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NagBarComponent } from './nag-bar.component';

describe('NagBarComponent', () => {
  let component: NagBarComponent;
  let fixture: ComponentFixture<NagBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NagBarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NagBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
