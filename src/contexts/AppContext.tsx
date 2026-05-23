import React, { createContext, useContext, useState, useCallback } from 'react';
import type { Project, Task, TimeEntry, Invoice, Document, Notification, TimerState, Client } from '../types';
import {
  PROJECTS, TASKS, TIME_ENTRIES, INVOICES, DOCUMENTS, NOTIFICATIONS, USERS, CLIENTS,
  MILESTONES, EXPENSES, ACTIVITY_LOGS
} from '../data/mockData';
import { generateId } from '../lib/utils';

interface AppContextType {
  projects: Project[];
  tasks: Task[];
  timeEntries: TimeEntry[];
  invoices: Invoice[];
  documents: Document[];
  notifications: Notification[];
  users: typeof USERS;
  clients: Client[];
  milestones: typeof MILESTONES;
  expenses: typeof EXPENSES;
  activityLogs: typeof ACTIVITY_LOGS;
  
  // Timer
  timer: TimerState;
  startTimer: (projectId: string, taskId?: string, billable?: boolean) => void;
  stopTimer: () => TimeEntry | null;
  updateTimer: (partial: Partial<TimerState>) => void;
  
  // CRUD
  addProject: (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt' | 'spent' | 'hoursLogged' | 'health'>) => Project;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => Task;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  moveTask: (taskId: string, newStatus: Task['status']) => void;
  
  addTimeEntry: (entry: Omit<TimeEntry, 'id' | 'createdAt'>) => TimeEntry;
  updateTimeEntry: (id: string, updates: Partial<TimeEntry>) => void;
  deleteTimeEntry: (id: string) => void;
  
  addClient: (client: Omit<Client, 'id' | 'createdAt' | 'activeProjects' | 'totalRevenue'>) => Client;
  updateClient: (id: string, updates: Partial<Client>) => void;
  
  addInvoice: (invoice: Omit<Invoice, 'id' | 'createdAt' | 'invoiceNumber'>) => Invoice;
  updateInvoice: (id: string, updates: Partial<Invoice>) => void;
  deleteInvoice: (id: string) => void;
  
  addDocument: (document: Omit<Document, 'id' | 'uploadedAt' | 'version'>) => Document;
  deleteDocument: (id: string) => void;
  
  addActivity: (detail: string, userId: string, entityId: string, entityType: string) => void;
  
  markNotificationsRead: () => void;
  unreadCount: number;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [projects, setProjects] = useState<Project[]>(PROJECTS);
  const [tasks, setTasks] = useState<Task[]>(TASKS);
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>(TIME_ENTRIES);
  const [invoices, setInvoices] = useState<Invoice[]>(INVOICES);
  const [documents, setDocuments] = useState<Document[]>(DOCUMENTS);
  const [clients, setClients] = useState<Client[]>(CLIENTS);
  const [notifications, setNotifications] = useState(NOTIFICATIONS);
  const [activityLogs, setActivityLogs] = useState(ACTIVITY_LOGS);
  
  const [timer, setTimer] = useState<TimerState>({
    running: false, startTime: null, elapsed: 0,
    projectId: '', taskId: '', billable: true, notes: ''
  });

  const addActivity = useCallback((detail: string, userId: string, entityId: string, entityType: string) => {
    setActivityLogs(prev => [{
      id: generateId(), userId, detail, entityId, entityType, createdAt: new Date().toISOString()
    }, ...prev]);
  }, []);

  const addProject = useCallback((project: Omit<Project, 'id' | 'createdAt' | 'updatedAt' | 'spent' | 'hoursLogged' | 'health'>): Project => {
    const newProject: Project = {
      ...project,
      id: generateId(),
      health: 'on_track',
      spent: 0,
      hoursLogged: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setProjects(prev => [newProject, ...prev]);
    addActivity(`Created project: ${newProject.name}`, 'u1', newProject.id, 'project');
    return newProject;
  }, [addActivity]);

  const updateProject = useCallback((id: string, updates: Partial<Project>) => {
    setProjects(prev => prev.map(p => p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p));
  }, []);

  const deleteProject = useCallback((id: string) => {
    setProjects(prev => prev.filter(p => p.id !== id));
  }, []);

  const addTask = useCallback((task: Omit<Task, 'id' | 'createdAt'>): Task => {
    const newTask: Task = { ...task, id: generateId(), createdAt: new Date().toISOString() };
    setTasks(prev => [...prev, newTask]);
    addActivity(`Added task: ${newTask.title}`, 'u1', newTask.id, 'task');
    return newTask;
  }, [addActivity]);

  const updateTask = useCallback((id: string, updates: Partial<Task>) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
  }, []);

  const deleteTask = useCallback((id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  }, []);

  const moveTask = useCallback((taskId: string, newStatus: Task['status']) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
  }, []);

