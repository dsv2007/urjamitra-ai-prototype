# API Routes

Base URL: `http://127.0.0.1:4000`

| Method | Route | Purpose |
|---|---|---|
| GET | `/api/health` | Backend health check |
| GET | `/api/machines` | Live machine readings plus AI insight and alerts |
| GET | `/api/machines/:id` | Single AI Energy Twin |
| GET | `/api/alerts` | Overheating, vibration, power spike, idle and critical alerts |
| GET | `/api/recommendations` | Energy saving and maintenance recommendations |
| GET | `/api/reports/summary` | MSME owner summary report |
| POST | `/api/roi` | Payback and ROI calculation |

Future production routes:

- `POST /api/machines` to add machine
- `PATCH /api/machines/:id` to edit machine
- `DELETE /api/machines/:id` to delete machine
- `POST /api/auth/login` for role login
- `GET /api/reports/monthly` for downloadable reports
