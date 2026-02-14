import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChecklistItem } from '../../models/checklist.model';

@Component({
  selector: 'app-checklist-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './checklist-item.html',
  styleUrl: './checklist-item.scss'
})
export class ChecklistItemComponent {
  @Input() item!: ChecklistItem;
  @Output() toggled = new EventEmitter<string>();
  expanded = false;

  toggleComplete(): void {
    this.toggled.emit(this.item.id);
  }

  toggleExpand(): void {
    this.expanded = !this.expanded;
  }

  get riskLabel(): string {
    return this.item.riskLevel.charAt(0).toUpperCase() + this.item.riskLevel.slice(1) + ' Risk';
  }

  get riskDescription(): string {
    switch (this.item.riskLevel) {
       case 'high':
        return 'This is a critical security measure. Skipping this leaves you significantly exposed to common attacks.';
      case 'medium':
        return 'This is an important security practice. Completing it will meaningfully improve your security posture.';
      case 'low':
        return 'This is a good security habit. While lower priority, it adds an extra layer of protection.';
    }
  }
}