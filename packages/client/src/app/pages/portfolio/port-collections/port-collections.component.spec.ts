import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PortCollectionsComponent } from './port-collections.component';

describe('PortCollectionsComponent', () => {
  let component: PortCollectionsComponent;
  let fixture: ComponentFixture<PortCollectionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PortCollectionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PortCollectionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
