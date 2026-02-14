import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ChecklistService } from '../../services/checklist';
import { ChecklistItem, CategoryInfo, CategoryType } from '../../models/checklist.model';

@Component({
  selector: 'app-report',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './report.html',
  styleUrl: './report.scss'
})
export class ReportComponent {
  categories: CategoryInfo[];
  items: ChecklistItem[];
  generatedDate: string;

  constructor(
    private checklistService: ChecklistService,
    private router: Router
  ) {
    this.categories = this.checklistService.getCategories();
    this.items = this.checklistService.getChecklistItems();
    this.generatedDate = new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  get overallScore(): number {
    return this.checklistService.getOverallProgress();
  }

  get completedCount(): number {
    return this.items.filter(i => i.completed).length;
  }

  get totalCount(): number {
    return this.items.length;
  }

  get scoreGrade(): string {
    if (this.overallScore >= 90) return 'A';
    if (this.overallScore >= 75) return 'B';
    if (this.overallScore >= 60) return 'C';
    if (this.overallScore >= 40) return 'D';
    return 'F';
  }

  get scoreClass(): string {
    if (this.overallScore >= 75) return 'high';
    if (this.overallScore >= 40) return 'medium';
    return 'low';
  }

  getCategoryItems(category: CategoryType): ChecklistItem[] {
    return this.items.filter(i => i.category === category);
  }

  getCategoryProgress(category: CategoryType): number {
    return this.checklistService.getCategoryProgress(category);
  }

  getCategoryCompleted(category: CategoryType): number {
    return this.items.filter(i => i.category === category && i.completed).length;
  }

  getCategoryTotal(category: CategoryType): number {
    return this.items.filter(i => i.category === category).length;
  }

  get incompleteHighRisk(): ChecklistItem[] {
    return this.items.filter(i => !i.completed && i.riskLevel === 'high');
  }

  get incompleteMediumRisk(): ChecklistItem[] {
    return this.items.filter(i => !i.completed && i.riskLevel === 'medium');
  }

  printReport(): void {
    window.print();
  }

  goBack(): void {
    this.router.navigate(['/']);
  }
}