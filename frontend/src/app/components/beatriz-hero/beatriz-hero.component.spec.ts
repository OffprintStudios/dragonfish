import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BeatrizHeroComponent } from './beatriz-hero.component';

describe('BeatrizHeroComponent', () => {
  let component: BeatrizHeroComponent;
  let fixture: ComponentFixture<BeatrizHeroComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BeatrizHeroComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BeatrizHeroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