  const addTimeEntry = useCallback((entry: Omit<TimeEntry, 'id' | 'createdAt'>): TimeEntry => {
    const newEntry: TimeEntry = { ...entry, id: generateId(), createdAt: new Date().toISOString() };
    setTimeEntries(prev => [newEntry, ...prev]);
    return newEntry;
  }, []);

  const updateTimeEntry = useCallback((id: string, updates: Partial<TimeEntry>) => {
    setTimeEntries(prev => prev.map(e => e.id === id ? { ...e, ...updates } : e));
  }, []);

  const deleteTimeEntry = useCallback((id: string) => {
    setTimeEntries(prev => prev.filter(e => e.id !== id));
  }, []);

  const addClient = useCallback((client: Omit<Client, 'id' | 'createdAt' | 'activeProjects' | 'totalRevenue'>): Client => {
    const newClient: Client = {
      ...client,
      id: generateId(),
      activeProjects: 0,
      totalRevenue: 0
    };
    setClients(prev => [newClient, ...prev]);
    return newClient;
  }, []);

  const updateClient = useCallback((id: string, updates: Partial<Client>) => {
    setClients(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
  }, []);

  const addInvoice = useCallback((invoice: Omit<Invoice, 'id' | 'createdAt' | 'invoiceNumber'>): Invoice => {
    const newInvoice: Invoice = {
      ...invoice,
      id: generateId(),
      invoiceNumber: `INV-${Date.now().toString().slice(-6)}`
    };
    setInvoices(prev => [newInvoice, ...prev]);
    return newInvoice;
  }, []);

  const updateInvoice = useCallback((id: string, updates: Partial<Invoice>) => {
    setInvoices(prev => prev.map(i => i.id === id ? { ...i, ...updates } : i));
  }, []);

  const deleteInvoice = useCallback((id: string) => {
    setInvoices(prev => prev.filter(i => i.id !== id));
  }, []);

  const addDocument = useCallback((document: Omit<Document, 'id' | 'uploadedAt' | 'version'>): Document => {
    const newDoc: Document = {
      ...document,
      id: generateId(),
      version: 1,
      uploadedAt: new Date().toISOString()
    };
    setDocuments(prev => [newDoc, ...prev]);
    return newDoc;
  }, []);

  const deleteDocument = useCallback((id: string) => {
    setDocuments(prev => prev.filter(d => d.id !== id));
  }, []);

  const startTimer = useCallback((projectId: string, taskId = '', billable = true) => {
    setTimer({ running: true, startTime: Date.now(), elapsed: 0, projectId, taskId, billable, notes: '' });
  }, []);

  const stopTimer = useCallback((): TimeEntry | null => {
    if (!timer.running || !timer.startTime) return null;
    const duration = Math.round((Date.now() - timer.startTime) / 60000) || 1;
    const entry = addTimeEntry({
      userId: 'u1', projectId: timer.projectId, taskId: timer.taskId || undefined,
      date: new Date().toISOString().split('T')[0], duration, billable: timer.billable,
      notes: timer.notes, approved: false
    });
    setTimer({ running: false, startTime: null, elapsed: 0, projectId: '', taskId: '', billable: true, notes: '' });
    return entry;
  }, [timer, addTimeEntry]);

  const updateTimer = useCallback((partial: Partial<TimerState>) => {
    setTimer(prev => ({ ...prev, ...partial }));
  }, []);

  const markNotificationsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <AppContext.Provider value={{
      projects, tasks, timeEntries, invoices, documents, notifications,
      users: USERS, clients, milestones: MILESTONES, expenses: EXPENSES, activityLogs,
      timer, startTimer, stopTimer, updateTimer,
      addProject, updateProject, deleteProject,
      addTask, updateTask, deleteTask, moveTask,
      addTimeEntry, updateTimeEntry, deleteTimeEntry,
      addClient, updateClient,
      addInvoice, updateInvoice, deleteInvoice,
      addDocument, deleteDocument,
      addActivity, markNotificationsRead, unreadCount,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
