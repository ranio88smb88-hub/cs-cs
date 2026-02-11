
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  ModuleType, DailyTask, DailyReport, WorkLogin, 
  AccountFollowUp, FundLog, GalleryItem 
} from './types';
import { sheetService } from './services/sheetService';
// @ts-ignore
import LiquidBackground from 'https://cdn.jsdelivr.net/npm/threejs-components@0.0.27/build/backgrounds/liquid1.min.js';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('cspro_auth') === 'true';
  });
  
  const [activeModule, setActiveModule] = useState<ModuleType>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [tasks, setTasks] = useState<DailyTask[]>([]);
  const [reports, setReports] = useState<DailyReport[]>([]);
  const [logins, setLogins] = useState<WorkLogin[]>([]);
  const [rekening, setRekening] = useState<AccountFollowUp[]>([]);
  const [funds, setFunds] = useState<FundLog[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  const liquidAppRef = useRef<any>(null);

  useEffect(() => {
    if (!isAuthenticated) return;

    const canvas = document.getElementById('canvas');
    if (canvas && LiquidBackground && !liquidAppRef.current) {
      try {
        const app = LiquidBackground(canvas);
        app.loadImage('https://assets.codepen.io/33787/liquid.webp');
        app.liquidPlane.material.metalness = 0.75;
        app.liquidPlane.material.roughness = 0.25;
        app.liquidPlane.uniforms.displacementScale.value = 5;
        app.setRain(false);
        liquidAppRef.current = app;
      } catch (err) {
        console.error("Liquid background init failed:", err);
      }
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated) return;
    setTasks(sheetService.getData('tugas', []));
    setReports(sheetService.getData('report_harian', []));
    setLogins(sheetService.getData('data_login', []));
    setRekening(sheetService.getData('rekening_followup', []));
    setFunds(sheetService.getData('dana_mutasi', []));
    setGallery(sheetService.getData('gallery_evidence', []));
  }, [isAuthenticated]);

  useEffect(() => { if(isAuthenticated) sheetService.saveData('tugas', tasks); }, [tasks, isAuthenticated]);
  useEffect(() => { if(isAuthenticated) sheetService.saveData('report_harian', reports); }, [reports, isAuthenticated]);
  useEffect(() => { if(isAuthenticated) sheetService.saveData('data_login', logins); }, [logins, isAuthenticated]);
  useEffect(() => { if(isAuthenticated) sheetService.saveData('rekening_followup', rekening); }, [rekening, isAuthenticated]);
  useEffect(() => { if(isAuthenticated) sheetService.saveData('dana_mutasi', funds); }, [funds, isAuthenticated]);
  useEffect(() => { if(isAuthenticated) sheetService.saveData('gallery_evidence', gallery); }, [gallery, isAuthenticated]);

  const handleLogout = () => {
    localStorage.removeItem('cspro_auth');
    window.location.reload();
  };

  // Filtered data based on search
  const filteredTasks = useMemo(() => tasks.filter(t => t.title.toLowerCase().includes(searchQuery.toLowerCase())), [tasks, searchQuery]);
  const filteredReports = useMemo(() => reports.filter(r => r.content.toLowerCase().includes(searchQuery.toLowerCase())), [reports, searchQuery]);
  const filteredLogins = useMemo(() => logins.filter(l => l.platform.toLowerCase().includes(searchQuery.toLowerCase()) || l.username.toLowerCase().includes(searchQuery.toLowerCase())), [logins, searchQuery]);
  const filteredRekening = useMemo(() => rekening.filter(r => r.accountName.toLowerCase().includes(searchQuery.toLowerCase()) || r.accountNumber.includes(searchQuery)), [rekening, searchQuery]);

  if (!isAuthenticated) {
    return <LoginView onLogin={() => {
      localStorage.setItem('cspro_auth', 'true');
      setIsAuthenticated(true);
    }} />;
  }

  const NavItem = ({ id, icon, label }: { id: ModuleType, icon: string, label: string }) => (
    <button 
      onClick={() => { setActiveModule(id); setSearchQuery(''); }}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
        activeModule === id 
          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/40 shadow-[0_0_20px_rgba(212,175,55,0.2)]' 
          : 'text-slate-500 hover:bg-white/5 hover:text-white'
      }`}
    >
      <span className={`text-xl ${activeModule === id ? 'scale-110' : ''}`}>{icon}</span>
      {isSidebarOpen && <span className="font-bold text-xs tracking-widest uppercase">{label}</span>}
    </button>
  );

  return (
    <div className="relative flex min-h-screen bg-transparent selection:bg-amber-500 selection:text-black">
      <aside className={`${isSidebarOpen ? 'w-72' : 'w-24'} glass-panel border-r border-amber-900/20 transition-all duration-500 flex flex-col p-5 z-50 rounded-r-3xl my-4 ml-4`}>
        <div className="flex items-center gap-4 mb-12 px-2">
          <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-amber-700 rounded-2xl flex items-center justify-center text-black font-black text-xl shadow-[0_0_25px_rgba(212,175,55,0.4)] rotate-3">CP</div>
          {isSidebarOpen && (
            <div className="animate-in fade-in slide-in-from-left-2">
              <h1 className="text-white font-black text-2xl tracking-tighter uppercase leading-none">PRO<span className="text-amber-500">HUB</span></h1>
              <p className="text-[8px] text-amber-500/50 font-black tracking-[0.3em]">SECURE ACCESS</p>
            </div>
          )}
        </div>
        
        <nav className="flex-1 space-y-3 overflow-y-auto no-scrollbar">
          <NavItem id="dashboard" icon="🏛️" label="Overview" />
          <NavItem id="tugas" icon="📝" label="Daily Tasks" />
          <NavItem id="report" icon="📊" label="Daily Reports" />
          <NavItem id="login" icon="🔑" label="Logins" />
          <NavItem id="rekening" icon="💳" label="Account F/U" />
          <NavItem id="dana" icon="💰" label="Fund Flow" />
          <NavItem id="gallery" icon="🖼️" label="Evidence" />
          <NavItem id="validation" icon="🛡️" label="Validation" />
        </nav>

        <div className="mt-auto space-y-2">
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="w-full p-4 text-amber-500/40 hover:text-amber-400 border border-amber-500/10 rounded-2xl bg-black/40 hover:bg-black/60 transition-all text-[10px] font-black tracking-widest uppercase"
          >
            {isSidebarOpen ? 'Minimize' : '→'}
          </button>
          <button 
            onClick={handleLogout}
            className="w-full p-4 text-rose-500/40 hover:text-rose-500 border border-rose-500/10 rounded-2xl bg-black/40 hover:bg-black/60 transition-all text-[10px] font-black tracking-widest uppercase"
          >
            {isSidebarOpen ? 'Logout' : '⏻'}
          </button>
        </div>
      </aside>

      <main className="relative flex-1 p-8 overflow-y-auto z-10">
        <header className="flex flex-col lg:flex-row justify-between lg:items-center mb-10 glass-panel p-8 rounded-[2.5rem] border-amber-500/10 gap-6">
          <div>
            <h2 className="text-4xl font-black text-white uppercase tracking-tighter mb-1">
              {activeModule.replace('-', ' ')}
            </h2>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>
              <p className="text-amber-500/60 font-black text-[9px] tracking-[0.4em] uppercase">CS-OPERATIONAL HUB • V2.5.0</p>
            </div>
          </div>
          
          <div className="flex-1 max-w-xl mx-0 lg:mx-8">
            <div className="relative group">
              <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
                <span className="text-amber-500/50">🔍</span>
              </div>
              <input 
                type="text" 
                placeholder={`SEARCH IN ${activeModule.toUpperCase()}...`} 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-black/40 border border-amber-500/10 rounded-2xl py-4 pl-14 pr-6 text-white text-xs font-black tracking-widest uppercase focus:border-amber-500/50 outline-none transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-black text-white tracking-tight uppercase">CUEK MANJA-01</p>
              <p className="text-[9px] text-emerald-500 font-bold uppercase tracking-widest">Encrypted Session</p>
            </div>
            <div className="relative group">
              <div className="absolute -inset-1 bg-amber-500 rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative w-14 h-14 bg-black border-2 border-amber-500/50 rounded-full overflow-hidden shadow-[0_0_20px_rgba(212,175,55,0.3)]">
                <img src={`https://api.dicebear.com/7.x/bottts/svg?seed=Hub&backgroundColor=000000`} alt="avatar" />
              </div>
            </div>
          </div>
        </header>

        <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000 pb-20">
          {activeModule === 'dashboard' && <DashboardView tasks={tasks} rekening={rekening} reports={reports} />}
          {activeModule === 'tugas' && <TugasView tasks={filteredTasks} setTasks={setTasks} />}
          {activeModule === 'report' && <ReportView reports={filteredReports} setReports={setReports} />}
          {activeModule === 'login' && <CredentialView logins={filteredLogins} setLogins={setLogins} />}
          {activeModule === 'rekening' && <RekeningView data={filteredRekening} setData={setRekening} />}
          {activeModule === 'dana' && <DanaView data={funds} setData={setFunds} />}
          {activeModule === 'gallery' && <GalleryView data={gallery} setData={setGallery} />}
          {activeModule === 'validation' && <ValidationView />}
        </div>
      </main>
    </div>
  );
};

