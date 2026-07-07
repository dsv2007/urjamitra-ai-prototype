import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import { Activity, AlertTriangle, BadgeIndianRupee, BarChart3, BatteryCharging, BrainCircuit, Calculator, Factory, FileDown, Gauge, Leaf, Lock, Menu, Moon, Settings, Sun, Wrench, Zap } from "lucide-react";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { machines as seedMachines, roles, tariff } from "./data";
import { analyzeMachine, createAlerts, mutateMachine } from "./aiEngine";
import "./styles.css";

const nav = ["Dashboard", "Energy Twin", "Monitoring", "Machine Detail", "Alerts", "Maintenance", "Recommendations", "Reports", "ROI Calculator", "Green Impact", "Admin", "Hackathon Compliance", "About", "Demo Flow"];
const icons = { Dashboard: Gauge, "Energy Twin": BrainCircuit, Monitoring: Activity, Alerts: AlertTriangle, Maintenance: Wrench, Recommendations: Zap, Reports: FileDown, "ROI Calculator": Calculator, "Green Impact": Leaf, Admin: Settings };

function App() {
  const [page, setPage] = useState("Landing");
  const [theme, setTheme] = useState("light");
  const [role, setRole] = useState("owner");
  const [data, setData] = useState(seedMachines);
  const [selected, setSelected] = useState(seedMachines[3].id);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setTick((v) => v + 1);
      setData((prev) => prev.map((m) => mutateMachine(m, tick)));
    }, 2500);
    return () => clearInterval(timer);
  }, [tick]);

  const enriched = useMemo(() => data.map((m) => ({ ...m, ai: analyzeMachine(m) })), [data]);
  const alerts = useMemo(() => enriched.flatMap((m) => createAlerts(m, m.ai)), [enriched]);
  const active = enriched.find((m) => m.id === selected) || enriched[0];
  const totals = useMemo(() => {
    const dailyKwh = enriched.reduce((sum, m) => sum + m.power * m.runtime, 0);
    const monthlyCost = dailyKwh * 26 * tariff;
    const monthlySavings = enriched.reduce((sum, m) => sum + Math.min(m.saving, m.ai.wasteCost * 0.67), 0);
    const carbon = enriched.reduce((sum, m) => sum + m.ai.carbon, 0);
    return { dailyKwh, monthlyCost, monthlySavings, yearlySavings: monthlySavings * 12, carbon };
  }, [enriched]);

  if (page === "Landing") {
    return <div className={`app ${theme}`}><Landing onStart={() => setPage("Dashboard")} theme={theme} setTheme={setTheme} /></div>;
  }

  return <div className={`app ${theme}`}>
    <Shell page={page} setPage={setPage} role={role} setRole={setRole} theme={theme} setTheme={setTheme}>
      {page === "Login" && <Login setPage={setPage} setRole={setRole} />}
      {page === "Register" && <Register setPage={setPage} />}
      {page === "Dashboard" && <Dashboard totals={totals} machines={enriched} alerts={alerts} setPage={setPage} setSelected={setSelected} />}
      {page === "Energy Twin" && <EnergyTwin machines={enriched} setSelected={setSelected} setPage={setPage} />}
      {page === "Monitoring" && <Monitoring machines={enriched} />}
      {page === "Machine Detail" && <MachineDetail machine={active} />}
      {page === "Alerts" && <Alerts alerts={alerts} />}
      {page === "Maintenance" && <Maintenance machines={enriched} />}
      {page === "Recommendations" && <Recommendations machines={enriched} />}
      {page === "Reports" && <Reports machines={enriched} totals={totals} alerts={alerts} />}
      {page === "ROI Calculator" && <Roi totals={totals} />}
      {page === "Green Impact" && <Green totals={totals} machines={enriched} />}
      {page === "Admin" && <Admin machines={enriched} alerts={alerts} />}
      {page === "Hackathon Compliance" && <Compliance />}
      {page === "About" && <About />}
      {page === "Demo Flow" && <DemoFlow setPage={setPage} />}
    </Shell>
  </div>;
}

