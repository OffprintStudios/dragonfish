import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditWorkComponent } from './edit-work.component';

describe('EditWorkComponent', () => {
  let component: EditWorkComponent;
  let fixture: ComponentFixture<EditWorkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditWorkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditWorkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
