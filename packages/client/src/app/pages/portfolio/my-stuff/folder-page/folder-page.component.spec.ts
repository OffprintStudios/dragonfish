import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FolderPageComponent } from './folder-page.component';

describe('FolderPageComponent', () => {
  let component: FolderPageComponent;
  let fixture: ComponentFixture<FolderPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FolderPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FolderPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
