import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddToCollectionComponent } from './add-to-collection.component';

describe('AddToCollectionComponent', () => {
  let component: AddToCollectionComponent;
  let fixture: ComponentFixture<AddToCollectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddToCollectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddToCollectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
