import type {
  User, Client, Project, Task, TimeEntry, Invoice, Milestone,
  Expense, Document, ActivityLog, Notification
} from '../types';

// ─── USERS ──────────────────────────────────────────────────────────────────
export const USERS: User[] = [
  { id: 'u1', name: 'Alex Morgan', email: 'admin@agency.com', role: 'owner', avatarColor: '#3b82f6', hourlyRate: 150, capacity: 40, skills: ['Strategy', 'Leadership', 'Sales'], jobTitle: 'Agency Owner' },
  { id: 'u2', name: 'Jordan Lee', email: 'pm@agency.com', role: 'project_manager', avatarColor: '#8b5cf6', hourlyRate: 120, capacity: 40, skills: ['Project Management', 'Scrum', 'Client Relations'], jobTitle: 'Senior Project Manager' },
  { id: 'u3', name: 'Sam Rivera', email: 'dev@agency.com', role: 'team_member', avatarColor: '#10b981', hourlyRate: 95, capacity: 40, skills: ['React', 'TypeScript', 'Node.js', 'AWS'], jobTitle: 'Full-Stack Developer' },
  { id: 'u4', name: 'Casey Kim', email: 'design@agency.com', role: 'team_member', avatarColor: '#f59e0b', hourlyRate: 90, capacity: 32, skills: ['UI/UX', 'Figma', 'Branding', 'Motion'], jobTitle: 'Senior Designer' },
  { id: 'u5', name: 'Riley Chen', email: 'content@agency.com', role: 'team_member', avatarColor: '#ef4444', hourlyRate: 75, capacity: 40, skills: ['Copywriting', 'SEO', 'Content Strategy'], jobTitle: 'Content Strategist' },
  { id: 'u6', name: 'Dana Scott', email: 'client@acmecorp.com', role: 'client', avatarColor: '#06b6d4', hourlyRate: 0, capacity: 0, skills: [], jobTitle: 'Marketing Director', clientId: 'c1' },
  { id: 'u7', name: 'Taylor Brooks', email: 'client2@techstart.io', role: 'client', avatarColor: '#84cc16', hourlyRate: 0, capacity: 0, skills: [], jobTitle: 'CEO', clientId: 'c2' },
];

// ─── CLIENTS ────────────────────────────────────────────────────────────────
export const CLIENTS: Client[] = [
  { id: 'c1', name: 'Dana Scott', email: 'dana@acmecorp.com', company: 'Acme Corporation', phone: '+1 555-0101', address: '123 Business Ave, NY 10001', color: '#3b82f6', totalRevenue: 145000, activeProjects: 2 },
  { id: 'c2', name: 'Taylor Brooks', email: 'taylor@techstart.io', company: 'TechStart Inc.', phone: '+1 555-0202', address: '456 Innovation Dr, SF 94105', color: '#8b5cf6', totalRevenue: 87500, activeProjects: 1 },
  { id: 'c3', name: 'Morgan White', email: 'morgan@greenleaf.co', company: 'GreenLeaf Co.', phone: '+1 555-0303', address: '789 Eco Way, Austin TX 78701', color: '#10b981', totalRevenue: 62000, activeProjects: 1 },
  { id: 'c4', name: 'Jamie Foster', email: 'jamie@luxebrand.com', company: 'LuxeBrand', phone: '+1 555-0404', address: '321 Luxury Lane, Miami FL 33101', color: '#f59e0b', totalRevenue: 210000, activeProjects: 0 },
];

