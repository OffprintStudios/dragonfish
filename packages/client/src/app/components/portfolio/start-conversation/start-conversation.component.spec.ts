import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StartConversationComponent } from './start-conversation.component';

describe('StartConversationComponent', () => {
  let component: StartConversationComponent;
  let fixture: ComponentFixture<StartConversationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StartConversationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StartConversationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
