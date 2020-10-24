import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyStuffComponent } from './my-stuff.component';

describe('MyStuffComponent', () => {
  let component: MyStuffComponent;
  let fixture: ComponentFixture<MyStuffComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyStuffComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyStuffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