// ─── PROJECTS ────────────────────────────────────────────────────────────────
export const PROJECTS: Project[] = [
  { id: 'p1', name: 'Acme Website Redesign', clientId: 'c1', status: 'active', health: 'on_track', budgetType: 'fixed_price', budget: 45000, spent: 22500, description: 'Complete redesign of Acme Corp website including brand refresh, new CMS, and SEO optimization.', startDate: '2026-03-01', endDate: '2026-06-30', teamIds: ['u2','u3','u4','u5'], managerId: 'u2', hoursLogged: 186, hoursEstimated: 320, color: '#3b82f6', tags: ['Web', 'Branding'], createdAt: '2026-02-15' },
  { id: 'p2', name: 'TechStart Brand Identity', clientId: 'c2', status: 'active', health: 'at_risk', budgetType: 'fixed_price', budget: 28000, spent: 24200, description: 'Full brand identity package including logo, guidelines, and collateral templates.', startDate: '2026-04-01', endDate: '2026-05-31', teamIds: ['u2','u4'], managerId: 'u2', hoursLogged: 210, hoursEstimated: 240, color: '#8b5cf6', tags: ['Branding', 'Design'], createdAt: '2026-03-20' },
  { id: 'p3', name: 'GreenLeaf SEO Retainer', clientId: 'c3', status: 'active', health: 'on_track', budgetType: 'retainer', budget: 5000, spent: 2100, description: 'Monthly SEO retainer: content production, link building, and technical SEO.', startDate: '2026-01-01', endDate: '2026-12-31', teamIds: ['u2','u5'], managerId: 'u2', hoursLogged: 28, hoursEstimated: 40, color: '#10b981', tags: ['SEO', 'Content'], createdAt: '2025-12-15' },
  { id: 'p4', name: 'LuxeBrand E-Commerce Platform', clientId: 'c4', status: 'completed', health: 'on_track', budgetType: 'time_materials', budget: 75000, spent: 68400, description: 'Custom Shopify Plus e-commerce with luxury UI, AR try-on, and ERP integration.', startDate: '2025-09-01', endDate: '2026-02-28', teamIds: ['u2','u3','u4'], managerId: 'u2', hoursLogged: 720, hoursEstimated: 750, color: '#f59e0b', tags: ['E-Commerce', 'Web', 'Dev'], createdAt: '2025-08-10' },
  { id: 'p5', name: 'Acme CRM Integration', clientId: 'c1', status: 'planning', health: 'on_track', budgetType: 'time_materials', budget: 32000, spent: 3200, description: 'Integrate HubSpot CRM with existing Acme systems, custom reporting dashboard.', startDate: '2026-06-01', endDate: '2026-09-30', teamIds: ['u2','u3'], managerId: 'u2', hoursLogged: 24, hoursEstimated: 280, color: '#06b6d4', tags: ['Dev', 'CRM'], createdAt: '2026-05-01' },
];

// ─── MILESTONES ────────────────────────────────────────────────────────────
export const MILESTONES: Milestone[] = [
  { id: 'm1', projectId: 'p1', title: 'Discovery & Wireframes', dueDate: '2026-03-31', completed: true, description: 'User research, site audit, wireframe delivery' },
  { id: 'm2', projectId: 'p1', title: 'Design System & UI', dueDate: '2026-04-30', completed: true, description: 'Component library, all page designs in Figma' },
  { id: 'm3', projectId: 'p1', title: 'Development Phase 1', dueDate: '2026-05-31', completed: false, description: 'CMS setup, core pages developed' },
  { id: 'm4', projectId: 'p1', title: 'Final Launch', dueDate: '2026-06-30', completed: false, description: 'QA, SEO, go-live' },
  { id: 'm5', projectId: 'p2', title: 'Brand Strategy', dueDate: '2026-04-15', completed: true, description: 'Positioning, audience, competitive analysis' },
  { id: 'm6', projectId: 'p2', title: 'Logo & Visual Identity', dueDate: '2026-05-01', completed: true, description: 'Logo design, color palette, typography' },
  { id: 'm7', projectId: 'p2', title: 'Brand Guidelines Delivery', dueDate: '2026-05-31', completed: false, description: 'Final brand book and asset package' },
];

