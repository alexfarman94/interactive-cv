export interface Impact {
  metric: string;
  value: string;
}

export interface Project {
  id: string;
  title: string;
  context: string;
  actions: string[];
  impact: Impact[];
  tags: string[];
  deepDetail?: string;
  priority: number;
}

export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export type FilterId = 'adoption' | 'strategic' | 'impact' | 'ownership';

export interface Filter {
  id: FilterId;
  label: string;
  icon: string;
  description: string;
}
