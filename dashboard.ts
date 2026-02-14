import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ChecklistService } from '../../services/checklist';
import { ChecklistItem, CategoryInfo, CategoryType } from '../../models/checklist.model';
import { ChecklistItemComponent } from '../checklist-item/checklist-item';
import { ScoreGaugeComponent } from '../score-gauge/score-gauge';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, ChecklistItemComponent, ScoreGaugeComponent],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class DashboardComponent implements OnInit {
  categories: CategoryInfo[] = [];
  checklistItems: ChecklistItem[] = [];
  activeFilter: CategoryType | 'all' = 'all';
  sortBy: 'default' | 'risk' | 'status' = 'default';

  constructor(
    private checklistService: ChecklistService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.categories = this.checklistService.getCategories();
    this.checklistItems = this.checklistService.getChecklistItems();
  }

   get filteredItems(): ChecklistItem[] {
    let items = this.activeFilter === 'all'
      ? [...this.checklistItems]
      : this.checklistItems.filter(item => item.category === this.activeFilter);

    if (this.sortBy === 'risk') {
      const riskOrder = { high: 0, medium: 1, low: 2 };
      items.sort((a, b) => riskOrder[a.riskLevel] - riskOrder[b.riskLevel]);
    } else if (this.sortBy === 'status') {
      items.sort((a, b) => Number(a.completed) - Number(b.completed));
    }

    return items;
  }

  setSort(sort: 'default' | 'risk' | 'status'): void {
    this.sortBy = sort;
  }

  get overallProgress(): number {
    return this.checklistService.getOverallProgress();
  }

  getCategoryProgress(category: CategoryType): number {
    return this.checklistService.getCategoryProgress(category);
  }

  setFilter(filter: CategoryType | 'all'): void {
    this.activeFilter = filter;
  }

  onItemToggled(id: string): void {
    this.checklistService.toggleItem(id);

    if (this.overallProgress === 100 && !this.showCelebration) {
      this.showCelebration = true;
      setTimeout(() => this.showCelebration = false, 5000);
    }
  }

  getScoreClass(): string {
    if (this.overallProgress >= 75) return 'score-high';
    if (this.overallProgress >= 40) return 'score-medium';
    return 'score-low';
  }

  getScoreMessage(): string {
    if (this.overallProgress >= 75) return '🛡️ Great job! Your security posture is strong.';
    if (this.overallProgress >= 40) return '⚠️ Getting there. Keep checking off items!';
    return '🚨 Your security needs attention. Start with the high-risk items!';
  }

  get completedCount(): number {
    return this.checklistItems.filter (i => i.completed).length;
  }

  get remainingCount(): number {
    return this.checklistItems.filter (i => !i.completed).length;
  }

  get highRiskRemaining(): number {
    return this.checklistItems.filter(i => !i.completed && i.riskLevel === 'high').length;
  }

  getCategoryCompletedCount(category: CategoryType): number {
    return this.checklistItems.filter(i => i.category === category && i.completed).length;
  }

  getCategoryTotalCount(category: CategoryType): number {
    return this.checklistItems.filter(i => i.category === category).length;
  }

  get quickWins(): ChecklistItem[] {
    return this.checklistItems
    .filter(i => !i.completed && i.riskLevel === 'high')
    .slice(0,3);
  }

  get hasQuickWins(): boolean {
    return this.quickWins.length > 0;
  }

  getCategoryLabel(category: CategoryType): string {
    const cat = this.categories.find (c => c.type === category);
    return cat ? cat.label : category;
  }

  goToReport(): void {
    this.router.navigate(['/report']);
  }

  showResetConfirm = false;
  showCelebration = false;

  confirmReset(): void {
    this.showResetConfirm = true;
  }

  cancelReset(): void {
    this.showResetConfirm = false;
  }

  resetAll(): void {
    this.checklistService.resetProgress();
    this.showResetConfirm = false;
  }

}