// ─── TASKS ────────────────────────────────────────────────────────────────
export const TASKS: Task[] = [
  { id: 't1', projectId: 'p1', title: 'Homepage hero section design', description: 'Design a stunning hero section with animation for the homepage.', status: 'done', priority: 'high', assigneeId: 'u4', estimatedHours: 8, loggedHours: 9, dueDate: '2026-04-20', labels: ['Design','UI'], subtasks: [{id:'st1',title:'Sketch wireframes',completed:true},{id:'st2',title:'High-fidelity mockup',completed:true}], comments: [{id:'c1',userId:'u2',content:'Looks great! Client approved.',createdAt:'2026-04-19T10:00:00Z'}], createdAt: '2026-04-10', order: 0 },
  { id: 't2', projectId: 'p1', title: 'Implement CMS with Contentful', description: 'Set up Contentful CMS and integrate with Next.js frontend.', status: 'in_progress', priority: 'high', assigneeId: 'u3', estimatedHours: 24, loggedHours: 14, dueDate: '2026-05-28', labels: ['Dev','Backend'], subtasks: [{id:'st3',title:'CMS schema design',completed:true},{id:'st4',title:'API integration',completed:false},{id:'st5',title:'Content migration',completed:false}], comments: [], createdAt: '2026-05-01', order: 0 },
  { id: 't3', projectId: 'p1', title: 'SEO audit and on-page optimization', description: 'Full SEO audit, fix technical issues, optimize meta tags and content.', status: 'todo', priority: 'medium', assigneeId: 'u5', estimatedHours: 12, loggedHours: 0, dueDate: '2026-06-15', labels: ['SEO'], subtasks: [], comments: [], createdAt: '2026-05-10', order: 0 },
  { id: 't4', projectId: 'p1', title: 'Performance optimization & Core Web Vitals', description: 'Achieve 90+ Lighthouse score on all pages.', status: 'backlog', priority: 'medium', assigneeId: 'u3', estimatedHours: 8, loggedHours: 0, dueDate: '2026-06-25', labels: ['Dev','Performance'], subtasks: [], comments: [], createdAt: '2026-05-10', order: 1 },
  { id: 't5', projectId: 'p1', title: 'QA testing across devices', description: 'Test all pages on iOS, Android, desktop browsers.', status: 'backlog', priority: 'high', assigneeId: 'u3', estimatedHours: 10, loggedHours: 0, dueDate: '2026-06-28', labels: ['QA'], subtasks: [], comments: [], createdAt: '2026-05-10', order: 2 },
  { id: 't6', projectId: 'p2', title: 'Final logo variations delivery', description: 'Deliver all logo variants: horizontal, stacked, icon-only, dark/light.', status: 'review', priority: 'critical', assigneeId: 'u4', estimatedHours: 6, loggedHours: 7, dueDate: '2026-05-22', labels: ['Design','Delivery'], subtasks: [{id:'st6',title:'Export SVG/PNG files',completed:true},{id:'st7',title:'Color variations',completed:true},{id:'st8',title:'Upload to client portal',completed:false}], comments: [{id:'c2',userId:'u4',content:'All variants exported, awaiting final review.',createdAt:'2026-05-21T15:00:00Z'}], createdAt: '2026-05-15', order: 0 },
  { id: 't7', projectId: 'p2', title: 'Brand guidelines document', description: 'Create 40-page brand usage guidelines PDF.', status: 'in_progress', priority: 'high', assigneeId: 'u4', estimatedHours: 20, loggedHours: 12, dueDate: '2026-05-29', labels: ['Design','Document'], subtasks: [], comments: [], createdAt: '2026-05-10', order: 1 },
  { id: 't8', projectId: 'p3', title: 'May blog posts (4 articles)', description: 'Write 4 SEO-optimized articles on sustainability topics.', status: 'in_progress', priority: 'medium', assigneeId: 'u5', estimatedHours: 16, loggedHours: 8, dueDate: '2026-05-27', labels: ['Content','SEO'], subtasks: [], comments: [], createdAt: '2026-05-01', order: 0 },
  { id: 't9', projectId: 'p3', title: 'Link building outreach (20 links)', description: 'Outreach for 20 high-DA backlinks in the eco-friendly niche.', status: 'todo', priority: 'medium', assigneeId: 'u5', estimatedHours: 10, loggedHours: 0, dueDate: '2026-05-31', labels: ['SEO'], subtasks: [], comments: [], createdAt: '2026-05-01', order: 0 },
];

