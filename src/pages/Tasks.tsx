import { useState, useCallback } from 'react';
import {
  DndContext, DragOverlay, closestCorners, PointerSensor, useSensor, useSensors,
  type DragStartEvent, type DragEndEvent
} from '@dnd-kit/core';
import {
  SortableContext, verticalListSortingStrategy, useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Plus, Clock, Flag, User, Search, Filter } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { formatDate, priorityColor, getInitials } from '../lib/utils';
import type { Task, TaskStatus } from '../types';

const COLUMNS: { id: TaskStatus; label: string; color: string }[] = [
  { id: 'backlog',     label: 'Backlog',     color: '#94a3b8' },
  { id: 'todo',        label: 'To Do',       color: '#3b82f6' },
  { id: 'in_progress', label: 'In Progress', color: '#f59e0b' },
  { id: 'review',      label: 'Review',      color: '#8b5cf6' },
  { id: 'done',        label: 'Done',        color: '#10b981' },
];

function TaskCard({ task, users, projects, isDragging }: { task: Task; users: any[]; projects: any[]; isDragging?: boolean }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: task.id });
  const assignee = users.find(u => u.id === task.assigneeId);
  const project = projects.find(p => p.id === task.projectId);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="task-card animate-fade-in">
      {/* Priority + labels */}
      <div className="flex items-center gap-1.5 mb-2 flex-wrap">
        <span className={`${priorityColor(task.priority)} badge text-xs capitalize`}>
          <Flag size={10} /> {task.priority}
        </span>
        {task.labels.slice(0, 2).map(l => (
          <span key={l} className="badge-slate text-xs">{l}</span>
        ))}
      </div>

      <p className="text-sm font-medium text-slate-700 leading-snug mb-2">{task.title}</p>

      {/* Project */}
      {project && (
        <div className="flex items-center gap-1 mb-2">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: project.color }} />
          <span className="text-xs text-slate-400 truncate">{project.name}</span>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100">
        <div className="flex items-center gap-2">
          {assignee && (
            <div className="avatar-sm text-white text-xs" style={{ backgroundColor: assignee.avatarColor }}>
              {getInitials(assignee.name)}
            </div>
          )}
          <span className="text-xs text-slate-400 flex items-center gap-1"><Clock size={11} /> {task.estimatedHours}h</span>
        </div>
        {task.dueDate && (
          <span className={`text-xs font-medium ${new Date(task.dueDate) < new Date() ? 'text-red-500' : 'text-slate-400'}`}>
            {formatDate(task.dueDate, 'MMM d')}
          </span>
        )}
      </div>

      {/* Subtask progress */}
      {task.subtasks.length > 0 && (
        <div className="mt-2">
          <div className="flex justify-between text-xs text-slate-400 mb-1">
            <span>{task.subtasks.filter(s => s.completed).length}/{task.subtasks.length} subtasks</span>
          </div>
          <div className="budget-bar">
            <div className="budget-bar-fill bg-primary-500" style={{ width: `${(task.subtasks.filter(s => s.completed).length / task.subtasks.length) * 100}%` }} />
          </div>
        </div>
      )}
    </div>
  );
}

function KanbanColumn({ col, tasks, users, projects, activeId }: { col: typeof COLUMNS[0]; tasks: Task[]; users: any[]; projects: any[]; activeId: string | null }) {
  return (
    <div className="kanban-col">
      {/* Column header */}
      <div className="flex items-center justify-between px-1 mb-1">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: col.color }} />
          <span className="text-sm font-semibold text-slate-700">{col.label}</span>
          <span className="text-xs bg-slate-200 text-slate-500 px-1.5 py-0.5 rounded-full font-medium">{tasks.length}</span>
        </div>
        <button className="w-6 h-6 flex items-center justify-center rounded-lg hover:bg-slate-200 transition-colors text-slate-400">
          <Plus size={14} />
        </button>
      </div>

      <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
        <div className="space-y-2 flex-1 min-h-[40px]">
          {tasks.map(task => (
            <TaskCard key={task.id} task={task} users={users} projects={projects} isDragging={task.id === activeId} />
          ))}
        </div>
      </SortableContext>
    </div>
  );
}

