import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PortCollectionPageComponent } from './port-collection-page.component';

describe('PortCollectionPageComponent', () => {
  let component: PortCollectionPageComponent;
  let fixture: ComponentFixture<PortCollectionPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PortCollectionPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PortCollectionPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