// ─── TIME ENTRIES ────────────────────────────────────────────────────────────
export const TIME_ENTRIES: TimeEntry[] = [
  { id: 'te1', userId: 'u3', projectId: 'p1', taskId: 't2', date: '2026-05-22', duration: 240, billable: true, notes: 'CMS schema setup and API configuration', approved: true, createdAt: '2026-05-22T12:00:00Z' },
  { id: 'te2', userId: 'u4', projectId: 'p2', taskId: 't6', date: '2026-05-22', duration: 180, billable: true, notes: 'Final logo export and file organization', approved: false, createdAt: '2026-05-22T11:00:00Z' },
  { id: 'te3', userId: 'u5', projectId: 'p3', taskId: 't8', date: '2026-05-22', duration: 120, billable: true, notes: 'First article draft - solar energy trends', approved: true, createdAt: '2026-05-22T09:00:00Z' },
  { id: 'te4', userId: 'u2', projectId: 'p1', date: '2026-05-22', duration: 60, billable: false, notes: 'Weekly team standup and planning', approved: true, createdAt: '2026-05-22T09:00:00Z' },
  { id: 'te5', userId: 'u3', projectId: 'p1', taskId: 't2', date: '2026-05-21', duration: 360, billable: true, notes: 'Next.js frontend integration with Contentful API', approved: true, createdAt: '2026-05-21T17:00:00Z' },
  { id: 'te6', userId: 'u4', projectId: 'p2', taskId: 't7', date: '2026-05-21', duration: 300, billable: true, notes: 'Brand guidelines sections 1-4', approved: true, createdAt: '2026-05-21T16:00:00Z' },
  { id: 'te7', userId: 'u2', projectId: 'p5', date: '2026-05-21', duration: 120, billable: true, notes: 'Project kickoff and requirements gathering', approved: true, createdAt: '2026-05-21T11:00:00Z' },
  { id: 'te8', userId: 'u5', projectId: 'p3', taskId: 't8', date: '2026-05-20', duration: 240, billable: true, notes: 'Research and outline for 3 articles', approved: true, createdAt: '2026-05-20T15:00:00Z' },
];

// ─── EXPENSES ────────────────────────────────────────────────────────────────
export const EXPENSES: Expense[] = [
  { id: 'ex1', projectId: 'p1', userId: 'u3', category: 'Software', description: 'Contentful CMS subscription (1yr)', amount: 1200, date: '2026-03-15', billable: true },
  { id: 'ex2', projectId: 'p1', userId: 'u4', category: 'Design Tools', description: 'Stock photos license', amount: 350, date: '2026-04-02', billable: true },
  { id: 'ex3', projectId: 'p2', userId: 'u4', category: 'Printing', description: 'Brand book printing samples', amount: 180, date: '2026-05-10', billable: true },
  { id: 'ex4', projectId: 'p3', userId: 'u5', category: 'Tools', description: 'SEMrush subscription (monthly)', amount: 120, date: '2026-05-01', billable: false },
];

