CREATE TABLE msme_units (
  id UUID PRIMARY KEY,
  unit_name VARCHAR(120) NOT NULL,
  sector VARCHAR(80) NOT NULL,
  city VARCHAR(80),
  tariff_per_kwh NUMERIC(8,2) DEFAULT 9.50,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE users (
  id UUID PRIMARY KEY,
  msme_unit_id UUID REFERENCES msme_units(id),
  role VARCHAR(30) CHECK (role IN ('MSME_OWNER', 'TECHNICIAN', 'ADMIN')),
  email VARCHAR(160) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE machines (
  id UUID PRIMARY KEY,
  msme_unit_id UUID REFERENCES msme_units(id),
  name VARCHAR(120) NOT NULL,
  sector VARCHAR(80),
  rating_kw NUMERIC(8,2),
  baseline_kw NUMERIC(8,2),
  status VARCHAR(20) DEFAULT 'ON',
  monthly_saving_potential NUMERIC(12,2) DEFAULT 0
);

CREATE TABLE sensor_readings (
  id UUID PRIMARY KEY,
  machine_id UUID REFERENCES machines(id),
  voltage NUMERIC(8,2),
  current_amp NUMERIC(8,2),
  power_kw NUMERIC(8,2),
  temperature_c NUMERIC(8,2),
  vibration_mms NUMERIC(8,2),
  idle_minutes INTEGER,
  load_percent NUMERIC(6,2),
  runtime_hours NUMERIC(8,2),
  output_units INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE ai_insights (
  id UUID PRIMARY KEY,
  machine_id UUID REFERENCES machines(id),
  health_score INTEGER,
  failure_risk INTEGER,
  idle_wastage_score INTEGER,
  energy_efficiency_rating CHAR(1),
  maintenance_priority VARCHAR(20),
  reason TEXT,
  suggested_maintenance_date DATE,
  estimated_downtime_avoided_hours NUMERIC(6,2),
  wastage_cost NUMERIC(12,2),
  co2_kg NUMERIC(12,2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE alerts (
  id UUID PRIMARY KEY,
  machine_id UUID REFERENCES machines(id),
  alert_type VARCHAR(80),
  severity VARCHAR(20),
  reason TEXT,
  suggested_action TEXT,
  estimated_cost_impact NUMERIC(12,2),
  status VARCHAR(20) DEFAULT 'OPEN',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE recommendations (
  id UUID PRIMARY KEY,
  machine_id UUID REFERENCES machines(id),
  action_required TEXT,
  reason TEXT,
  expected_saving NUMERIC(12,2),
  difficulty VARCHAR(20),
  priority VARCHAR(20),
  status VARCHAR(20) DEFAULT 'PENDING'
);
