export type UserRole = 'owner' | 'project_manager' | 'team_member' | 'client' | 'accountant';
export type ProjectStatus = 'planning' | 'active' | 'on_hold' | 'completed' | 'archived';
export type BudgetType = 'fixed_price' | 'time_materials' | 'retainer';
export type TaskStatus = 'backlog' | 'todo' | 'in_progress' | 'review' | 'done';
export type Priority = 'low' | 'medium' | 'high' | 'critical';
export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue';
export type ProjectHealth = 'on_track' | 'at_risk' | 'over_budget';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  avatarColor: string;
  hourlyRate: number;
  capacity: number; // hours/week
  skills: string[];
  jobTitle: string;
  clientId?: string; // set if role === 'client'
}

export interface Client {
  id: string;
  name: string;
  email: string;
  company: string;
  phone: string;
  address: string;
  logo?: string;
  avatar?: string;
  color: string;
  status: 'active' | 'inactive';
  totalRevenue: number;
  activeProjects: number;
  projects: string[]; // project IDs
}

export interface Project {
  id: string;
  name: string;
  clientId: string;
  status: ProjectStatus;
  health: ProjectHealth;
  budgetType: BudgetType;
  budget: number;
  spent: number;
  description: string;
  startDate: string;
  endDate: string;
  teamIds: string[];
  managerId: string;
  hoursLogged: number;
  hoursEstimated: number;
  color: string;
  tags: string[];
  createdAt: string;
}

export interface Milestone {
  id: string;
  projectId: string;
  title: string;
  dueDate: string;
  completed: boolean;
  description: string;
}

export interface Task {
  id: string;
  projectId: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: Priority;
  assigneeId: string;
  estimatedHours: number;
  loggedHours: number;
  dueDate: string;
  labels: string[];
  subtasks: Subtask[];
  comments: Comment[];
  createdAt: string;
  order: number;
}

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Comment {
  id: string;
  userId: string;
  content: string;
  createdAt: string;
}

export interface TimeEntry {
  id: string;
  userId: string;
  projectId: string;
  taskId?: string;
  date: string;
  duration: number; // minutes
  billable: boolean;
  notes: string;
  approved: boolean;
  createdAt: string;
}

export interface Expense {
  id: string;
  projectId: string;
  userId: string;
  category: string;
  description: string;
  amount: number;
  date: string;
  billable: boolean;
  receipt?: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  projectId: string;
  clientId: string;
  status: InvoiceStatus;
  lineItems: InvoiceLineItem[];
  subtotal: number;
  tax: number;
  taxRate: number;
  discount: number;
  total: number;
  issueDate: string;
  dueDate: string;
  paidDate?: string;
  notes: string;
}

export interface InvoiceLineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
}

export interface Document {
  id: string;
  projectId: string;
  name: string;
  type: string; // pdf, image, doc, etc.
  size: number; // bytes
  uploadedBy: string;
  uploadedAt: string;
  version: number;
  clientShared: boolean;
  category: string;
  url: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'task' | 'project' | 'invoice' | 'budget' | 'time';
  read: boolean;
  createdAt: string;
  link?: string;
}

export interface ActivityLog {
  id: string;
  userId: string;
  entityType: 'project' | 'task' | 'invoice' | 'time' | 'document';
  entityId: string;
  action: string;
  detail: string;
  createdAt: string;
}

export interface TimerState {
  running: boolean;
  startTime: number | null;
  elapsed: number;
  projectId: string;
  taskId: string;
  billable: boolean;
  notes: string;
}