// ─── INVOICES ────────────────────────────────────────────────────────────────
export const INVOICES: Invoice[] = [
  {
    id: 'inv1', invoiceNumber: 'INV-2026-001', projectId: 'p4', clientId: 'c4', status: 'paid',
    lineItems: [
      { id: 'li1', description: 'E-Commerce Platform Development — Phase 1', quantity: 1, unitPrice: 35000, amount: 35000 },
      { id: 'li2', description: 'UI/UX Design', quantity: 1, unitPrice: 18000, amount: 18000 },
    ],
    subtotal: 53000, tax: 5300, taxRate: 10, discount: 0, total: 58300,
    issueDate: '2026-01-15', dueDate: '2026-02-14', paidDate: '2026-02-10', notes: 'Thank you for your business!'
  },
  {
    id: 'inv2', invoiceNumber: 'INV-2026-002', projectId: 'p1', clientId: 'c1', status: 'sent',
    lineItems: [
      { id: 'li3', description: 'Website Redesign — Milestone 1 & 2', quantity: 1, unitPrice: 22500, amount: 22500 },
    ],
    subtotal: 22500, tax: 2250, taxRate: 10, discount: 0, total: 24750,
    issueDate: '2026-05-01', dueDate: '2026-05-31', notes: 'Payment due within 30 days.'
  },
  {
    id: 'inv3', invoiceNumber: 'INV-2026-003', projectId: 'p2', clientId: 'c2', status: 'overdue',
    lineItems: [
      { id: 'li4', description: 'Brand Identity — Deposit (50%)', quantity: 1, unitPrice: 14000, amount: 14000 },
    ],
    subtotal: 14000, tax: 1400, taxRate: 10, discount: 500, total: 14900,
    issueDate: '2026-04-01', dueDate: '2026-04-30', notes: 'Deposit invoice as per proposal.'
  },
  {
    id: 'inv4', invoiceNumber: 'INV-2026-004', projectId: 'p3', clientId: 'c3', status: 'paid',
    lineItems: [
      { id: 'li5', description: 'SEO Retainer — April 2026', quantity: 1, unitPrice: 5000, amount: 5000 },
    ],
    subtotal: 5000, tax: 0, taxRate: 0, discount: 0, total: 5000,
    issueDate: '2026-04-30', dueDate: '2026-05-15', paidDate: '2026-05-08', notes: ''
  },
  {
    id: 'inv5', invoiceNumber: 'INV-2026-005', projectId: 'p3', clientId: 'c3', status: 'draft',
    lineItems: [
      { id: 'li6', description: 'SEO Retainer — May 2026', quantity: 1, unitPrice: 5000, amount: 5000 },
    ],
    subtotal: 5000, tax: 0, taxRate: 0, discount: 0, total: 5000,
    issueDate: '2026-05-31', dueDate: '2026-06-15', notes: ''
  },
];

// ─── DOCUMENTS ────────────────────────────────────────────────────────────────
export const DOCUMENTS: Document[] = [
  { id: 'd1', projectId: 'p1', name: 'Acme Website Brief.pdf', type: 'pdf', size: 2400000, uploadedBy: 'u2', uploadedAt: '2026-03-01T10:00:00Z', version: 1, clientShared: true, category: 'Brief', url: '#' },
  { id: 'd2', projectId: 'p1', name: 'Wireframes_v2.fig', type: 'figma', size: 8900000, uploadedBy: 'u4', uploadedAt: '2026-04-02T14:00:00Z', version: 2, clientShared: false, category: 'Design', url: '#' },
  { id: 'd3', projectId: 'p1', name: 'Homepage_Design_Final.png', type: 'image', size: 4500000, uploadedBy: 'u4', uploadedAt: '2026-04-28T16:00:00Z', version: 1, clientShared: true, category: 'Design', url: '#' },
  { id: 'd4', projectId: 'p2', name: 'TechStart_Brand_Brief.pdf', type: 'pdf', size: 1800000, uploadedBy: 'u2', uploadedAt: '2026-04-01T09:00:00Z', version: 1, clientShared: false, category: 'Brief', url: '#' },
  { id: 'd5', projectId: 'p2', name: 'Logo_Concepts_v3.pdf', type: 'pdf', size: 5200000, uploadedBy: 'u4', uploadedAt: '2026-05-05T11:00:00Z', version: 3, clientShared: true, category: 'Design', url: '#' },
  { id: 'd6', projectId: 'p3', name: 'SEO_Strategy_2026.pdf', type: 'pdf', size: 3100000, uploadedBy: 'u5', uploadedAt: '2026-01-10T10:00:00Z', version: 1, clientShared: true, category: 'Strategy', url: '#' },
];

