import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShortWorkCardComponent } from './short-work-card.component';

describe('ShortWorkCardComponent', () => {
  let component: ShortWorkCardComponent;
  let fixture: ComponentFixture<ShortWorkCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShortWorkCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShortWorkCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