// Validated Login Implementation
const LoginView = ({ onLogin }: { onLogin: () => void }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === 'akunsaya@gmail.com' && password === 'akunsaya') {
      onLogin();
    } else {
      setError('Invalid Identity Credentials');
      setTimeout(() => setError(''), 3000);
    }
  };

  return (
    <div className="login-page-container">
      <div className="neumorph-container">
        <div className="brand-logo"></div>
        <div className="brand-title">CS UBI</div>
        <form onSubmit={handleSubmit} className="login-inputs">
          <label>MASUKAN ID LU</label>
          <input 
            type="email" 
            placeholder="akunsaya@gmail.com" 
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <label>APA PASSWORD LU</label>
          <input 
            type="password" 
            placeholder="••••••••" 
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <p className="text-[10px] text-rose-500 font-bold text-center mt-2 animate-pulse uppercase tracking-widest">{error}</p>}
          <button type="submit">KLIK MASOK</button>
        </form>
        <div className="made-by">SYSTEM KEAMANAN JIWA RAGA</div>
      </div>
    </div>
  );
};

// --- NEW VALIDATION VIEW ---
const ValidationView = () => {
  const [fullName, setFullName] = useState('');
  const [maskedName, setMaskedName] = useState('');

  const validationResult = useMemo(() => {
    if (!fullName || !maskedName) return null;
    
    if (fullName.length !== maskedName.length) {
      return { valid: false, reason: 'Jumlah huruf nama tidak sama' };
    }

    for (let i = 0; i < maskedName.length; i++) {
      const mChar = maskedName[i].toLowerCase();
      const fChar = fullName[i].toLowerCase();
      
      // Jika karakter di masked bukan 'x', maka harus sama dengan karakter di full name
      if (mChar !== 'x' && mChar !== fChar) {
        return { valid: false, reason: 'Posisi nama yang terlihat tidak sama' };
      }
    }

    return { valid: true, reason: 'Valid (Karakter & Panjang Sesuai)' };
  }, [fullName, maskedName]);

  return (
    <div className="max-w-4xl mx-auto space-y-10">
      <div className="glass-panel p-10 rounded-[3rem] shadow-2xl">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-amber-500 rounded-2xl flex items-center justify-center text-black text-2xl shadow-lg shadow-amber-500/20">🛡️</div>
          <h3 className="text-3xl font-black text-white uppercase tracking-tighter">Identity Validation Tool</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
          <div className="space-y-4">
            <label className="text-[10px] font-black text-amber-500 uppercase tracking-widest ml-2">Full Input Name</label>
            <input 
              type="text" 
              placeholder="e.g. Harianto" 
              className="w-full p-6 rounded-2xl bg-black/40 border border-white/5 text-white font-bold text-xl uppercase tracking-tighter focus:border-amber-500/50 outline-none"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>
          <div className="space-y-4">
            <label className="text-[10px] font-black text-amber-500 uppercase tracking-widest ml-2">Validated Mask (Use 'x' for hidden)</label>
            <input 
              type="text" 
              placeholder="e.g. Haxxxxxx" 
              className="w-full p-6 rounded-2xl bg-black/40 border border-white/5 text-white font-bold text-xl uppercase tracking-tighter focus:border-amber-500/50 outline-none"
              value={maskedName}
              onChange={(e) => setMaskedName(e.target.value)}
            />
          </div>
        </div>

        {validationResult && (
          <div className={`p-10 rounded-[2.5rem] border animate-in zoom-in-95 duration-500 ${validationResult.valid ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-rose-500/10 border-rose-500/30'}`}>
            <div className="flex flex-col items-center text-center gap-4">
              <div className={`text-6xl font-black uppercase tracking-tighter ${validationResult.valid ? 'text-emerald-500' : 'text-rose-500'}`}>
                {validationResult.valid ? 'AUTHORIZED' : 'REJECTED'}
              </div>
              <p className={`text-sm font-black uppercase tracking-[0.2em] ${validationResult.valid ? 'text-emerald-500/60' : 'text-rose-500/60'}`}>
                {validationResult.reason}
              </p>
              
              <div className="mt-6 flex items-center gap-6 font-mono text-2xl font-bold bg-black/20 p-6 rounded-2xl border border-white/5">
                <div className="flex flex-col items-center">
                   <span className="text-[10px] uppercase text-white/20 mb-2">Input</span>
                   <span className="text-white">{fullName.toUpperCase() || '---'}</span>
                </div>
                <span className="text-white/20">VS</span>
                <div className="flex flex-col items-center">
                   <span className="text-[10px] uppercase text-white/20 mb-2">Mask</span>
                   <span className="text-amber-500">{maskedName.toUpperCase() || '---'}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {!validationResult && (
          <div className="p-20 text-center border-2 border-dashed border-white/5 rounded-[3rem]">
            <p className="text-white/20 font-black uppercase tracking-[0.4em] italic text-sm">Waiting for input signals...</p>
          </div>
        )}
      </div>

      <div className="glass-panel p-8 rounded-[2rem] border-amber-500/10">
        <h4 className="text-[10px] font-black text-amber-500 uppercase tracking-widest mb-4">Protocol Requirements</h4>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[11px] text-white/40 font-bold uppercase tracking-tight">
          <li className="flex items-center gap-3 bg-white/5 p-4 rounded-xl border border-white/5">
            <span className="text-amber-500">01</span> Karakter sensor disimbolkan dengan huruf 'x'
          </li>
          <li className="flex items-center gap-3 bg-white/5 p-4 rounded-xl border border-white/5">
            <span className="text-amber-500">02</span> Jumlah total karakter harus identik (Length Match)
          </li>
          <li className="flex items-center gap-3 bg-white/5 p-4 rounded-xl border border-white/5">
            <span className="text-amber-500">03</span> Karakter non-'x' harus presisi di posisi yang sama
          </li>
          <li className="flex items-center gap-3 bg-white/5 p-4 rounded-xl border border-white/5">
            <span className="text-amber-500">04</span> Case-insensitive (Huruf besar/kecil tidak berpengaruh)
          </li>
        </ul>
      </div>
    </div>
  );
};

const DashboardView = ({ tasks, rekening, reports }: any) => (
  <div className="space-y-10">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
      {[
        { label: 'Completion Rate', val: tasks.length ? `${Math.round((tasks.filter((t:any) => t.completed).length / tasks.length) * 100)}%` : '0%', col: 'text-amber-400' },
        { label: 'Active Account Issues', val: rekening.length, col: 'text-rose-500' },
        { label: 'Archived Logs', val: reports.length, col: 'text-sky-400' },
      ].map((card, i) => (
        <div key={i} className="glass-panel p-10 rounded-[2.5rem] border-amber-500/10 hover:border-amber-500/40 transition-all group flex flex-col justify-between">
          <div>
            <p className="text-amber-500/40 text-[9px] font-black uppercase tracking-[0.4em] mb-4">{card.label}</p>
            <p className={`text-6xl font-black ${card.col} group-hover:scale-110 transition-transform origin-left tracking-tighter`}>{card.val}</p>
          </div>
          <div className="mt-8 pt-4 border-t border-white/5 flex items-center justify-between">
            <span className="text-[10px] text-white/20 font-bold uppercase">Real-time Stats</span>
            <div className="flex gap-1">
              {[1,2,3].map(j => <div key={j} className="w-1 h-1 bg-amber-500/20 rounded-full"></div>)}
            </div>
          </div>
        </div>
      ))}
    </div>
    
    <div className="glass-panel p-10 rounded-[3rem] border-amber-500/20 shadow-2xl">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Operational Timeline</h3>
        <button className="text-[10px] text-amber-500 font-black uppercase tracking-widest hover:underline">View History</button>
      </div>
      <div className="space-y-6">
        {reports.slice(0, 4).map((r:any) => (
          <div key={r.id} className="p-6 border border-white/5 bg-white/5 rounded-[1.5rem] flex flex-col sm:flex-row justify-between sm:items-center gap-4 hover:bg-white/10 transition-colors group">
            <div className="flex-1">
              <p className="text-sm text-white/80 font-medium leading-relaxed italic">"{r.content.substring(0, 100)}{r.content.length > 100 ? '...' : ''}"</p>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-[10px] font-mono text-amber-500 bg-amber-500/10 px-3 py-1 rounded-full">{r.timestamp}</span>
              <div className="w-2 h-2 rounded-full bg-amber-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>
          </div>
        ))}
        {reports.length === 0 && <p className="text-white/10 italic text-sm text-center py-10">Waiting for first daily report entry...</p>}
      </div>
    </div>
  </div>
);

const TugasView = ({ tasks, setTasks }: any) => {
  const [input, setInput] = useState('');
  const add = () => { if(input) { setTasks([...tasks, { id: Date.now().toString(), title: input, completed: false, category: 'GENERAL' }]); setInput(''); } };
  const toggle = (id: string) => setTasks(tasks.map((t:any) => t.id === id ? { ...t, completed: !t.completed } : t));
  const remove = (id: string) => setTasks(tasks.filter((t:any) => t.id !== id));

  return (
    <div className="glass-panel rounded-[3rem] overflow-hidden shadow-2xl">
      <div className="p-10 flex flex-col md:flex-row gap-6 bg-white/5 border-b border-white/5">
        <input 
          placeholder="SECURE OBJECTIVE INPUT..." 
          className="flex-1 p-5 rounded-2xl text-white font-black placeholder:text-white/10 outline-none uppercase tracking-widest text-sm" 
          value={input} onChange={e => setInput(e.target.value)} 
          onKeyPress={e => e.key === 'Enter' && add()}
        />
        <button onClick={add} className="bg-amber-500 text-black px-12 py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-xs hover:bg-white transition-all shadow-[0_0_20px_rgba(212,175,55,0.3)]">Deploy Task</button>
      </div>
      <div className="p-6 space-y-4">
        {tasks.map((t: any) => (
          <div key={t.id} className="p-6 flex justify-between items-center rounded-2xl hover:bg-white/5 transition-all group border border-transparent hover:border-amber-500/10">
            <div className="flex items-center gap-6">
              <div className="relative flex items-center justify-center">
                <input type="checkbox" checked={t.completed} onChange={() => toggle(t.id)} className="w-8 h-8 opacity-0 absolute z-10 cursor-pointer" />
                <div className="relative flex items-center justify-center">
                    <div className={`w-8 h-8 rounded-xl border-2 border-amber-500/30 flex items-center justify-center transition-all ${t.completed ? 'bg-amber-500 border-amber-500' : ''}`}>
                    {t.completed && <span className="text-black font-black text-xl leading-none">✓</span>}
                    </div>
                </div>
              </div>
              <span className={`text-xl font-bold tracking-tight ${t.completed ? 'line-through text-white/20' : 'text-white'}`}>{t.title}</span>
            </div>
            <button onClick={() => remove(t.id)} className="text-rose-500 font-black text-[10px] uppercase tracking-widest hover:underline opacity-0 group-hover:opacity-100 transition-opacity">Abort Entry</button>
          </div>
        ))}
        {tasks.length === 0 && <p className="text-center py-20 text-white/5 font-black text-4xl uppercase italic tracking-widest">No Active Objectives</p>}
      </div>
    </div>
  );
};

const ReportView = ({ reports, setReports }: any) => {
  const [input, setInput] = useState('');
  const add = () => {
    if(!input) return;
    const now = new Date();
    const ts = `${now.toLocaleDateString()} • ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    setReports([{ id: Date.now().toString(), content: input, timestamp: ts }, ...reports]);
    setInput('');
  };
  const remove = (id: string) => setReports(reports.filter((r:any) => r.id !== id));

  return (
    <div className="space-y-10">
      <div className="glass-panel p-10 rounded-[3rem] shadow-2xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
          <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Daily Intelligence Feed</h3>
        </div>
        <textarea 
          placeholder="Transmit report details to secure database..." 
          className="w-full p-8 rounded-[2rem] text-white font-medium focus:border-amber-500 outline-none h-48 resize-none mb-6 text-lg"
          value={input} onChange={e => setInput(e.target.value)}
        />
        <button onClick={add} className="w-full bg-amber-500 text-black py-6 rounded-2xl font-black uppercase tracking-[0.4em] text-sm shadow-xl hover:bg-white transition-all transform active:scale-95">Commit Report</button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {reports.map((r: any) => (
          <div key={r.id} className="glass-panel p-8 rounded-[2.5rem] border-amber-500/10 relative group hover:border-amber-500/50">
            <div className="flex justify-between items-start mb-6 border-b border-white/5 pb-4">
              <div>
                <p className="text-[10px] font-black text-amber-500 uppercase tracking-[0.3em] mb-1">Timestamp</p>
                <p className="text-xs font-mono text-white/40">{r.timestamp}</p>
              </div>
              <button onClick={() => remove(r.id)} className="text-rose-500 text-[9px] font-black tracking-widest uppercase hover:underline">Hapus</button>
            </div>
            <p className="text-white/90 text-md leading-relaxed whitespace-pre-wrap font-medium">{r.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const CredentialView = ({ logins, setLogins }: any) => {
  const [form, setForm] = useState({ platform: '', username: '', password: '', status: 'Active' as any });
  const add = () => {
    if(!form.platform || !form.username) return;
    setLogins([{ ...form, id: Date.now().toString(), timestamp: new Date().toLocaleDateString() }, ...logins]);
    setForm({ platform: '', username: '', password: '', status: 'Active' });
  };
  const remove = (id: string) => setLogins(logins.filter((l:any) => l.id !== id));

  return (
    <div className="space-y-10">
      <div className="glass-panel p-10 rounded-[3rem] shadow-2xl">
        <h3 className="text-2xl font-black text-white uppercase tracking-tighter mb-8 text-center">Credential Registry</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input placeholder="PLATFORM" className="p-4 rounded-xl text-white font-bold text-center" value={form.platform} onChange={e => setForm({...form, platform: e.target.value})} />
          <input placeholder="USERNAME" className="p-4 rounded-xl text-white font-bold text-center" value={form.username} onChange={e => setForm({...form, username: e.target.value})} />
          <input placeholder="PASSWORD" type="text" className="p-4 rounded-xl text-white font-bold text-center" value={form.password} onChange={e => setForm({...form, password: e.target.value})} />
          <select className="p-4 rounded-xl text-white font-black text-center cursor-pointer" value={form.status} onChange={e => setForm({...form, status: e.target.value as any})}>
            <option>Active</option>
            <option>Inactive</option>
            <option>Pending</option>
          </select>
        </div>
        <button onClick={add} className="mt-6 w-full bg-amber-500 text-black py-5 rounded-2xl font-black uppercase tracking-[0.4em] text-xs hover:bg-white transition-all">Authorize Identity</button>
      </div>

      <div className="glass-panel rounded-[3rem] overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-amber-500/10 text-amber-500 text-[10px] uppercase font-black tracking-[0.2em]">
                <th className="px-10 py-6">Platform Service</th>
                <th className="px-10 py-6">Identity User</th>
                <th className="px-10 py-6">Credential</th>
                <th className="px-10 py-6">Operational Status</th>
                <th className="px-10 py-6 text-center">Override</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {logins.map((l:any) => (
                <tr key={l.id} className="hover:bg-white/5 transition-all">
                  <td className="px-10 py-8 font-black text-white uppercase tracking-tight">{l.platform}</td>
                  <td className="px-10 py-8 font-mono text-amber-500/80">{l.username}</td>
                  <td className="px-10 py-8 text-white/30 font-mono text-xs">{l.password || '••••••••'}</td>
                  <td className="px-10 py-8">
                    <span className={`px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${l.status === 'Active' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/20 text-rose-400 border border-rose-500/20'}`}>
                      {l.status}
                    </span>
                  </td>
                  <td className="px-10 py-8 text-center">
                    <button onClick={() => remove(l.id)} className="text-rose-500/50 hover:text-rose-500 text-[10px] font-black uppercase tracking-widest transition-colors">Hapus</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {logins.length === 0 && <p className="text-center py-24 text-white/5 font-black text-3xl uppercase italic tracking-[0.5em]">System Vacant</p>}
        </div>
      </div>
    </div>
  );
};

const RekeningView = ({ data, setData }: any) => {
  const [form, setForm] = useState({ 
    accountName: '', accountNumber: '', bankName: '', issue: 'TERBLOKIR', status: 'Follow Up ADM' as any, customIssue: '' 
  });
  
  const ISSUES = ['TERBLOKIR', 'RTP 02', 'PENARIKAN ATM', 'SALAH PIN', 'LIMIT TRANSAKSI', 'LAINNYA'];
  const STATUSES = ['Follow Up ADM', 'Cabut dari Kas 1', 'Follow Up ke Bulan Depan'];

  const add = () => {
    if(!form.accountNumber || !form.accountName) return;
    const finalIssue = form.issue === 'LAINNYA' ? form.customIssue : form.issue;
    setData([{ ...form, issue: finalIssue, id: Date.now().toString(), timestamp: new Date().toLocaleDateString() }, ...data]);
    setForm({ accountName: '', accountNumber: '', bankName: '', issue: 'TERBLOKIR', status: 'Follow Up ADM', customIssue: '' });
  };

  const remove = (id: string) => setData(data.filter((i:any) => i.id !== id));

  return (
    <div className="space-y-10">
      <div className="glass-panel p-10 rounded-[3rem] shadow-2xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="space-y-4">
            <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest ml-2 mb-2">Account Identification</p>
            <input placeholder="HOLDER NAME" className="w-full p-4 rounded-xl text-white font-bold" value={form.accountName} onChange={e => setForm({...form, accountName: e.target.value})} />
            <input placeholder="ACCOUNT NUMBER" className="w-full p-4 rounded-xl text-white font-bold" value={form.accountNumber} onChange={e => setForm({...form, accountNumber: e.target.value})} />
            <input placeholder="BANKING INSTITUTION" className="w-full p-4 rounded-xl text-white font-bold" value={form.bankName} onChange={e => setForm({...form, bankName: e.target.value})} />
          </div>
          <div className="space-y-4">
            <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest ml-2 mb-2">Issue Diagnostic</p>
            <select className="w-full p-4 rounded-xl text-white font-black" value={form.issue} onChange={e => setForm({...form, issue: e.target.value})}>
              {ISSUES.map(i => <option key={i} value={i}>{i}</option>)}
            </select>
            {form.issue === 'LAINNYA' && (
              <input placeholder="SPECIFY KENDALA..." className="w-full p-4 rounded-xl text-white font-bold" value={form.customIssue} onChange={e => setForm({...form, customIssue: e.target.value})} />
            )}
            <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest ml-2 mb-2">Protocol Status</p>
            <select className="w-full p-4 rounded-xl text-white font-black" value={form.status} onChange={e => setForm({...form, status: e.target.value as any})}>
              {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div className="flex flex-col justify-end">
            <button onClick={add} className="w-full h-full lg:h-48 bg-amber-500 text-black rounded-[2.5rem] font-black uppercase text-md shadow-xl hover:bg-white transition-all transform active:scale-95 flex flex-col items-center justify-center gap-2">
              <span className="text-3xl">📥</span>
              <span className="tracking-[0.2em]">Register Case</span>
            </button>
          </div>
        </div>
      </div>

      <div className="glass-panel rounded-[3rem] overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-amber-500/10 text-amber-500 text-[10px] uppercase font-black tracking-[0.2em]">
                <th className="px-10 py-6">Legal Holder</th>
                <th className="px-10 py-6">Institutional Detail</th>
                <th className="px-10 py-6">Incident Log</th>
                <th className="px-10 py-6">Current Protocol</th>
                <th className="px-10 py-6 text-center">System Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {data.map((r:any) => (
                <tr key={r.id} className="hover:bg-white/5 transition-all group">
                  <td className="px-10 py-8">
                    <p className="font-black text-white uppercase tracking-tight text-lg">{r.accountName}</p>
                    <p className="text-[9px] text-white/20 uppercase font-bold tracking-widest">{r.timestamp}</p>
                  </td>
                  <td className="px-10 py-8">
                    <p className="text-white font-mono text-sm tracking-widest">{r.accountNumber}</p>
                    <p className="text-[10px] text-amber-500/60 font-black uppercase">{r.bankName}</p>
                  </td>
                  <td className="px-10 py-8">
                     <span className="text-[10px] font-black bg-rose-500/10 text-rose-400 border border-rose-500/20 px-4 py-1.5 rounded-full uppercase tracking-widest">{r.issue}</span>
                  </td>
                  <td className="px-10 py-8">
                     <span className="text-[11px] font-bold uppercase text-white/70 tracking-tight">{r.status}</span>
                  </td>
                  <td className="px-10 py-8 text-center">
                    <button onClick={() => remove(r.id)} className="text-rose-500/40 hover:text-rose-500 text-[10px] font-black tracking-widest uppercase transition-colors">Resolve/Hapus</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {data.length === 0 && <p className="text-center py-32 text-white/5 font-black text-4xl uppercase italic tracking-[0.6em]">Zero Incidents Tracked</p>}
        </div>
      </div>
    </div>
  );
};

const DanaView = ({ data, setData }: any) => {
  const [rawInput, setRawInput] = useState('');
  const [resultText, setResultText] = useState('');

  const processFormat = () => {
    if (!rawInput.trim()) return;
    const lines = rawInput.split('\n').filter(line => line.trim() !== '');
    let output = "PENGIRIMAN DANA KE KAS ADMIN\nDARI QRIS\n\n";
    lines.forEach((line) => {
      const parts = line.split('\t');
      if (parts.length >= 5) {
        const bank = parts[0]?.trim();
        const accName = parts[1]?.trim();
        const accNum = parts[2]?.trim();
        const amount = parts[4]?.trim();
        const link = parts[7]?.trim() || '';
        output += `NAMA REKENING : ${accName}\nNOMOR REKENING : ${accNum}\nBANK : ${bank}\nNOMINAL : ${amount}\nLAMPIRAN : ${link}\n\n`;
      }
    });
    setResultText(output.trim());
    const newLogs = lines.map(line => {
        const p = line.split('\t');
        return {
            id: Math.random().toString(36).substr(2, 9),
            amount: parseFloat((p[4] || '0').replace(/,/g, '')) || 0,
            description: `Auto-Transfer: ${p[1]} (${p[0]})`,
            timestamp: new Date().toLocaleTimeString()
        };
    });
    setData([...newLogs, ...data]);
  };

  return (
    <div className="space-y-10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="glass-panel p-10 rounded-[3rem] shadow-2xl border-amber-500/10">
          <textarea 
            placeholder="Paste raw spreadsheet data here..." 
            className="w-full p-6 rounded-3xl text-white font-mono text-xs h-64 outline-none resize-none mb-6 border-amber-500/20 bg-black/40" 
            value={rawInput} onChange={e => setRawInput(e.target.value)} 
          />
          <button onClick={processFormat} className="w-full bg-amber-500 text-black py-6 rounded-[2rem] font-black uppercase tracking-[0.4em] text-sm shadow-2xl hover:bg-white transition-all transform active:scale-95">Format & Commit</button>
        </div>
        <div className="glass-panel p-10 rounded-[3rem] shadow-2xl border-emerald-500/10">
          <textarea readOnly className="w-full p-6 rounded-3xl text-emerald-400/80 font-mono text-sm h-64 outline-none resize-none border-emerald-500/20 bg-black/60" value={resultText} />
        </div>
      </div>
    </div>
  );
};

const GalleryView = ({ data, setData }: any) => {
  const [pendingImage, setPendingImage] = useState<string | null>(null);
  const [caption, setCaption] = useState('');
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
  const [zoomScale, setZoomScale] = useState(1);

  const handleFile = (e: any) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setPendingImage(event.target?.result as string);
        setCaption('');
      };
      reader.readAsDataURL(file);
    }
  };

  const addEvidence = () => {
    if (pendingImage) {
      setData([{ id: Date.now().toString(), imageData: pendingImage, caption: caption.trim() || 'EVIDENCE LOG', timestamp: new Date().toLocaleString() }, ...data]);
      setPendingImage(null);
      setCaption('');
    }
  };

  const remove = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setData(data.filter((g:any) => g.id !== id));
  };

  return (
    <div className="space-y-12 pb-20">
      {!pendingImage ? (
        <div className="glass-panel p-24 rounded-[3.5rem] border-2 border-dashed border-amber-500/20 text-center hover:border-amber-500/50 transition-all cursor-pointer bg-white/5 group relative">
          <input type="file" id="up" className="hidden" onChange={handleFile} accept="image/*" />
          <label htmlFor="up" className="cursor-pointer flex flex-col items-center">
            <div className="text-8xl mb-6 grayscale opacity-20 group-hover:opacity-100 group-hover:grayscale-0 transition-all group-hover:scale-110 duration-500">📸</div>
            <span className="text-3xl font-black uppercase tracking-tighter text-white group-hover:text-amber-500 transition-colors">Capture Intelligence</span>
            <span className="text-[11px] font-black text-amber-500/30 uppercase mt-4 tracking-[0.4em]">Visual Screenshot Evidence Log</span>
          </label>
        </div>
      ) : (
        <div className="glass-panel p-10 rounded-[3.5rem] flex flex-col md:flex-row gap-10 items-center animate-in zoom-in-95">
          <div className="w-full md:w-64 aspect-square rounded-[2rem] overflow-hidden border-2 border-amber-500/30">
            <img src={pendingImage} className="w-full h-full object-cover" alt="pending" />
          </div>
          <div className="flex-1 space-y-6 w-full">
            <textarea placeholder="ENTER SECURE DESCRIPTION..." className="w-full p-6 rounded-2xl h-32 outline-none resize-none bg-black/40 text-white font-bold" value={caption} onChange={e => setCaption(e.target.value)} />
            <div className="flex gap-4">
              <button onClick={addEvidence} className="flex-1 bg-amber-500 text-black py-4 rounded-xl font-black uppercase tracking-widest text-xs">Deploy Log</button>
              <button onClick={() => setPendingImage(null)} className="px-8 border border-white/10 text-white/40 py-4 rounded-xl font-black uppercase tracking-widest text-xs hover:bg-white/5">Cancel</button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
        {data.map((g: GalleryItem) => (
          <div 
            key={g.id} 
            onClick={() => setSelectedItem(g)}
            className="glass-panel rounded-[2rem] overflow-hidden group relative border-amber-500/5 hover:border-amber-500/50 transition-all shadow-2xl cursor-zoom-in"
          >
            <div className="relative overflow-hidden aspect-square">
               <img src={g.imageData} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700" alt="ev" />
               <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60"></div>
               <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={(e) => remove(e, g.id)} className="bg-rose-500/80 p-2 rounded-lg text-white hover:bg-rose-600 transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
               </div>
            </div>
            <div className="p-5 bg-black/80 backdrop-blur-md">
              <p className="text-[10px] text-white/90 font-bold uppercase tracking-tight mb-1 truncate">{g.caption}</p>
              <span className="text-[8px] text-white/20 font-black uppercase tracking-widest">{g.timestamp}</span>
            </div>
          </div>
        ))}
      </div>

      {selectedItem && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10 bg-black/95 backdrop-blur-3xl animate-in fade-in duration-300 pointer-events-auto"
          onClick={() => { setSelectedItem(null); setZoomScale(1); }}
        >
          <div className="absolute top-10 right-10 flex gap-4 z-[110]">
            <button onClick={(e) => { e.stopPropagation(); setZoomScale(prev => prev === 1 ? 2 : 1); }} className="w-12 h-12 glass-panel flex items-center justify-center text-amber-500 hover:text-white rounded-full transition-all">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" /></svg>
            </button>
            <button onClick={() => { setSelectedItem(null); setZoomScale(1); }} className="w-12 h-12 glass-panel flex items-center justify-center text-rose-500 hover:text-white rounded-full transition-all">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
          <div className="relative max-w-full max-h-full overflow-auto" onClick={(e) => e.stopPropagation()}>
            <div style={{ transform: `scale(${zoomScale})` }} className="transition-transform duration-300 origin-center cursor-zoom-out flex flex-col items-center" onClick={() => setZoomScale(prev => prev === 1 ? 2 : 1)}>
              <img src={selectedItem.imageData} className="max-w-[90vw] max-h-[80vh] rounded-[2rem] shadow-[0_0_50px_rgba(212,175,55,0.2)] border border-amber-500/20 object-contain" alt="zoomed" />
              <div className="mt-8 text-center bg-black/60 p-6 rounded-3xl backdrop-blur-xl border border-white/5 w-full max-w-2xl">
                <h4 className="text-white font-black uppercase text-xl tracking-tighter mb-2">{selectedItem.caption}</h4>
                <p className="text-amber-500/60 font-mono text-[10px] tracking-widest uppercase">{selectedItem.timestamp}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