// ─── ACTIVITY LOGS ────────────────────────────────────────────────────────────
export const ACTIVITY_LOGS: ActivityLog[] = [
  { id: 'a1', userId: 'u4', entityType: 'task', entityId: 't6', action: 'completed', detail: 'Completed task "Final logo variations delivery"', createdAt: '2026-05-22T11:30:00Z' },
  { id: 'a2', userId: 'u3', entityType: 'time', entityId: 'te1', action: 'logged', detail: 'Logged 4h on Acme Website Redesign', createdAt: '2026-05-22T12:15:00Z' },
  { id: 'a3', userId: 'u2', entityType: 'project', entityId: 'p5', action: 'created', detail: 'Created project "Acme CRM Integration"', createdAt: '2026-05-21T09:00:00Z' },
  { id: 'a4', userId: 'u4', entityType: 'document', entityId: 'd5', action: 'uploaded', detail: 'Uploaded Logo_Concepts_v3.pdf', createdAt: '2026-05-05T11:00:00Z' },
  { id: 'a5', userId: 'u5', entityType: 'task', entityId: 't8', action: 'started', detail: 'Started "May blog posts (4 articles)"', createdAt: '2026-05-20T09:00:00Z' },
  { id: 'a6', userId: 'u2', entityType: 'invoice', entityId: 'inv2', action: 'sent', detail: 'Sent invoice INV-2026-002 to Acme Corporation', createdAt: '2026-05-01T10:00:00Z' },
];

// ─── NOTIFICATIONS ────────────────────────────────────────────────────────────
export const NOTIFICATIONS: Notification[] = [
  { id: 'n1', userId: 'u1', title: 'Budget Alert', message: 'TechStart Brand Identity has reached 86% of budget.', type: 'budget', read: false, createdAt: '2026-05-22T08:00:00Z' },
  { id: 'n2', userId: 'u1', title: 'Invoice Overdue', message: 'INV-2026-003 for TechStart Inc. is overdue by 22 days.', type: 'invoice', read: false, createdAt: '2026-05-21T08:00:00Z' },
  { id: 'n3', userId: 'u2', title: 'Task Review Needed', message: 'Casey Kim submitted "Logo variations" for review.', type: 'task', read: false, createdAt: '2026-05-22T11:30:00Z' },
  { id: 'n4', userId: 'u3', title: 'New Task Assigned', message: 'QA testing task assigned to you for Acme Website.', type: 'task', read: true, createdAt: '2026-05-20T09:00:00Z' },
  { id: 'n5', userId: 'u2', title: 'Milestone Approaching', message: 'Development Phase 1 milestone is due in 9 days.', type: 'project', read: true, createdAt: '2026-05-22T07:00:00Z' },
];

// ─── MONTHLY REVENUE DATA (for charts) ───────────────────────────────────────
export const REVENUE_DATA = [
  { month: 'Jan', revenue: 32000, cost: 21000, profit: 11000 },
  { month: 'Feb', revenue: 58300, cost: 38000, profit: 20300 },
  { month: 'Mar', revenue: 28000, cost: 19000, profit: 9000 },
  { month: 'Apr', revenue: 41000, cost: 27000, profit: 14000 },
  { month: 'May', revenue: 35000, cost: 22000, profit: 13000 },
  { month: 'Jun', revenue: 48000, cost: 31000, profit: 17000 },
];

// ─── TEAM UTILIZATION DATA ────────────────────────────────────────────────────
export const UTILIZATION_DATA = [
  { week: 'W1 May', u2: 80, u3: 95, u4: 88, u5: 70 },
  { week: 'W2 May', u2: 75, u3: 100, u4: 92, u5: 65 },
  { week: 'W3 May', u2: 85, u3: 90, u4: 85, u5: 80 },
  { week: 'W4 May', u2: 90, u3: 88, u4: 78, u5: 75 },
];
