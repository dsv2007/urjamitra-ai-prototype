import express from "express";
import cors from "cors";
import helmet from "helmet";
import { machines, nextReading } from "./src/simulator.js";
import { analyzeMachine, createAlerts } from "./src/aiEngine.js";

const app = express();
const port = process.env.PORT || 4000;
let tick = 0;

app.use(helmet());
app.use(cors());
app.use(express.json());

function snapshot() {
  tick += 1;
  const live = machines.map((machine) => nextReading(machine, tick));
  return live.map((machine) => {
    const ai = analyzeMachine(machine);
    return { ...machine, ai, alerts: createAlerts(machine, ai) };
  });
}

app.get("/api/health", (_req, res) => res.json({ ok: true, service: "UrjaMitra AI API" }));
app.get("/api/machines", (_req, res) => res.json(snapshot()));
app.get("/api/machines/:id", (req, res) => {
  const machine = snapshot().find((m) => m.id === req.params.id);
  if (!machine) return res.status(404).json({ error: "Machine not found" });
  res.json(machine);
});
app.get("/api/alerts", (_req, res) => res.json(snapshot().flatMap((machine) => machine.alerts)));
app.get("/api/recommendations", (_req, res) => {
  res.json(snapshot().flatMap((machine) => machine.ai.recommendations.map((rec) => ({ machineId: machine.id, machineName: machine.name, ...rec }))));
});
app.get("/api/reports/summary", (_req, res) => {
  const data = snapshot();
  const monthlyEnergyKwh = data.reduce((sum, m) => sum + m.ai.monthlyEnergyKwh, 0);
  const monthlyCost = monthlyEnergyKwh * 9.5;
  const possibleMonthlySavings = data.reduce((sum, m) => sum + Math.min(30000, m.ai.wastageCost * 0.67), 0);
  res.json({
    totalMachines: data.length,
    monthlyEnergyKwh,
    monthlyCost,
    possibleMonthlySavings,
    yearlySavings: possibleMonthlySavings * 12,
    co2Kg: data.reduce((sum, m) => sum + m.ai.co2Kg, 0),
    criticalMachines: data.filter((m) => m.ai.maintenancePriority === "Critical").map((m) => m.name)
  });
});
app.post("/api/roi", (req, res) => {
  const { investment = 27500, monthlySavings = 6500 } = req.body;
  res.json({
    investment,
    monthlySavings,
    paybackMonths: +(investment / Math.max(monthlySavings, 1)).toFixed(1),
    roiPercent: Math.round(((monthlySavings * 12 - investment) / investment) * 100)
  });
});

app.listen(port, () => {
  console.log(`UrjaMitra AI API running on http://127.0.0.1:${port}`);
});
