import React, { useState, useEffect, useMemo } from 'react';
import confetti from 'canvas-confetti';
import {
  LayoutDashboard,
  ListTodo,
  BarChart3,
  Timer,
  Users2,
  Plus,
  Search,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Sun,
  Moon,
  Trash2,
  Play,
  Pause,
  RotateCcw,
  Filter,
  CheckSquare,
  Square,
  Layers
} from 'lucide-react';
import type { Task, TaskStatus, TaskPriority, TeamMember, TimeLog, ViewMode } from './types';

const INITIAL_TASKS: Task[] = [
  {
    id: 'PF-101',
    title: 'Cloud arxitektura va mikroservislarni sozlash',
    description: 'Kubernetes klasterlari va Docker konteynerlarini AWS muhitida optimal konfiguratsiya qilish.',
    status: 'in_progress',
    priority: 'urgent',
    label: 'DevOps',
    assignee: { name: 'Sardor Aliyev', avatar: 'SA', role: 'DevOps Lead' },
    dueDate: '2026-11-25',
    createdAt: '2026-11-15',
    subtasks: [
      { id: 'st-1', text: 'Helm chartlarni yaratish', done: true },
      { id: 'st-2', text: 'CI/CD pipeline testlash', done: true },
      { id: 'st-3', text: 'Cluster monitoring o\'rnatish', done: false }
    ],
    timeEstimateHours: 18
  },
  {
    id: 'PF-102',
    title: 'Mobile ilova uchun Glassmorphism UI dizayn tizimi',
    description: 'Figma da yangi dark/light mavzular va interaktiv animatsion komponentlar kutubxonasini ishlab chiqish.',
    status: 'review',
    priority: 'high',
    label: 'Design',
    assignee: { name: 'Malika Karimova', avatar: 'MK', role: 'Lead UI/UX' },
    dueDate: '2026-11-22',
    createdAt: '2026-11-16',
    subtasks: [
      { id: 'st-4', text: 'Typography & Color Tokens', done: true },
      { id: 'st-5', text: '3D Icons & Illustrations', done: true }
    ],
    timeEstimateHours: 12
  },
  {
    id: 'PF-103',
    title: 'PostgreSQL so\'rovlarini indekslash va 4x tezlashtirish',
    description: 'Og\'ir analitik aggregation so\'rovlariga B-Tree va GIN indekslar qo\'shib, response time ni 40ms ga tushirish.',
    status: 'todo',
    priority: 'medium',
    label: 'Database',
    assignee: { name: 'Javohir Toshmatov', avatar: 'JT', role: 'Backend Dev' },
    dueDate: '2026-11-28',
    createdAt: '2026-11-17',
    subtasks: [
      { id: 'st-6', text: 'Slow query loglarni tahlil qilish', done: true },
      { id: 'st-7', text: 'Partitioning sozlash', done: false }
    ],
    timeEstimateHours: 10
  },
  {
    id: 'PF-104',
    title: 'End-to-End Playwright va Vitest avtotestlari',
    description: 'Autentifikatsiya, to\'lov shlyuzlari va foydalanuvchi profil oqimlarini 95%+ test coverage bilan qoplash.',
    status: 'done',
    priority: 'high',
    label: 'QA & Testing',
    assignee: { name: 'Diyorbek Rahimov', avatar: 'DR', role: 'QA Engineer' },
    dueDate: '2026-11-18',
    createdAt: '2026-11-12',
    subtasks: [
      { id: 'st-8', text: 'Auth flow testlari', done: true },
      { id: 'st-9', text: 'Checkout flow testlari', done: true }
    ],
    timeEstimateHours: 14
  },
  {
    id: 'PF-105',
    title: 'AI tavsiya algoritmi va neyron tarmoq modeli',
    description: 'Foydalanuvchi xatti-harakatlariga qarab mahsulotlarni real-vaqtda saralovchi tavsiya tizimi.',
    status: 'backlog',
    priority: 'low',
    label: 'AI & Data',
    assignee: { name: 'Nilufar Yusupova', avatar: 'NY', role: 'Data Scientist' },
    dueDate: '2026-12-05',
    createdAt: '2026-11-18',
    subtasks: [
      { id: 'st-10', text: 'Dataset tozalash', done: false },
      { id: 'st-11', text: 'Embeddings generatsiya qilish', done: false }
    ],
    timeEstimateHours: 24
  }
];

