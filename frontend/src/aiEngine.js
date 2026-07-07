export function analyzeMachine(m) {
  const reasons = [];
  const recommendations = [];
  let risk = 10;
  let health = 96;
  let wastage = 0;

  if (m.temp >= 80) {
    risk += 28;
    health -= 20;
    reasons.push("rising temperature");
    recommendations.push(action("Improve ventilation and inspect motor winding", "Prevents overheating damage", "High", "Medium", 4200));
  }
  if (m.vibration >= 7) {
    risk += 32;
    health -= 24;
    reasons.push("high vibration");
    recommendations.push(action("Inspect bearing alignment and foundation bolts", "Reduces breakdown probability", "Critical", "Medium", 6800));
  }
  if (m.power > m.baseline * 0.92 && m.load < 70) {
    risk += 15;
    wastage += 28;
    reasons.push("high power at low load");
    recommendations.push(action("Check overload, belts and idle operating practice", "Cuts unnecessary kWh use", "High", "Easy", 5600));
  }
  if (m.idle >= 20) {
    risk += 8;
    wastage += 34;
    reasons.push("long idle runtime");
    recommendations.push(action("Switch off or auto-sleep idle machine", "Stops avoidable electricity loss", "High", "Easy", 3900));
  }
  if (m.temp >= 80 && m.vibration >= 7) {
    risk += 18;
    reasons.push("combined heat and vibration critical pattern");
  }
  if (m.output > 0 && m.power / Math.max(m.output / 100, 1) > 3.2) {
    wastage += 14;
    reasons.push("low output per energy consumed");
  }

  risk = Math.min(98, Math.round(risk));
  health = Math.max(18, Math.round(health - risk * 0.2));
  wastage = Math.min(96, Math.round(wastage + Math.max(0, (m.power - m.rating * 0.55) * 2)));
  const efficiency = health >= 80 ? "A" : health >= 65 ? "B" : health >= 50 ? "C" : "D";
  const priority = risk >= 80 ? "Critical" : risk >= 60 ? "High" : risk >= 35 ? "Medium" : "Low";
  const suggestedDate = new Date(Date.now() + (risk >= 80 ? 2 : risk >= 60 ? 5 : 14) * 86400000).toISOString().slice(0, 10);
  const monthlyEnergy = m.power * m.runtime * 26;
  const wasteCost = Math.round(monthlyEnergy * 9.5 * wastage / 100);
  const carbon = +(monthlyEnergy * 0.82).toFixed(1);

  return {
    health,
    risk,
    wastage,
    efficiency,
    priority,
    suggestedDate,
    reason: reasons.length ? reasons.join(", ") : "stable machine pattern",
    technicianAction: priority === "Critical" ? "Stop during next safe window and inspect bearing, winding, lubrication and load path" : "Schedule preventive inspection and energy audit check",
    possibleDamage: priority === "Critical" ? "Bearing seizure, motor burnout, production stoppage" : "Higher energy bill and progressive wear",
    downtimeAvoided: risk >= 80 ? 6 : risk >= 60 ? 4 : 2,
    monthlyEnergy,
    wasteCost,
    carbon,
    recommendations
  };
}

function action(actionRequired, reason, priority, difficulty, expectedSaving) {
  return { actionRequired, reason, priority, difficulty, expectedSaving };
}

export function mutateMachine(m, tick) {
  const wave = Math.sin((tick + m.rating) / 4);
  const spike = m.name.includes("Packaging") && tick % 13 > 8 ? 1 : 0;
  const idlePulse = m.name.includes("Compressor") && tick % 11 > 7 ? 8 : 0;
  return {
    ...m,
    voltage: Math.round(m.voltage + wave * 3),
    current: +(m.current + wave * 1.9 + spike * 2.2).toFixed(1),
    power: +(m.power + wave * 0.8 + spike * 1.4).toFixed(1),
    temp: +(m.temp + wave * 1.4 + spike * 2.1).toFixed(1),
    vibration: +(m.vibration + wave * 0.22 + spike * 0.45).toFixed(2),
    idle: Math.max(0, Math.round(m.idle + wave * 2 + idlePulse)),
    load: Math.max(35, Math.min(96, Math.round(m.load + wave * 4 - spike * 6))),
    runtime: +(m.runtime + 0.03).toFixed(2),
    output: Math.max(0, Math.round(m.output + (m.output ? 3 + wave * 2 : 0)))
  };
}

export function createAlerts(machine, analysis) {
  const alerts = [];
  const add = (type, severity, reason, actionText, cost) => alerts.push({
    id: `${machine.id}-${type}`,
    machine: machine.name,
    type,
    severity,
    time: new Date().toLocaleTimeString(),
    reason,
    action: actionText,
    cost
  });
  if (machine.temp >= 80) add("Overheating alert", analysis.priority, `${machine.temp} C temperature detected`, "Inspect ventilation, winding and lubrication", Math.round(analysis.wasteCost * 0.18));
  if (machine.vibration >= 7) add("High vibration alert", analysis.priority, `${machine.vibration} mm/s vibration pattern`, "Check bearing and alignment within 48 hours", Math.round(analysis.wasteCost * 0.24));
  if (analysis.wastage >= 45) add("Idle wastage alert", "High", `${analysis.wastage}% idle waste score`, "Enable switch-off discipline or auto relay", Math.round(analysis.wasteCost * 0.31));
  if (analysis.risk >= 80) add("Critical failure warning", "Critical", `${analysis.risk}% failure risk`, analysis.technicianAction, Math.round(analysis.wasteCost * 0.45));
  if (analysis.efficiency === "D") add("Low efficiency alert", "High", "Energy rating dropped to D", "Run energy audit and load balancing check", Math.round(analysis.wasteCost * 0.2));
  return alerts;
}
