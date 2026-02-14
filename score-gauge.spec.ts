import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScoreGauge } from './score-gauge';

describe('ScoreGauge', () => {
  let component: ScoreGauge;
  let fixture: ComponentFixture<ScoreGauge>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScoreGauge]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScoreGauge);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