const INITIAL_TEAM: TeamMember[] = [
  { id: 'tm-1', name: 'Sardor Aliyev', avatar: 'SA', role: 'DevOps Lead', email: 'sardor@pulseflow.io', tasksCount: 4, completedCount: 12, status: 'online' },
  { id: 'tm-2', name: 'Malika Karimova', avatar: 'MK', role: 'Lead UI/UX', email: 'malika@pulseflow.io', tasksCount: 3, completedCount: 15, status: 'busy' },
  { id: 'tm-3', name: 'Javohir Toshmatov', avatar: 'JT', role: 'Backend Engineer', email: 'javohir@pulseflow.io', tasksCount: 5, completedCount: 9, status: 'online' },
  { id: 'tm-4', name: 'Diyorbek Rahimov', avatar: 'DR', role: 'QA Engineer', email: 'diyor@pulseflow.io', tasksCount: 2, completedCount: 18, status: 'offline' },
  { id: 'tm-5', name: 'Nilufar Yusupova', avatar: 'NY', role: 'Data Scientist', email: 'nilufar@pulseflow.io', tasksCount: 3, completedCount: 7, status: 'online' }
];

const COLUMNS: { id: TaskStatus; title: string; color: string }[] = [
  { id: 'backlog', title: 'Rejadagi (Backlog)', color: 'border-slate-500' },
  { id: 'todo', title: 'Bajarilishi kerak (To Do)', color: 'border-blue-500' },
  { id: 'in_progress', title: 'Jarayonda (In Progress)', color: 'border-amber-500' },
  { id: 'review', title: 'Tekshiruvda (Review)', color: 'border-purple-500' },
  { id: 'done', title: 'Tugallandi (Done)', color: 'border-emerald-500' }
];