function Landing({ onStart, theme, setTheme }) {
  return <main className="landing">
    <header className="topbar">
      <b className="brand"><BatteryCharging /> UrjaMitra AI</b>
      <span>MSME Idea Hackathon 6.0</span>
      <button className="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>{theme === "dark" ? <Sun /> : <Moon />}</button>
    </header>
    <section className="hero">
      <div className="hero-copy">
        <p className="eyebrow">Frontier Technology in MSMEs</p>
        <h1>Turning MSME machines into intelligent energy-saving assets.</h1>
        <p>AI Energy Twin, IoT sensing, machine health intelligence and green impact reporting for old and semi-automatic machines without replacing them.</p>
        <div className="hero-actions">
          <button onClick={onStart}>View Live Dashboard</button>
          <button className="ghost">Download Concept Note</button>
        </div>
      </div>
      <div className="twin-visual">
        <div className="machine-core"><Factory size={78} /><span>AI Energy Twin</span></div>
        {["Power", "Health", "Risk", "Savings", "CO2"].map((x, i) => <i key={x} style={{ "--i": i }}>{x}</i>)}
      </div>
    </section>
    <section className="feature-grid">
      {[
        ["Problem", "High electricity bills, idle power loss, overheating, vibration and sudden breakdowns in MSME machines."],
        ["Solution", "Low-cost sensor kit plus AI dashboard that converts existing equipment into monitored energy twins."],
        ["Innovation", "Rule-based AI now, ML anomaly detection-ready later, with owner-friendly decisions instead of raw graphs."],
        ["Impact", "Lower energy cost, avoided downtime, carbon reduction and affordable Industry 4.0 modernization."]
      ].map(([h, t]) => <article className="glass" key={h}><h3>{h}</h3><p>{t}</p></article>)}
    </section>
  </main>;
}

function Shell({ children, page, setPage, role, setRole, theme, setTheme }) {
  const [open, setOpen] = useState(false);
  return <>
    <aside className={`sidebar ${open ? "open" : ""}`}>
      <b className="brand"><BatteryCharging /> UrjaMitra AI</b>
      <button onClick={() => setPage("Landing")}>Landing</button>
      <button onClick={() => setPage("Login")}>Login</button>
      <button onClick={() => setPage("Register")}>Register</button>
      {nav.map((n) => {
        const Icon = icons[n] || BarChart3;
        return <button className={page === n ? "active" : ""} onClick={() => setPage(n)} key={n}><Icon size={17} />{n}</button>;
      })}
    </aside>
    <section className="main">
      <header className="appbar">
        <button className="icon mobile" onClick={() => setOpen(!open)}><Menu /></button>
        <div><p className="eyebrow">{roles[role].label} View</p><h2>{page}</h2></div>
        <select value={role} onChange={(e) => setRole(e.target.value)}><option value="owner">MSME Owner</option><option value="technician">Technician</option><option value="admin">Admin</option></select>
        <button className="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>{theme === "dark" ? <Sun /> : <Moon />}</button>
      </header>
      {children}
    </section>
  </>;
}

function Dashboard({ totals, machines, alerts, setPage, setSelected }) {
  return <div className="stack">
    <div className="kpis"><Kpi icon={Factory} label="Machines" value={machines.length} /><Kpi icon={BadgeIndianRupee} label="Monthly Energy Cost" value={`Rs ${fmt(totals.monthlyCost)}`} /><Kpi icon={Zap} label="Possible Monthly Savings" value={`Rs ${fmt(totals.monthlySavings)}`} /><Kpi icon={Leaf} label="CO2 Avoided Potential" value={`${fmt(totals.carbon * 0.18)} kg`} /></div>
    <div className="grid two">
      <Panel title="Live Energy Trend"><ResponsiveContainer height={260}><AreaChart data={machines.map((m) => ({ name: m.name.split(" ")[0], power: m.power, risk: m.ai.risk }))}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" /><YAxis /><Tooltip /><Area dataKey="power" stroke="#22d3ee" fill="#0ea5e9" fillOpacity={0.25} /><Line dataKey="risk" stroke="#fb7185" /></AreaChart></ResponsiveContainer></Panel>
      <Panel title="Critical Alerts">{alerts.slice(0, 5).map((a) => <AlertCard key={a.id + a.time} alert={a} />)}</Panel>
    </div>
    <div className="machine-grid">{machines.map((m) => <MachineCard key={m.id} m={m} onClick={() => { setSelected(m.id); setPage("Machine Detail"); }} />)}</div>
  </div>;
}

