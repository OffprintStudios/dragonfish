import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PortBlogPageComponent } from './port-blog-page.component';

describe('PortBlogPageComponent', () => {
  let component: PortBlogPageComponent;
  let fixture: ComponentFixture<PortBlogPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PortBlogPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PortBlogPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
