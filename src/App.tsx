import { useEffect, useMemo, useState } from 'react'
import {
  ArrowDownLeft, ArrowUpRight, Bell, Check, ChevronRight, CircleHelp,
  Coins, Compass, CreditCard, Flame, Gem, Goal, Home, Lightbulb,
  Plus, ShieldCheck, Sparkles, Target, TrendingUp, Wallet, X
} from 'lucide-react'

type Transaction = { id: number; title: string; date: string; amount: number; kind: 'add' | 'save' }
type GoalItem = { id: number; name: string; saved: number; target: number; icon: string; color: string }
const initialGoals: GoalItem[] = [
  { id: 1, name: 'Emergency fund', saved: 12500, target: 30000, icon: '◈', color: 'mint' },
  { id: 2, name: 'New smartphone', saved: 8400, target: 25000, icon: '▣', color: 'violet' },
  { id: 3, name: 'Dream vacation', saved: 5200, target: 40000, icon: '✳', color: 'gold' },
]
const initialTransactions: Transaction[] = [
  { id: 1, title: 'Daily smart save', date: 'Today · 9:30 AM', amount: 50, kind: 'save' },
  { id: 2, title: 'Added to emergency fund', date: 'Yesterday · 6:15 PM', amount: 500, kind: 'add' },
  { id: 3, title: 'Daily smart save', date: 'Yesterday · 9:00 AM', amount: 50, kind: 'save' },
]
const money = (n: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n)