function EnergyTwin({ machines, setSelected, setPage }) {
  return <div className="machine-grid twins">{machines.map((m) => <article className="glass twin-card" key={m.id} onClick={() => { setSelected(m.id); setPage("Machine Detail"); }}><Ring value={m.ai.health} label="Health" /><h3>{m.name}</h3><p>{m.ai.reason}</p><Metric a="Failure Risk" b={`${m.ai.risk}%`} /><Metric a="Idle Waste" b={`${m.ai.wastage}%`} /><Metric a="Energy Rating" b={m.ai.efficiency} /><Metric a="Monthly Saving" b={`Rs ${fmt(m.saving)}`} /></article>)}</div>;
}

function Monitoring({ machines }) {
  return <Panel title="Live IoT Sensor Simulation"><table><thead><tr>{["Machine", "Voltage", "Current", "Power", "Temp", "Vibration", "Status", "Idle", "Load", "Runtime", "Output"].map((h) => <th key={h}>{h}</th>)}</tr></thead><tbody>{machines.map((m) => <tr key={m.id}><td>{m.name}</td><td>{m.voltage} V</td><td>{m.current} A</td><td>{m.power} kW</td><td>{m.temp} C</td><td>{m.vibration} mm/s</td><td><Badge text={m.status} /></td><td>{m.idle} min</td><td>{m.load}%</td><td>{m.runtime} h</td><td>{m.output}</td></tr>)}</tbody></table></Panel>;
}

function MachineDetail({ machine: m }) {
  return <div className="grid two"><Panel title={m.name}><div className="detail-head"><Ring value={m.ai.health} label="Health" /><Ring value={100 - m.ai.risk} label="Safety" /><Ring value={100 - m.ai.wastage} label="Efficiency" /></div><p className="callout">{m.name} has {m.ai.risk}% failure risk due to {m.ai.reason}. {m.ai.technicianAction}. Estimated downtime avoided: {m.ai.downtimeAvoided} hours.</p><Metric a="Suggested maintenance date" b={m.ai.suggestedDate} /><Metric a="Possible damage if ignored" b={m.ai.possibleDamage} /></Panel><Panel title="Sensor Pulse"><ResponsiveContainer height={330}><LineChart data={Array.from({ length: 12 }, (_, i) => ({ t: i, power: m.power + Math.sin(i) * 1.4, temp: m.temp + Math.cos(i) * 2, vibration: m.vibration + Math.sin(i / 2) * 0.5 }))}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="t" /><YAxis /><Tooltip /><Line dataKey="power" stroke="#22d3ee" /><Line dataKey="temp" stroke="#fb923c" /><Line dataKey="vibration" stroke="#f43f5e" /></LineChart></ResponsiveContainer></Panel></div>;
}

