import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadCoverartComponent } from './upload-coverart.component';

describe('UploadCoverartComponent', () => {
  let component: UploadCoverartComponent;
  let fixture: ComponentFixture<UploadCoverartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UploadCoverartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadCoverartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
