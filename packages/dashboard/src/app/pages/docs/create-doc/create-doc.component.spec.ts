import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateDocComponent } from './create-doc.component';

describe('CreateDocComponent', () => {
  let component: CreateDocComponent;
  let fixture: ComponentFixture<CreateDocComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateDocComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateDocComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
