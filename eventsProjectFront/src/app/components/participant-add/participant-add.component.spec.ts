import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParticipantAddComponent } from './participant-add.component';

describe('ParticipantAddComponent', () => {
  let component: ParticipantAddComponent;
  let fixture: ComponentFixture<ParticipantAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ParticipantAddComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ParticipantAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
