export const tariff = 9.5;

export const machines = [
  { id: "m1", name: "Textile Motor Unit", sector: "Textile", rating: 18, voltage: 415, current: 31, power: 13.9, temp: 61, vibration: 4.2, status: "ON", idle: 12, load: 74, runtime: 8.4, output: 1180, baseline: 16.2, saving: 11800 },
  { id: "m2", name: "CNC Cutting Machine", sector: "Metal Works", rating: 24, voltage: 415, current: 42, power: 20.1, temp: 68, vibration: 5.1, status: "ON", idle: 8, load: 81, runtime: 7.2, output: 390, baseline: 23.2, saving: 14600 },
  { id: "m3", name: "Welding Machine", sector: "Fabrication", rating: 16, voltage: 230, current: 49, power: 11.3, temp: 73, vibration: 3.8, status: "ON", idle: 26, load: 57, runtime: 6.5, output: 82, baseline: 13.1, saving: 9200 },
  { id: "m4", name: "Packaging Machine", sector: "Food Processing", rating: 12, voltage: 230, current: 35, power: 8.4, temp: 84, vibration: 8.7, status: "ON", idle: 17, load: 65, runtime: 9.1, output: 760, baseline: 9.7, saving: 16800 },
  { id: "m5", name: "Cooling Compressor", sector: "Cold Storage", rating: 30, voltage: 415, current: 51, power: 24.6, temp: 77, vibration: 6.3, status: "ON", idle: 35, load: 70, runtime: 11.6, output: 0, baseline: 28.5, saving: 22100 },
  { id: "m6", name: "Rice Mill Motor", sector: "Agro MSME", rating: 22, voltage: 415, current: 39, power: 17.2, temp: 64, vibration: 5.5, status: "ON", idle: 10, load: 78, runtime: 7.8, output: 2400, baseline: 19.1, saving: 13300 },
  { id: "m7", name: "Injection Moulding Machine", sector: "Plastic", rating: 28, voltage: 415, current: 54, power: 25.8, temp: 88, vibration: 7.4, status: "ON", idle: 22, load: 68, runtime: 10.2, output: 520, baseline: 29.6, saving: 26400 }
];

export const roles = {
  owner: { email: "owner@urjamitra.demo", password: "owner123", label: "MSME Owner" },
  technician: { email: "tech@urjamitra.demo", password: "tech123", label: "Technician" },
  admin: { email: "admin@urjamitra.demo", password: "admin123", label: "Admin" }
};
