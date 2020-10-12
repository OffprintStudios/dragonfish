import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewPostComponent } from './preview-post.component';

describe('PreviewPostComponent', () => {
  let component: PreviewPostComponent;
  let fixture: ComponentFixture<PreviewPostComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreviewPostComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreviewPostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
