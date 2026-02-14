export type RiskLevel = 'high' | 'medium' | 'low';

export type CategoryType = 'personal' | 'device' | 'network';

export interface ChecklistItem {
    id: string;
    title: string;
    description: string;
    category: CategoryType;
    riskLevel: RiskLevel;
    completed: boolean;
    tip: string;
    howTo: string;
}

export interface CategoryInfo {
    type: CategoryType;
    label: string;
    icon: string;
    description: string;
}