export default function Tasks() {
  const { tasks, users, projects, moveTask, addTask, deleteTask } = useApp();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [projectFilter, setProjectFilter] = useState('all');
  const [isAdding, setIsAdding] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', projectId: projects[0]?.id || '', assigneeId: users[0]?.id || '', priority: 'medium' as const, estimate: 0 });

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const filteredTasks = tasks.filter(t => {
    const matchSearch = t.title.toLowerCase().includes(search.toLowerCase());
    const matchProject = projectFilter === 'all' || t.projectId === projectFilter;
    return matchSearch && matchProject;
  });

  const getColumnTasks = (status: TaskStatus) => filteredTasks.filter(t => t.status === status);

  const handleDragStart = useCallback((e: DragStartEvent) => setActiveId(String(e.active.id)), []);

  const handleDragEnd = useCallback((e: DragEndEvent) => {
    const { active, over } = e;
    setActiveId(null);
    if (!over) return;
    const overId = String(over.id);
    const col = COLUMNS.find(c => c.id === overId);
    if (col) {
      moveTask(String(active.id), col.id);
      return;
    }
    const overTask = tasks.find(t => t.id === overId);
    if (overTask && overTask.status !== tasks.find(t => t.id === String(active.id))?.status) {
      moveTask(String(active.id), overTask.status);
    }
  }, [tasks, moveTask]);

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    addTask({
      ...newTask,
      status: 'todo',
      dueDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
      tags: [],
      hoursLogged: 0,
      estimatedHours: newTask.estimate,
      subtasks: [],
      attachments: []
    });
    setIsAdding(false);
    setNewTask({ title: '', projectId: projects[0]?.id || '', assigneeId: users[0]?.id || '', priority: 'medium', estimate: 0 });
  };

  const activeTask = tasks.find(t => t.id === activeId);

  return (
    <div className="flex flex-col h-full gap-4 animate-fade-in relative">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Task Board</h1>
          <p className="text-slate-500 text-sm">{tasks.length} tasks across {projects.filter(p => p.status === 'active').length} projects</p>
        </div>
        <button onClick={() => setIsAdding(true)} className="btn-primary"><Plus size={16} /> Add Task</button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3">
        <div className="relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input className="input pl-9 w-56" placeholder="Search tasks..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select className="select w-48" value={projectFilter} onChange={e => setProjectFilter(e.target.value)}>
          <option value="all">All Projects</option>
          {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
      </div>

      {/* Board */}
      <DndContext sensors={sensors} collisionDetection={closestCorners} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <div className="flex gap-4 overflow-x-auto pb-4 flex-1">
          {COLUMNS.map(col => (
            <div key={col.id} className="flex flex-col gap-3 min-w-[280px]">
               <KanbanColumn col={col} tasks={getColumnTasks(col.id)} users={users} projects={projects} activeId={activeId} />
               <button 
                 onClick={() => {
                   setNewTask(prev => ({ ...prev, status: col.id } as any));
                   setIsAdding(true);
                 }}
                 className="w-full py-2 border-2 border-dashed border-slate-200 rounded-xl text-slate-400 text-xs font-medium hover:border-primary-300 hover:text-primary-500 hover:bg-primary-50 transition-all flex items-center justify-center gap-1.5"
               >
                 <Plus size={14} /> Add Task
               </button>
            </div>
          ))}
        </div>
        <DragOverlay>
          {activeTask && (
            <div className="task-card shadow-2xl rotate-2 opacity-95">
              <p className="text-sm font-medium text-slate-700">{activeTask.title}</p>
            </div>
          )}
        </DragOverlay>
      </DndContext>

      {/* Task Creation Drawer */}
      {isAdding && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm" onClick={() => setIsAdding(false)} />
          <div className="relative w-full max-w-md bg-white h-full shadow-2xl animate-slide-in-right p-8 overflow-y-auto">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-bold text-slate-800">New Task</h2>
              <button onClick={() => setIsAdding(false)} className="p-2 hover:bg-slate-100 rounded-lg"><X size={20} /></button>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-6">
              <div>
                <label className="label">Title</label>
                <input 
                  autoFocus
                  required
                  className="input" 
                  placeholder="Task title..." 
                  value={newTask.title}
                  onChange={e => setNewTask(prev => ({ ...prev, title: e.target.value }))}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Project</label>
                  <select 
                    className="select"
                    value={newTask.projectId}
                    onChange={e => setNewTask(prev => ({ ...prev, projectId: e.target.value }))}
                  >
                    {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="label">Assignee</label>
                  <select 
                    className="select"
                    value={newTask.assigneeId}
                    onChange={e => setNewTask(prev => ({ ...prev, assigneeId: e.target.value }))}
                  >
                    {users.filter(u => u.role !== 'client').map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Priority</label>
                  <select 
                    className="select"
                    value={newTask.priority}
                    onChange={e => setNewTask(prev => ({ ...prev, priority: e.target.value as any }))}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>
                <div>
                  <label className="label">Est. Hours</label>
                  <input 
                    type="number"
                    className="input" 
                    value={newTask.estimate}
                    onChange={e => setNewTask(prev => ({ ...prev, estimate: parseInt(e.target.value) || 0 }))}
                  />
                </div>
              </div>

              <div className="pt-6 flex gap-3">
                <button type="button" onClick={() => setIsAdding(false)} className="btn-secondary flex-1 justify-center">Cancel</button>
                <button type="submit" className="btn-primary flex-1 justify-center">Create Task</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
