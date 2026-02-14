import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-score-gauge',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './score-gauge.html',
  styleUrl: './score-gauge.scss',
})
export class ScoreGaugeComponent {
  @Input() score: number = 0;

  get scoreClass(): string {
    if (this.score >= 75) return 'high';
    if (this.score >= 40) return 'medium';
    return 'low';
  }

  get strokeColor(): string {
    if (this.score >= 75) return '#22c55e';
    if (this.score >= 40) return '#f59e0b';
    return '#ef4444';
  }

  get circumference(): number {
    return 2 * Math.PI * 54;
  }

  get strokeDashoffset(): number {
    return this.circumference - (this.score / 100) * this.circumference;
  }

  get scoreLabel(): string {
    if (this.score >= 75) return 'Strong';
    if (this.score >= 40) return 'Fair';
    return 'Weak';
  }  
}
