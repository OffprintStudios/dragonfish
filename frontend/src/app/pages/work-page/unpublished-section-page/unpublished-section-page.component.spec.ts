import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UnpublishedSectionPageComponent } from './unpublished-section-page.component';

describe('UnpublishedSectionPageComponent', () => {
  let component: UnpublishedSectionPageComponent;
  let fixture: ComponentFixture<UnpublishedSectionPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UnpublishedSectionPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnpublishedSectionPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