export default function App() {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('pf_tasks');
    return saved ? JSON.parse(saved) : INITIAL_TASKS;
  });

  const [team] = useState<TeamMember[]>(INITIAL_TEAM);
  const [viewMode, setViewMode] = useState<ViewMode>('board');
  const [lang, setLang] = useState<'uz' | 'en' | 'ru'>('uz');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');
  const [selectedLabel, setSelectedLabel] = useState<string>('all');

  // Yangi vazifa modali
  const [isNewTaskOpen, setIsNewTaskOpen] = useState(false);
  const [newTaskForm, setNewTaskForm] = useState({
    title: '',
    description: '',
    status: 'todo' as TaskStatus,
    priority: 'medium' as TaskPriority,
    label: 'Frontend',
    assigneeName: 'Sardor Aliyev',
    dueDate: '2026-11-30',
    timeEstimateHours: 8
  });

  // Pomodoro Focus Timer
  const [timerMode, setTimerMode] = useState<'focus' | 'break'>('focus');
  const [timerSeconds, setTimerSeconds] = useState(25 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timeLogs, setTimeLogs] = useState<TimeLog[]>([]);

  // LocalStorage saqlash
  useEffect(() => {
    localStorage.setItem('pf_tasks', JSON.stringify(tasks));
  }, [tasks]);

  // Pomodoro timer interval
  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds(prev => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0) {
      confetti({ particleCount: 70, spread: 60 });
      setIsTimerRunning(false);
      const newLog: TimeLog = {
        id: `log-${Date.now()}`,
        taskTitle: timerMode === 'focus' ? 'Fokus Seansi (25 min)' : 'Dam olish (5 min)',
        durationMinutes: timerMode === 'focus' ? 25 : 5,
        date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: timerMode
      };
      setTimeLogs(prev => [newLog, ...prev]);
      setTimerMode(prev => (prev === 'focus' ? 'break' : 'focus'));
      setTimerSeconds(timerMode === 'focus' ? 5 * 60 : 25 * 60);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerSeconds, timerMode]);

  const isDark = theme === 'dark';

  // Filtrlangan vazifalar
  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      const matchSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          task.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchPriority = selectedPriority === 'all' || task.priority === selectedPriority;
      const matchLabel = selectedLabel === 'all' || task.label === selectedLabel;
      return matchSearch && matchPriority && matchLabel;
    });
  }, [tasks, searchQuery, selectedPriority, selectedLabel]);

  // Status o'zgartirish
  const handleMoveStatus = (taskId: string, newStatus: TaskStatus) => {
    setTasks(prev =>
      prev.map(task => {
        if (task.id === taskId) {
          if (newStatus === 'done' && task.status !== 'done') {
            confetti({
              particleCount: 50,
              spread: 60,
              origin: { y: 0.7 },
              colors: ['#6366f1', '#10b981', '#f59e0b']
            });
          }
          return { ...task, status: newStatus };
        }
        return task;
      })
    );
  };

  // Subtask checkbox
  const handleToggleSubtask = (taskId: string, subtaskId: string) => {
    setTasks(prev =>
      prev.map(task => {
        if (task.id === taskId) {
          return {
            ...task,
            subtasks: task.subtasks.map(st => st.id === subtaskId ? { ...st, done: !st.done } : st)
          };
        }
        return task;
      })
    );
  };

  // Vazifani o'chirish
  const handleDeleteTask = (taskId: string) => {
    setTasks(prev => prev.filter(t => t.id !== taskId));
  };

  // Yangi vazifa yaratish
  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskForm.title.trim()) return;

    const matchedAssignee = team.find(t => t.name === newTaskForm.assigneeName) || team[0];

    const newTask: Task = {
      id: `PF-${Math.floor(100 + Math.random() * 900)}`,
      title: newTaskForm.title,
      description: newTaskForm.description,
      status: newTaskForm.status,
      priority: newTaskForm.priority,
      label: newTaskForm.label,
      assignee: {
        name: matchedAssignee.name,
        avatar: matchedAssignee.avatar,
        role: matchedAssignee.role
      },
      dueDate: newTaskForm.dueDate,
      createdAt: new Date().toISOString().split('T')[0],
      subtasks: [
        { id: `st-${Date.now()}-1`, text: 'Boshlang\'ich qadam', done: false }
      ],
      timeEstimateHours: Number(newTaskForm.timeEstimateHours) || 6
    };

    setTasks([newTask, ...tasks]);
    setIsNewTaskOpen(false);
    setNewTaskForm({
      title: '',
      description: '',
      status: 'todo',
      priority: 'medium',
      label: 'Frontend',
      assigneeName: 'Sardor Aliyev',
      dueDate: '2026-11-30',
      timeEstimateHours: 8
    });

    confetti({ particleCount: 60, spread: 50, origin: { y: 0.6 } });
  };

  // Statistika
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'done').length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  const urgentCount = tasks.filter(t => t.priority === 'urgent' && t.status !== 'done').length;

  const priorityColor = (p: TaskPriority) => {
    switch (p) {
      case 'urgent': return 'bg-rose-500/15 text-rose-400 border-rose-500/30';
      case 'high': return 'bg-amber-500/15 text-amber-400 border-amber-500/30';
      case 'medium': return 'bg-indigo-500/15 text-indigo-400 border-indigo-500/30';
      case 'low': return 'bg-slate-500/15 text-slate-400 border-slate-500/30';
    }
  };

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDark ? 'bg-[#0b0f17] text-slate-100' : 'bg-slate-50 text-slate-900'}`}>

      {/* TOP HEADER */}
      <header className={`sticky top-0 z-30 backdrop-blur-md border-b px-4 lg:px-8 py-3.5 transition-colors ${
        isDark ? 'bg-[#0b0f17]/90 border-slate-800' : 'bg-white/90 border-slate-200'
      }`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">

          {/* Logo va Sprint belgisi */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30 font-extrabold text-lg">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-white via-indigo-200 to-purple-400 bg-clip-text text-transparent">
                  PulseFlow
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/15 text-indigo-400 border border-indigo-500/30 uppercase">
                  Sprint #42
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">Enterprise Agile & Task Workspace</p>
            </div>
          </div>

          {/* Tab tugmalari */}
          <nav className="hidden md:flex items-center gap-1 p-1 bg-slate-900/60 rounded-2xl border border-slate-800 text-xs font-bold">
            <button
              onClick={() => setViewMode('board')}
              className={`px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
                viewMode === 'board' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Kanban</span>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
                viewMode === 'list' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              <ListTodo className="w-3.5 h-3.5" />
              <span>Ro'yxat ({totalTasks})</span>
            </button>
            <button
              onClick={() => setViewMode('analytics')}
              className={`px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
                viewMode === 'analytics' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Analitika</span>
            </button>
            <button
              onClick={() => setViewMode('timer')}
              className={`px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
                viewMode === 'timer' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Timer className="w-3.5 h-3.5" />
              <span>Pomodoro</span>
            </button>
            <button
              onClick={() => setViewMode('team')}
              className={`px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
                viewMode === 'team' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Users2 className="w-3.5 h-3.5" />
              <span>Jamoa</span>
            </button>
          </nav>

          {/* O'ng tomon actionlari */}
          <div className="flex items-center gap-2.5">
            {/* Yangi vazifa qo'shish */}
            <button
              onClick={() => setIsNewTaskOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white text-xs font-bold shadow-lg shadow-indigo-500/25 transition-transform hover:scale-105 active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Vazifa Qo'shish</span>
            </button>

            {/* Tema almashtirish */}
            <button
              onClick={() => setTheme(isDark ? 'light' : 'dark')}
              className={`p-2 rounded-xl border transition-all ${
                isDark ? 'bg-slate-900 border-slate-800 text-amber-400' : 'bg-slate-100 border-slate-200 text-slate-700'
              }`}
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Mobil Nav */}
        <div className="flex md:hidden items-center justify-between gap-1 pt-3 border-t border-slate-800/60 mt-2 text-xs font-bold">
          <button onClick={() => setViewMode('board')} className={`flex-1 py-1.5 rounded-lg ${viewMode === 'board' ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}>Kanban</button>
          <button onClick={() => setViewMode('list')} className={`flex-1 py-1.5 rounded-lg ${viewMode === 'list' ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}>Ro'yxat</button>
          <button onClick={() => setViewMode('analytics')} className={`flex-1 py-1.5 rounded-lg ${viewMode === 'analytics' ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}>Analitika</button>
          <button onClick={() => setViewMode('timer')} className={`flex-1 py-1.5 rounded-lg ${viewMode === 'timer' ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}>Fokus</button>
          <button onClick={() => setViewMode('team')} className={`flex-1 py-1.5 rounded-lg ${viewMode === 'team' ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}>Jamoa</button>
        </div>
      </header>

      {/* STATISTIKA METRIKALARI */}
      <section className="px-4 lg:px-8 py-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="glass-panel rounded-2xl p-4 border flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/15 text-indigo-400 flex items-center justify-center font-bold">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xl font-extrabold">{completionRate}%</p>
              <p className="text-xs text-slate-400">Sprint Tugallanishi</p>
            </div>
          </div>

          <div className="glass-panel rounded-2xl p-4 border flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center font-bold">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xl font-extrabold">{completedTasks} / {totalTasks}</p>
              <p className="text-xs text-slate-400">Tugallangan Vazifalar</p>
            </div>
          </div>

          <div className="glass-panel rounded-2xl p-4 border flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500/15 text-rose-400 flex items-center justify-center font-bold">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xl font-extrabold">{urgentCount}</p>
              <p className="text-xs text-slate-400">Kechiktirib Bo'lmas (Urgent)</p>
            </div>
          </div>

          <div className="glass-panel rounded-2xl p-4 border flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/15 text-purple-400 flex items-center justify-center font-bold">
              <Users2 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xl font-extrabold">{team.length} ta faol</p>
              <p className="text-xs text-slate-400">Muhandislar Jamoasi</p>
            </div>
          </div>
        </div>
      </section>

      {/* FILTER VA QIDIRUV SATRI */}
      <section className="px-4 lg:px-8 max-w-7xl mx-auto mb-6">
        <div className="glass-panel rounded-2xl p-3 border flex flex-wrap items-center justify-between gap-3">
          <div className="flex-1 min-w-[220px] relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Vazifa nomi yoki tavsifini qidirish..."
              className="w-full py-2 pl-9 pr-3 text-xs rounded-xl bg-slate-900 border border-slate-700 text-white outline-none focus:border-indigo-500"
            />
          </div>

          <div className="flex items-center gap-2 text-xs">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="py-1.5 px-3 rounded-xl bg-slate-900 border border-slate-700 text-white outline-none cursor-pointer"
            >
              <option value="all">Barcha Ustuvorliklar</option>
              <option value="urgent">Urgent (Shoshilinch)</option>
              <option value="high">High (Yuqori)</option>
              <option value="medium">Medium (O'rta)</option>
              <option value="low">Low (Past)</option>
            </select>

            <select
              value={selectedLabel}
              onChange={(e) => setSelectedLabel(e.target.value)}
              className="py-1.5 px-3 rounded-xl bg-slate-900 border border-slate-700 text-white outline-none cursor-pointer"
            >
              <option value="all">Barcha Teglar</option>
              <option value="DevOps">DevOps</option>
              <option value="Design">Design</option>
              <option value="Database">Database</option>
              <option value="QA & Testing">QA & Testing</option>
              <option value="AI & Data">AI & Data</option>
              <option value="Frontend">Frontend</option>
            </select>
          </div>
        </div>
      </section>

      {/* 1-KO'RINISh: KANBAN BOARD */}
      {viewMode === 'board' && (
        <main className="px-4 lg:px-8 max-w-7xl mx-auto mb-20">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 items-start">
            {COLUMNS.map(col => {
              const columnTasks = filteredTasks.filter(t => t.status === col.id);

              return (
                <div key={col.id} className="glass-panel rounded-2xl p-3 border flex flex-col min-h-[500px]">
                  {/* Ustun sarlavhasi */}
                  <div className={`flex items-center justify-between pb-3 mb-3 border-b-2 ${col.color}`}>
                    <h3 className="font-extrabold text-xs tracking-wide text-slate-200">
                      {col.title}
                    </h3>
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                      {columnTasks.length}
                    </span>
                  </div>

                  {/* Ustun ichidagi vazifalar */}
                  <div className="space-y-3 flex-1">
                    {columnTasks.length === 0 ? (
                      <div className="py-12 text-center text-slate-500 text-xs">
                        Hozircha vazifa yo'q
                      </div>
                    ) : (
                      columnTasks.map(task => {
                        const doneSubtasks = task.subtasks.filter(st => st.done).length;

                        return (
                          <div
                            key={task.id}
                            className="kanban-card rounded-2xl p-4 flex flex-col justify-between group"
                          >
                            <div>
                              {/* Teg va Ustuvorlik */}
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-800 text-indigo-400 border border-slate-700">
                                  {task.label}
                                </span>
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${priorityColor(task.priority)} uppercase`}>
                                  {task.priority}
                                </span>
                              </div>

                              <h4 className="font-bold text-sm text-white mb-1.5 group-hover:text-indigo-400 transition-colors">
                                {task.title}
                              </h4>

                              <p className="text-xs text-slate-400 line-clamp-2 mb-3 leading-relaxed">
                                {task.description}
                              </p>

                              {/* Subtasklar progress */}
                              {task.subtasks.length > 0 && (
                                <div className="space-y-1.5 mb-3 bg-slate-900/60 p-2 rounded-xl border border-slate-800">
                                  <div className="flex justify-between text-[10px] text-slate-400">
                                    <span>Qadamlar:</span>
                                    <span>{doneSubtasks} / {task.subtasks.length}</span>
                                  </div>
                                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                                    <div
                                      className="bg-indigo-500 h-full rounded-full transition-all"
                                      style={{ width: `${(doneSubtasks / task.subtasks.length) * 100}%` }}
                                    />
                                  </div>

                                  <div className="pt-1 space-y-1">
                                    {task.subtasks.map(st => (
                                      <div
                                        key={st.id}
                                        onClick={() => handleToggleSubtask(task.id, st.id)}
                                        className="flex items-center gap-1.5 text-[11px] text-slate-300 cursor-pointer hover:text-white"
                                      >
                                        {st.done ? (
                                          <CheckSquare className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                                        ) : (
                                          <Square className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                                        )}
                                        <span className={st.done ? 'line-through text-slate-500' : ''}>{st.text}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* Footer: Assignee, Muddat va Statusni siljitish */}
                            <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-xs">
                              <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-[10px] font-bold text-white shadow">
                                  {task.assignee.avatar}
                                </div>
                                <span className="text-[11px] text-slate-400 truncate max-w-[80px]">
                                  {task.assignee.name.split(' ')[0]}
                                </span>
                              </div>

                              <div className="flex items-center gap-1">
                                {/* Keyingi statusga o'tkazish selector */}
                                <select
                                  value={task.status}
                                  onChange={(e) => handleMoveStatus(task.id, e.target.value as TaskStatus)}
                                  className="text-[10px] bg-slate-900 border border-slate-700 rounded-lg px-1.5 py-0.5 text-slate-300 outline-none cursor-pointer"
                                >
                                  <option value="backlog">Backlog</option>
                                  <option value="todo">To Do</option>
                                  <option value="in_progress">In Prog</option>
                                  <option value="review">Review</option>
                                  <option value="done">Done</option>
                                </select>

                                <button
                                  onClick={() => handleDeleteTask(task.id)}
                                  className="p-1 text-slate-500 hover:text-rose-400 transition-colors"
                                  title="O'chirish"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </main>
      )}

      {/* 2-KO'RINISh: RO'YXAT (LIST / TABLE VIEW) */}
      {viewMode === 'list' && (
        <main className="px-4 lg:px-8 max-w-7xl mx-auto mb-20">
          <div className="glass-panel rounded-2xl border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-slate-900/80 border-b border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="py-3 px-4">ID & Nomi</th>
                    <th className="py-3 px-4">Holat</th>
                    <th className="py-3 px-4">Ustuvorlik</th>
                    <th className="py-3 px-4">Teg</th>
                    <th className="py-3 px-4">Mas'ul Shaxs</th>
                    <th className="py-3 px-4">Muddat</th>
                    <th className="py-3 px-4 text-right">Amal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50">
                  {filteredTasks.map(task => (
                    <tr key={task.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-white">
                        <span className="text-indigo-400 font-mono text-xs mr-2">{task.id}</span>
                        <span>{task.title}</span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                          task.status === 'done' ? 'bg-emerald-500/20 text-emerald-400' :
                          task.status === 'in_progress' ? 'bg-amber-500/20 text-amber-400' :
                          task.status === 'review' ? 'bg-purple-500/20 text-purple-400' :
                          'bg-slate-800 text-slate-300'
                        }`}>
                          {task.status.replace('_', ' ').toUpperCase()}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold border ${priorityColor(task.priority)} uppercase`}>
                          {task.priority}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-400 font-semibold">{task.label}</td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px] font-bold">
                            {task.assignee.avatar}
                          </div>
                          <span className="text-slate-300">{task.assignee.name}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-400 font-mono">{task.dueDate}</td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => handleDeleteTask(task.id)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      )}

      {/* 3-KO'RINISh: ANALITIKA (ANALYTICS & SPRINT CHARTS) */}
      {viewMode === 'analytics' && (
        <main className="px-4 lg:px-8 max-w-7xl mx-auto mb-20 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Statuslar bo'yicha progress */}
            <div className="glass-panel rounded-3xl p-6 border space-y-4">
              <h3 className="font-extrabold text-base flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-indigo-400" />
                <span>Vazifalar Bosqichlari Taqsimoti</span>
              </h3>

              {COLUMNS.map(col => {
                const count = tasks.filter(t => t.status === col.id).length;
                const pct = totalTasks > 0 ? Math.round((count / totalTasks) * 100) : 0;

                return (
                  <div key={col.id} className="space-y-1.5 text-xs">
                    <div className="flex justify-between font-bold">
                      <span className="text-slate-300">{col.title}</span>
                      <span className="text-indigo-400">{count} ta ({pct}%)</span>
                    </div>
                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div className="bg-indigo-500 h-full rounded-full transition-all" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Jamoa unumdorligi */}
            <div className="glass-panel rounded-3xl p-6 border space-y-4">
              <h3 className="font-extrabold text-base flex items-center gap-2">
                <Users2 className="w-5 h-5 text-purple-400" />
                <span>Jamoa Unumdorligi (Top Performers)</span>
              </h3>

              <div className="space-y-3">
                {team.map(member => (
                  <div key={member.id} className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center font-bold text-white text-xs">
                        {member.avatar}
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-white">{member.name}</h4>
                        <p className="text-slate-400 text-[11px]">{member.role}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-extrabold text-emerald-400">{member.completedCount} ta tugatilgan</span>
                      <p className="text-slate-500 text-[10px]">{member.tasksCount} ta jarayonda</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      )}

      {/* 4-KO'RINISh: POMODORO FOKUS TAYMERI */}
      {viewMode === 'timer' && (
        <main className="px-4 lg:px-8 max-w-xl mx-auto mb-20">
          <div className="glass-panel rounded-3xl p-8 border text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/15 text-indigo-400 text-xs font-bold border border-indigo-500/30">
              <Timer className="w-4 h-4" />
              <span>{timerMode === 'focus' ? 'Fokus Ish Seansi (25 min)' : 'Dam Olish Tanaffusi (5 min)'}</span>
            </div>

            {/* Raqamli soat */}
            <div className="text-7xl sm:text-8xl font-extrabold font-mono text-white tracking-wider my-4">
              {formatTimer(timerSeconds)}
            </div>

            {/* Tugmalar */}
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={() => setIsTimerRunning(!isTimerRunning)}
                className="px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-extrabold text-base shadow-lg shadow-indigo-500/30 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
              >
                {isTimerRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                <span>{isTimerRunning ? 'Pauza' : 'Boshlash'}</span>
              </button>

              <button
                onClick={() => {
                  setIsTimerRunning(false);
                  setTimerSeconds(timerMode === 'focus' ? 25 * 60 : 5 * 60);
                }}
                className="p-4 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                title="Qayta o'rnatish"
              >
                <RotateCcw className="w-5 h-5" />
              </button>
            </div>

            {/* Tarix jurnallari */}
            {timeLogs.length > 0 && (
              <div className="border-t border-slate-800 pt-5 text-left space-y-2">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Bugungi Fokus Tarixi</h4>
                <div className="space-y-1.5 max-h-40 overflow-y-auto">
                  {timeLogs.map(log => (
                    <div key={log.id} className="p-2 rounded-xl bg-slate-900 border border-slate-800 flex justify-between text-xs">
                      <span className="font-semibold text-slate-300">{log.taskTitle}</span>
                      <span className="font-mono text-indigo-400">{log.date}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </main>
      )}

      {/* 5-KO'RINISh: JAMOA DIREKTORIYASI */}
      {viewMode === 'team' && (
        <main className="px-4 lg:px-8 max-w-5xl mx-auto mb-20">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {team.map(member => (
              <div key={member.id} className="glass-panel rounded-3xl p-6 border space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center font-extrabold text-white text-base shadow">
                    {member.avatar}
                  </div>
                  <div>
                    <h4 className="font-extrabold text-base text-white">{member.name}</h4>
                    <p className="text-xs text-indigo-400 font-semibold">{member.role}</p>
                  </div>
                </div>

                <div className="space-y-2 text-xs border-t border-slate-800 pt-3">
                  <div className="flex justify-between text-slate-400">
                    <span>Email:</span>
                    <span className="text-slate-200">{member.email}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Status:</span>
                    <span className={`font-bold capitalize ${
                      member.status === 'online' ? 'text-emerald-400' :
                      member.status === 'busy' ? 'text-amber-400' : 'text-slate-500'
                    }`}>
                      ● {member.status}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Yakunlangan ishlar:</span>
                    <span className="text-emerald-400 font-bold">{member.completedCount} ta</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      )}

      {/* YANGI VAZIFA QO'ShISh MODALI */}
      {isNewTaskOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel rounded-3xl max-w-lg w-full p-6 sm:p-8 relative shadow-2xl border border-slate-700">
            <button
              onClick={() => setIsNewTaskOpen(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full bg-slate-800"
            >
              ✕
            </button>

            <h3 className="text-xl font-extrabold mb-1">Yangi Vazifa Yaratish</h3>
            <p className="text-xs text-slate-400 mb-5">Sprint doskasiga yangi vazifani qo'shing.</p>

            <form onSubmit={handleCreateTask} className="space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block mb-1 font-semibold text-slate-300">Vazifa nomi</label>
                <input
                  type="text"
                  required
                  placeholder="Masalan: Redis kesh qatlamini ulash"
                  value={newTaskForm.title}
                  onChange={(e) => setNewTaskForm({ ...newTaskForm, title: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block mb-1 font-semibold text-slate-300">Batafsil tavsif</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Vazifa maqsadi va texnik talablari..."
                  value={newTaskForm.description}
                  onChange={(e) => setNewTaskForm({ ...newTaskForm, description: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white outline-none focus:border-indigo-500 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1 font-semibold text-slate-300">Ustuvorlik (Priority)</label>
                  <select
                    value={newTaskForm.priority}
                    onChange={(e) => setNewTaskForm({ ...newTaskForm, priority: e.target.value as TaskPriority })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white outline-none focus:border-indigo-500 cursor-pointer"
                  >
                    <option value="urgent">Urgent (Shoshilinch)</option>
                    <option value="high">High (Yuqori)</option>
                    <option value="medium">Medium (O'rta)</option>
                    <option value="low">Low (Past)</option>
                  </select>
                </div>

                <div>
                  <label className="block mb-1 font-semibold text-slate-300">Boshlang'ich Holat</label>
                  <select
                    value={newTaskForm.status}
                    onChange={(e) => setNewTaskForm({ ...newTaskForm, status: e.target.value as TaskStatus })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white outline-none focus:border-indigo-500 cursor-pointer"
                  >
                    <option value="todo">To Do</option>
                    <option value="backlog">Backlog</option>
                    <option value="in_progress">In Progress</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1 font-semibold text-slate-300">Teg (Label)</label>
                  <input
                    type="text"
                    required
                    placeholder="Masalan: Frontend, API"
                    value={newTaskForm.label}
                    onChange={(e) => setNewTaskForm({ ...newTaskForm, label: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block mb-1 font-semibold text-slate-300">Mas'ul Shaxs</label>
                  <select
                    value={newTaskForm.assigneeName}
                    onChange={(e) => setNewTaskForm({ ...newTaskForm, assigneeName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white outline-none focus:border-indigo-500 cursor-pointer"
                  >
                    {team.map(m => (
                      <option key={m.id} value={m.name}>{m.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1 font-semibold text-slate-300">Tugash muddati</label>
                  <input
                    type="date"
                    required
                    value={newTaskForm.dueDate}
                    onChange={(e) => setNewTaskForm({ ...newTaskForm, dueDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block mb-1 font-semibold text-slate-300">Taxminiy soat</label>
                  <input
                    type="number"
                    min={1}
                    value={newTaskForm.timeEstimateHours}
                    onChange={(e) => setNewTaskForm({ ...newTaskForm, timeEstimateHours: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 text-white font-extrabold rounded-xl text-sm shadow-lg shadow-indigo-500/30 hover:scale-[1.01] active:scale-[0.99] transition-transform"
              >
                Vazifani Doskaga Qo'shish
              </button>
            </form>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer className="border-t border-slate-800/80 bg-[#080b11] text-slate-500 py-10 px-4 lg:px-8 text-xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-400" />
            <span className="font-extrabold text-slate-300 tracking-wider">PULSEFLOW WORKSPACE</span>
            <span>• TypeScript SaaS Edition © 2026</span>
          </div>
          <div className="flex items-center gap-6 text-slate-400">
            <span>Sprint Rejalashtirish</span>
            <span>Kanban Doska</span>
            <span>Pomodoro Taymer</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