function App() {
  const [active, setActive] = useState('Overview')
  const [balance, setBalance] = useState(26100)
  const [daily, setDaily] = useState(50)
  const [goals, setGoals] = useState(initialGoals)
  const [transactions, setTransactions] = useState(initialTransactions)
  const [modal, setModal] = useState(false)
  const [amount, setAmount] = useState('500')
  const [goalName, setGoalName] = useState('')

  useEffect(() => {
    try {
      const saved = localStorage.getItem('novawealth-demo-v1')
      if (saved) {
        const data = JSON.parse(saved)
        if (typeof data.balance === 'number') setBalance(data.balance)
        if (Array.isArray(data.goals)) setGoals(data.goals)
        if (Array.isArray(data.transactions)) setTransactions(data.transactions)
        if (typeof data.daily === 'number') setDaily(data.daily)
      }
    } catch { /* keep demo defaults if storage is unavailable */ }
  }, [])

  useEffect(() => {
    localStorage.setItem('novawealth-demo-v1', JSON.stringify({ balance, goals, transactions, daily }))
  }, [balance, goals, transactions, daily])

  const totalSaved = goals.reduce((sum, goal) => sum + goal.saved, 0)
  const totalTarget = goals.reduce((sum, goal) => sum + goal.target, 0)
  const progress = Math.min(100, Math.round((totalSaved / totalTarget) * 100))
  const coachTip = useMemo(() => daily >= 100
    ? 'Your daily target is ambitious. Keep a small buffer so your plan stays comfortable.'
    : 'A steady habit beats a big one. Your current daily plan adds up to ' + money(daily * 30) + ' in 30 days.', [daily])

  function addMoney() {
    const value = Number(amount)
    if (!Number.isFinite(value) || value <= 0 || value > 100000) return
    setBalance(v => v + value)
    setGoals(items => items.map((g, i) => i === 0 ? { ...g, saved: g.saved + value } : g))
    setTransactions(items => [{ id: Date.now(), title: 'Demo top-up · Emergency fund', date: 'Just now', amount: value, kind: 'add' }, ...items].slice(0, 8))
    setModal(false)
  }

  function runDailySave() {
    setBalance(v => v + daily)
    setGoals(items => items.map((g, i) => i === 0 ? { ...g, saved: g.saved + daily } : g))
    setTransactions(items => [{ id: Date.now(), title: 'Daily smart save · Demo', date: 'Just now', amount: daily, kind: 'save' }, ...items].slice(0, 8))
  }

  function createGoal() {
    const name = goalName.trim()
    if (!name) return
    setGoals(items => [...items, { id: Date.now(), name, saved: 0, target: 10000, icon: '✦', color: 'blue' }])
    setGoalName('')
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <a className="brand" href="#"><span className="brand-mark"><Gem size={21} /></span><span>NOVA<span className="brand-light">WEALTH</span><small>INTELLIGENCE, IN BALANCE</small></span></a>
        <div className="side-label">WORKSPACE</div>
        <nav>{[{name:'Overview',icon:Home},{name:'My goals',icon:Target},{name:'Activity',icon:Compass}].map(item => <button key={item.name} className={active===item.name?'nav-item selected':'nav-item'} onClick={()=>setActive(item.name)}><item.icon size={18}/>{item.name}</button>)}</nav>
        <div className="side-label tools-label">YOUR TOOLS</div>
        <button className="nav-item" onClick={()=>setActive('AI Coach')}><Sparkles size={18}/>AI money coach<span className="new-pill">NEW</span></button>
        <div className="sidebar-bottom"><div className="security-card"><ShieldCheck size={18}/><b>Your demo is private</b><p>This preview stores sample data only on this device.</p></div><button className="nav-item muted"><CircleHelp size={18}/>Help centre</button><div className="profile"><div className="avatar">N</div><div><b>Nova member</b><small>Starter account</small></div><ChevronRight size={16}/></div></div>
      </aside>

      <main className="main-content">
        <header className="topbar"><div className="breadcrumb">Workspace <span>/</span> <b>{active}</b></div><div className="top-actions"><span className="live-dot">DEMO MODE</span><button className="icon-btn" aria-label="Notifications"><Bell size={18}/></button><div className="avatar small-avatar">N</div></div></header>
        <div className="page-wrap">
          <section className="welcome-row"><div><div className="eyebrow"><Sparkles size={14}/> YOUR FINANCIAL SPACE</div><h1>Your money,<br/><em>in motion.</em></h1><p className="subhead">Small steps today. More possibilities tomorrow.</p></div><div className="date-chip"><span className="date-dot"/> YOUR OVERVIEW <b>2026</b></div></section>

          {active==='AI Coach' ? <section className="coach-page"><div className="coach-orb"><Sparkles size={32}/></div><div className="eyebrow">NOVA SMART COACH · PREVIEW</div><h2>A clearer view of your next move.</h2><p>{coachTip}</p><div className="coach-insight"><Lightbulb size={20}/><div><b>Your 30-day outlook</b><span>At {money(daily)} per day, your planned savings would be {money(daily*30)} in 30 days. This is a simple estimate, not a return forecast.</span></div></div><button className="primary-btn" onClick={()=>setActive('Overview')}>Back to overview <ChevronRight size={17}/></button></section> : <><section className="summary-grid"><div className="balance-card"><div className="card-top"><span>TOTAL SAVINGS · DEMO</span><span className="balance-icon"><Wallet size={18}/></span></div><div className="balance-amount">{money(balance)}</div><div className="balance-foot"><span><span className="positive"><TrendingUp size={14}/> TRACKING</span> · Your savings workspace</span><button className="add-btn" onClick={()=>setModal(true)}><Plus size={16}/> Add money</button></div><div className="card-glow"/></div><div className="stat-card"><div className="stat-icon"><Goal size={18}/></div><span>GOALS IN PROGRESS</span><strong>{goals.length.toString().padStart(2,'0')}</strong><small>Keep your momentum going</small></div><div className="stat-card"><div className="stat-icon gold-icon"><Flame size={18}/></div><span>SAVING STREAK</span><strong>07 <i>days</i></strong><small>Demo streak · build the habit</small></div></section>

          <section className="content-grid"><div className="panel goals-panel"><div className="panel-heading"><div><div className="eyebrow">MAKE IT HAPPEN</div><h2>Your goals</h2></div><button className="text-btn" onClick={()=>setActive('My goals')}>View all <ChevronRight size={15}/></button></div><div className="goals-list">{goals.slice(0,3).map(goal=>{const pct=Math.min(100,Math.round(goal.saved/goal.target*100));return <div className="goal-row" key={goal.id}><div className={'goal-icon '+goal.color}>{goal.icon}</div><div className="goal-info"><div className="goal-title"><b>{goal.name}</b><span>{pct}%</span></div><div className="progress-track"><div className={'progress-fill '+goal.color} style={{width:pct+'%'}}/></div><small>{money(goal.saved)} <span>of {money(goal.target)}</span></small></div></div>})}</div><div className="new-goal"><input value={goalName} onChange={e=>setGoalName(e.target.value)} onKeyDown={e=>e.key==='Enter'&&createGoal()} placeholder="Name a new savings goal"/><button onClick={createGoal} aria-label="Create goal"><Plus size={18}/></button></div></div>

          <div className="panel habit-panel"><div className="panel-heading"><div><div className="eyebrow">BUILD YOUR RHYTHM</div><h2>Daily smart save</h2></div><div className="habit-icon"><Coins size={20}/></div></div><p className="muted-copy">Choose an amount that feels comfortable. This is a local demo — no money moves.</p><div className="daily-amount"><span>₹</span><input type="number" min="1" max="10000" value={daily} onChange={e=>setDaily(Math.max(1,Math.min(10000,Number(e.target.value))))}/><small>/ day</small></div><div className="quick-amounts">{[10,20,50,100].map(v=><button key={v} className={daily===v?'amount-chip active':'amount-chip'} onClick={()=>setDaily(v)}>₹{v}</button>)}</div><div className="estimate"><span>30-day plan</span><b>{money(daily*30)}</b></div><button className="primary-btn full-btn" onClick={runDailySave}>Try a demo save <ArrowUpRight size={17}/></button><small className="demo-note"><ShieldCheck size={12}/> Simulation only · No bank or UPI connection</small></div></section>

          <section className="bottom-grid"><div className="panel activity-panel"><div className="panel-heading"><div><div className="eyebrow">YOUR MONEY JOURNAL</div><h2>Recent activity</h2></div><button className="text-btn" onClick={()=>setActive('Activity')}>All activity <ChevronRight size={15}/></button></div><div className="transactions">{transactions.slice(0,4).map(tx=><div className="transaction" key={tx.id}><div className={tx.kind==='add'?'tx-icon add':'tx-icon'}>{tx.kind==='add'?<ArrowDownLeft size={17}/>:<Coins size={17}/>}</div><div className="tx-name"><b>{tx.title}</b><small>{tx.date}</small></div><strong className="tx-amount">+{money(tx.amount)}</strong></div>)}</div></div><div className="coach-card"><div className="coach-card-top"><span className="coach-spark"><Sparkles size={17}/></span><span>ONE SMART THOUGHT</span></div><h3>Consistency is your<br/>quiet superpower.</h3><p>{coachTip}</p><button onClick={()=>setActive('AI Coach')}>Explore money coach <ChevronRight size={15}/></button></div></section></>}
          <footer><span>© 2026 NOVAWEALTH AI</span><span><ShieldCheck size={13}/> DEMO EXPERIENCE · NOT A FINANCIAL PRODUCT</span></footer>
        </div>
      </main>
      {modal&&<div className="modal-backdrop" onClick={()=>setModal(false)}><div className="modal" onClick={e=>e.stopPropagation()}><div className="modal-head"><div><div className="eyebrow">DEMO TRANSACTION</div><h2>Add to savings</h2></div><button className="icon-btn" onClick={()=>setModal(false)}><X size={18}/></button></div><p>This adds a sample entry to your on-device demo only. No payment will be taken.</p><label>Amount (INR)<input type="number" min="1" max="100000" value={amount} onChange={e=>setAmount(e.target.value)}/></label><button className="primary-btn full-btn" onClick={addMoney}>Add demo amount <Check size={17}/></button></div></div>}
    </div>
  )
}

export default App