# UrjaMitra AI

AI-Powered Energy Twin and Machine Health Intelligence Platform for MSMEs.

Tagline: **Turning MSME machines into intelligent energy-saving assets.**

## What This Prototype Shows

- AI Energy Twin dashboard for MSME machines.
- Live simulated IoT sensor data.
- Rule-based AI fault detection.
- Predictive maintenance intelligence.
- Energy-saving recommendation engine.
- Cost saving and ROI calculator.
- Green impact and CO2 estimate.
- Alert cards and reports.
- Owner, technician and admin role views.
- Backend API, database schema and hardware integration plan.
- MSME Idea Hackathon 6.0 compliance page and checklist.

## Folder Structure

```text
urjamitra-ai-prototype/
  frontend/
    index.html
    package.json
    src/
      App.jsx
      aiEngine.js
      data.js
      styles.css
  backend/
    package.json
    server.js
    src/
      aiEngine.js
      simulator.js
  database/
    schema.sql
    mongodb-schema.json
    sample-sensor-data.json
  docs/
    api-routes.md
    block-diagram.md
    concept-note.md
    hackathon-compliance-checklist.md
    hardware-plan.md
    pitch-script.md
    presentation-outline.md
    strict-judge-review.md
  package.json
  README.md
```

## Installation

Requirements:

- Node.js 18 or newer
- npm

Install dependencies:

```bash
npm install
npm run install:all
```

Run frontend and backend together:

```bash
npm run dev
```

Run separately:

```bash
npm run dev --prefix backend
npm run dev --prefix frontend
```

Frontend URL:

```text
http://127.0.0.1:5173
```

Backend URL:

```text
http://127.0.0.1:4000
```

## Demo Credentials

| Role | Email | Password |
|---|---|---|
| MSME Owner | `owner@urjamitra.demo` | `owner123` |
| Technician | `tech@urjamitra.demo` | `tech123` |
| Admin | `admin@urjamitra.demo` | `admin123` |

The prototype uses role buttons for fast demo login.

## Demo Flow

1. Open the landing page.
2. Click **View Live Dashboard**.
3. Show total machines, monthly energy cost, savings, alerts and green impact.
4. Open **Monitoring** to show live sensor simulation.
5. Open **Energy Twin** to show machine-wise digital twin cards.
6. Open **Machine Detail** for Packaging Machine or Injection Moulding Machine.
7. Explain AI-detected high vibration and temperature.
8. Open **Recommendations** for saving actions.
9. Open **ROI Calculator** to show payback period.
10. Open **Reports** and **Green Impact** for owner-ready reporting.
11. Open **Hackathon Compliance** to show direct alignment with the official instructions.

## Sample Machines

- Textile Motor Unit
- CNC Cutting Machine
- Welding Machine
- Packaging Machine
- Cooling Compressor
- Rice Mill Motor
- Injection Moulding Machine

## AI Rules Implemented

- High temperature creates overheating warning.
- High vibration creates maintenance alert.
- High power with low output/load creates energy wastage alert.
- Long idle runtime creates avoidable electricity loss alert.
- Temperature plus vibration creates critical failure risk.
- Low health score creates low efficiency warning.

## Business Model

- One-time IoT kit installation: Rs 18,000 to Rs 35,000 per machine cluster.
- Monthly dashboard subscription: Rs 1,999 to Rs 6,999.
- Maintenance support plan.
- Energy audit report service.
- Sector-specific customization.

## Why Judges Should Select This

UrjaMitra AI solves a real MSME pain point: invisible energy wastage and unplanned machine breakdown. It reduces cost, improves productivity, supports green manufacturing, uses frontier technologies, is prototype-ready and can scale across MSME sectors. It also aligns with Atmanirbhar Bharat and Viksit Bharat by enabling affordable modernization of existing Indian manufacturing units.

## Official Participation Requirements Covered

- Submission window noted: 27 June 2026 to 14 July 2026.
- Indian citizen above 18 years eligibility reminder.
- Student ID valid for FY 2026-27 and government age proof reminder.
- One Host Institute and no duplicate submission reminder.
- Working prototype/proof-of-concept intent.
- No identity-revealing information in concept note or block diagram.
- No research paper, newspaper, individual or firm references in concept note or block diagram.