function Alerts({ alerts }) { return <div className="stack">{alerts.map((a) => <AlertCard key={a.id + a.time} alert={a} />)}</div>; }
function Maintenance({ machines }) { return <div className="stack">{[...machines].sort((a, b) => b.ai.risk - a.ai.risk).map((m) => <Panel key={m.id} title={`${m.name} - ${m.ai.priority}`}><p>{m.ai.reason}. Suggested date: <b>{m.ai.suggestedDate}</b>. Technician action: <b>{m.ai.technicianAction}</b>.</p><p>Possible damage if ignored: {m.ai.possibleDamage}. Downtime avoided: {m.ai.downtimeAvoided} hours.</p></Panel>)}</div>; }
function Recommendations({ machines }) { const recs = machines.flatMap((m) => m.ai.recommendations.map((r) => ({ ...r, machine: m.name }))); return <div className="cards">{recs.map((r, i) => <article className="glass" key={i}><Badge text={r.priority} /><h3>{r.actionRequired}</h3><p>{r.machine}: {r.reason}</p><Metric a="Expected saving" b={`Rs ${fmt(r.expectedSaving)}/mo`} /><Metric a="Difficulty" b={r.difficulty} /></article>)}</div>; }
function Reports({ machines, totals, alerts }) { return <div className="grid two"><Panel title="Monthly MSME Impact Report"><p className="callout">Daily energy report, weekly health report, monthly cost-saving report, carbon saving report and maintenance summary generated for owner review.</p><ResponsiveContainer height={260}><BarChart data={machines.map((m) => ({ name: m.name.split(" ")[0], saving: m.saving, risk: m.ai.risk }))}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" /><YAxis /><Tooltip /><Bar dataKey="saving" fill="#34d399" /><Bar dataKey="risk" fill="#fb7185" /></BarChart></ResponsiveContainer><button><FileDown /> Download Report</button></Panel><Panel title="Owner Summary"><p>Total monthly cost: Rs {fmt(totals.monthlyCost)}</p><p>Possible monthly saving: Rs {fmt(totals.monthlySavings)}</p><p>Alerts this cycle: {alerts.length}</p><p>Top focus: Packaging Machine and Injection Moulding Machine require urgent inspection.</p></Panel></div>; }
function Roi({ totals }) { const investment = 27500; const monthly = Math.max(1, totals.monthlySavings); return <div className="grid two"><Panel title="Cost Saving and ROI Calculator"><div className="kpis"><Kpi icon={BadgeIndianRupee} label="Daily Energy Cost" value={`Rs ${fmt(totals.monthlyCost / 26)}`} /><Kpi icon={BadgeIndianRupee} label="Monthly Wastage" value={`Rs ${fmt(monthly * 1.5)}`} /><Kpi icon={Zap} label="Monthly Saving" value={`Rs ${fmt(monthly)}`} /><Kpi icon={Calculator} label="Payback" value={`${(investment / monthly).toFixed(1)} months`} /></div><p className="callout">Estimated yearly savings: Rs {fmt(totals.yearlySavings)}. Prototype ROI: {Math.round(((totals.yearlySavings - investment) / investment) * 100)}%.</p></Panel><Panel title="Pricing for MSMEs"><p>IoT kit installation: Rs 18,000 to Rs 35,000 per machine cluster.</p><p>Dashboard subscription: Rs 1,999 to Rs 6,999 per month.</p><p>Maintenance support: Rs 3,000 per visit or annual AMC.</p><p>Energy audit report: Rs 7,500 per unit.</p></Panel></div>; }
function Green({ totals, machines }) { const saved = totals.monthlySavings / tariff; return <div className="grid two"><Panel title="Green Impact"><div className="leaf-score"><Leaf size={72} /><h1>{Math.min(96, Math.round(62 + saved / 900))}</h1><p>Sustainability Badge: Green MSME Improver</p></div><p>Energy saved potential: {fmt(saved)} kWh/month. CO2 reduction estimate: {fmt(saved * 0.82)} kg/month.</p></Panel><Panel title="Clean Energy Comparison"><ResponsiveContainer height={280}><PieChart><Pie data={machines.map((m) => ({ name: m.name, value: m.ai.carbon }))} dataKey="value" outerRadius={100}>{machines.map((_, i) => <Cell key={i} fill={["#22d3ee", "#34d399", "#facc15", "#fb7185", "#a78bfa", "#60a5fa", "#f97316"][i]} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer></Panel></div>; }
function Admin({ machines, alerts }) { return <div className="grid two"><Panel title="Admin Panel"><div className="actions"><button>Add Machine</button><button>Edit Machine</button><button>Delete Machine</button><button>View MSME Profile</button></div><p>Machines: {machines.length}. Alerts: {alerts.length}. Reports: 5 generated.</p></Panel><Panel title="All Machines">{machines.map((m) => <Metric key={m.id} a={m.name} b={m.ai.priority} />)}</Panel></div>; }
function Compliance() {
  const items = [
    ["Theme match", "Energy Efficiency plus Industry 4.0 and 5.0 under Frontier Technology in MSMEs."],
    ["Prototype intent", "Built as a working proof-of-concept with frontend, backend, AI logic, APIs, sample data and hardware plan."],
    ["MSME usefulness", "Reduces electricity cost, avoids downtime, improves productivity and supports green manufacturing."],
    ["Retrofit affordability", "Designed for existing MSME machines with low-cost sensors instead of full machine replacement."],
    ["Commercial potential", "IoT kit installation, monthly dashboard subscription, maintenance support and energy audit services."],
    ["Scalability", "Applicable across textile, rice mill, fabrication, cold storage, plastic, CNC and packaging MSMEs."],
    ["Clean and green impact", "Shows kWh savings, CO2 reduction, green score and sustainability badge."],
    ["No identity leakage", "Concept note and block diagram avoid phone, email, college, personal name and brand identity."],
    ["Student readiness", "Designed so a student team can continue development after academics through a field pilot roadmap."],
    ["Documents reminder", "Submit complete and valid documents: student ID for FY 2026-27 and government age proof."]
  ];
  return <div className="grid two">
    <Panel title="MSME Idea Hackathon 6.0 Fit">
      <p className="callout">Submission window: 27 June 2026 to 14 July 2026. Evaluation moves from Host Institute to Ministry screening, Domain Expert Selection Committee and final PMAC approval.</p>
      {items.map(([a, b]) => <Metric key={a} a={a} b={b} />)}
    </Panel>
    <Panel title="Six Themes Alignment">
      {["Renewable Energy", "Energy Efficiency", "Automotive Technology", "Industry 4.0 and 5.0", "Robotics and Automation", "Other Frontier Technologies"].map((theme) => <div className="step" key={theme}><b>{theme === "Energy Efficiency" || theme === "Industry 4.0 and 5.0" ? "✓" : "•"}</b><span>{theme}</span></div>)}
      <p className="callout">Primary fit: Energy Efficiency. Strong secondary fit: Industry 4.0 and 5.0 through IoT, digital twin, AI and predictive maintenance.</p>
    </Panel>
  </div>;
}
function Login({ setPage, setRole }) { return <Panel title="Role-Based Login"><div className="login-grid">{Object.entries(roles).map(([k, r]) => <button key={k} onClick={() => { setRole(k); setPage("Dashboard"); }}><Lock /> {r.label}<small>{r.email} / {r.password}</small></button>)}</div></Panel>; }
function Register({ setPage }) { return <Panel title="Register MSME Unit"><div className="form"><input placeholder="MSME unit name" /><input placeholder="Sector" /><input placeholder="City" /><input placeholder="Number of machines" /><button onClick={() => setPage("Dashboard")}>Create Demo Unit</button></div></Panel>; }
function About() { return <Panel title="About Project"><p>UrjaMitra AI is a low-cost IoT plus AI platform for MSMEs that monitors energy, machine health, fault risk, idle wastage, carbon impact and maintenance urgency in real time. It supports affordable modernization, cost reduction, Industry 4.0/5.0 readiness and green manufacturing.</p></Panel>; }
function DemoFlow({ setPage }) { const steps = ["Open landing page", "View live dashboard", "Watch sensor data update", "Detect high vibration and temperature", "AI creates critical alert", "Recommendation suggests technician action", "ROI shows payback", "Report summarizes MSME impact"]; return <Panel title="Prototype Demo Workflow">{steps.map((s, i) => <div className="step" key={s}><b>{i + 1}</b><span>{s}</span></div>)}<button onClick={() => setPage("Dashboard")}>Start Demo</button></Panel>; }
function MachineCard({ m, onClick }) { return <article className="glass machine-card" onClick={onClick}><div><Badge text={m.ai.priority} /><h3>{m.name}</h3><p>{m.sector}</p></div><Ring value={m.ai.health} label="Health" /><Metric a="Risk" b={`${m.ai.risk}%`} /><Metric a="Power" b={`${m.power} kW`} /></article>; }
function Panel({ title, children }) { return <section className="glass panel"><h3>{title}</h3>{children}</section>; }
function Kpi({ icon: Icon, label, value }) { return <article className="glass kpi"><Icon /><span>{label}</span><b>{value}</b></article>; }
function Ring({ value, label }) { return <div className="ring" style={{ "--p": value }}><b>{value}%</b><span>{label}</span></div>; }
function Badge({ text }) { return <span className={`badge ${String(text).toLowerCase()}`}>{text}</span>; }
function Metric({ a, b }) { return <div className="metric-row"><span>{a}</span><b>{b}</b></div>; }
function AlertCard({ alert: a }) { return <article className={`alert ${String(a.severity).toLowerCase()}`}><AlertTriangle /><div><b>{a.machine}: {a.type}</b><p>{a.reason}. Action: {a.action}. Cost impact: Rs {fmt(a.cost)}. Time: {a.time}</p></div></article>; }
function fmt(n) { return Math.round(n).toLocaleString("en-IN"); }

createRoot(document.getElementById("root")).render(<App />);
