export const machines = [
  { id: "m1", name: "Textile Motor Unit", sector: "Textile", ratingKw: 18, voltage: 415, current: 31, powerKw: 13.9, temperature: 61, vibration: 4.2, status: "ON", idleMinutes: 12, loadPercent: 74, runtimeHours: 8.4, outputUnits: 1180, baselineKw: 16.2 },
  { id: "m2", name: "CNC Cutting Machine", sector: "Metal Works", ratingKw: 24, voltage: 415, current: 42, powerKw: 20.1, temperature: 68, vibration: 5.1, status: "ON", idleMinutes: 8, loadPercent: 81, runtimeHours: 7.2, outputUnits: 390, baselineKw: 23.2 },
  { id: "m3", name: "Welding Machine", sector: "Fabrication", ratingKw: 16, voltage: 230, current: 49, powerKw: 11.3, temperature: 73, vibration: 3.8, status: "ON", idleMinutes: 26, loadPercent: 57, runtimeHours: 6.5, outputUnits: 82, baselineKw: 13.1 },
  { id: "m4", name: "Packaging Machine", sector: "Food Processing", ratingKw: 12, voltage: 230, current: 35, powerKw: 8.4, temperature: 84, vibration: 8.7, status: "ON", idleMinutes: 17, loadPercent: 65, runtimeHours: 9.1, outputUnits: 760, baselineKw: 9.7 },
  { id: "m5", name: "Cooling Compressor", sector: "Cold Storage", ratingKw: 30, voltage: 415, current: 51, powerKw: 24.6, temperature: 77, vibration: 6.3, status: "ON", idleMinutes: 35, loadPercent: 70, runtimeHours: 11.6, outputUnits: 0, baselineKw: 28.5 },
  { id: "m6", name: "Rice Mill Motor", sector: "Agro MSME", ratingKw: 22, voltage: 415, current: 39, powerKw: 17.2, temperature: 64, vibration: 5.5, status: "ON", idleMinutes: 10, loadPercent: 78, runtimeHours: 7.8, outputUnits: 2400, baselineKw: 19.1 },
  { id: "m7", name: "Injection Moulding Machine", sector: "Plastic", ratingKw: 28, voltage: 415, current: 54, powerKw: 25.8, temperature: 88, vibration: 7.4, status: "ON", idleMinutes: 22, loadPercent: 68, runtimeHours: 10.2, outputUnits: 520, baselineKw: 29.6 }
];

export function nextReading(machine, tick) {
  const wave = Math.sin((tick + machine.ratingKw) / 4);
  const spike = machine.name.includes("Packaging") && tick % 13 > 8 ? 1 : 0;
  return {
    ...machine,
    voltage: Math.round(machine.voltage + wave * 3),
    current: +(machine.current + wave * 1.9 + spike * 2.2).toFixed(1),
    powerKw: +(machine.powerKw + wave * 0.8 + spike * 1.4).toFixed(1),
    temperature: +(machine.temperature + wave * 1.4 + spike * 2.1).toFixed(1),
    vibration: +(machine.vibration + wave * 0.22 + spike * 0.45).toFixed(2),
    idleMinutes: Math.max(0, Math.round(machine.idleMinutes + wave * 2)),
    loadPercent: Math.max(35, Math.min(96, Math.round(machine.loadPercent + wave * 4 - spike * 6))),
    runtimeHours: +(machine.runtimeHours + 0.03).toFixed(2),
    outputUnits: Math.max(0, Math.round(machine.outputUnits + (machine.outputUnits ? 3 + wave * 2 : 0)))
  };
}
