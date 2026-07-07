export function analyzeMachine(machine) {
  const reasons = [];
  const recommendations = [];
  let risk = 10;
  let health = 96;
  let wastage = 0;

  const addRecommendation = (actionRequired, reason, priority, difficulty, expectedSaving) => {
    recommendations.push({ actionRequired, reason, priority, difficulty, expectedSaving });
  };

  if (machine.temperature >= 80) {
    risk += 28;
    health -= 20;
    reasons.push("high temperature");
    addRecommendation("Improve ventilation and inspect motor winding", "High temperature can damage insulation and bearings", "High", "Medium", 4200);
  }
  if (machine.vibration >= 7) {
    risk += 32;
    health -= 24;
    reasons.push("high vibration");
    addRecommendation("Inspect bearing alignment and foundation bolts", "Vibration indicates mechanical wear or looseness", "Critical", "Medium", 6800);
  }
  if (machine.powerKw > machine.baselineKw * 0.92 && machine.loadPercent < 70) {
    risk += 15;
    wastage += 28;
    reasons.push("high power with low output/load");
    addRecommendation("Check overload, belts and operating practice", "Machine is consuming power without proportional output", "High", "Easy", 5600);
  }
  if (machine.idleMinutes >= 20) {
    risk += 8;
    wastage += 34;
    reasons.push("long idle runtime");
    addRecommendation("Switch off idle machine or add auto cut-off relay", "Idle power is direct avoidable cost", "High", "Easy", 3900);
  }
  if (machine.temperature >= 80 && machine.vibration >= 7) {
    risk += 18;
    reasons.push("combined overheating and vibration");
  }

  risk = Math.min(98, Math.round(risk));
  health = Math.max(18, Math.round(health - risk * 0.2));
  wastage = Math.min(96, Math.round(wastage + Math.max(0, (machine.powerKw - machine.ratingKw * 0.55) * 2)));
  const priority = risk >= 80 ? "Critical" : risk >= 60 ? "High" : risk >= 35 ? "Medium" : "Low";
  const energyRating = health >= 80 ? "A" : health >= 65 ? "B" : health >= 50 ? "C" : "D";
  const suggestedMaintenanceDate = new Date(Date.now() + (risk >= 80 ? 2 : risk >= 60 ? 5 : 14) * 86400000).toISOString().slice(0, 10);
  const monthlyEnergyKwh = +(machine.powerKw * machine.runtimeHours * 26).toFixed(2);
  const wastageCost = Math.round(monthlyEnergyKwh * 9.5 * wastage / 100);

  return {
    healthScore: health,
    failureRisk: risk,
    idleWastageScore: wastage,
    energyEfficiencyRating: energyRating,
    maintenancePriority: priority,
    suggestedMaintenanceDate,
    reason: reasons.length ? reasons.join(", ") : "stable machine pattern",
    technicianAction: priority === "Critical" ? "Inspect bearing, winding, lubrication and load path within 48 hours" : "Schedule preventive inspection",
    possibleDamageIfIgnored: priority === "Critical" ? "Bearing seizure, motor burnout and production stoppage" : "Higher power bill and progressive machine wear",
    estimatedDowntimeAvoidedHours: risk >= 80 ? 6 : risk >= 60 ? 4 : 2,
    monthlyEnergyKwh,
    wastageCost,
    co2Kg: +(monthlyEnergyKwh * 0.82).toFixed(2),
    recommendations
  };
}

export function createAlerts(machine, ai) {
  const alerts = [];
  const add = (type, severity, reason, suggestedAction, estimatedCostImpact) => {
    alerts.push({ machineId: machine.id, machineName: machine.name, type, severity, reason, suggestedAction, estimatedCostImpact, createdAt: new Date().toISOString() });
  };

  if (machine.temperature >= 80) add("Overheating alert", ai.maintenancePriority, `${machine.temperature} C temperature`, "Inspect ventilation, winding and lubrication", Math.round(ai.wastageCost * 0.18));
  if (machine.vibration >= 7) add("High vibration alert", ai.maintenancePriority, `${machine.vibration} mm/s vibration`, "Check bearing alignment within 48 hours", Math.round(ai.wastageCost * 0.24));
  if (ai.idleWastageScore >= 45) add("Idle wastage alert", "High", `${ai.idleWastageScore}% idle waste score`, "Enable switch-off discipline or auto relay", Math.round(ai.wastageCost * 0.31));
  if (ai.failureRisk >= 80) add("Critical failure warning", "Critical", `${ai.failureRisk}% failure risk`, ai.technicianAction, Math.round(ai.wastageCost * 0.45));
  if (ai.energyEfficiencyRating === "D") add("Low efficiency alert", "High", "Energy rating D", "Run energy audit and load balancing check", Math.round(ai.wastageCost * 0.2));
  return alerts;
}
