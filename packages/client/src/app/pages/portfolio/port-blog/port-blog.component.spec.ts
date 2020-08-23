import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PortBlogComponent } from './port-blog.component';

describe('PortBlogComponent', () => {
  let component: PortBlogComponent;
  let fixture: ComponentFixture<PortBlogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PortBlogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PortBlogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
