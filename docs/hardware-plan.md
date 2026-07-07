# Future Hardware Integration Plan

## Prototype Kit

- ESP32 controller for Wi-Fi data transmission.
- SCT-013 or equivalent current sensor.
- ZMPT101B voltage sensor.
- DS18B20 or DHT22 temperature sensor.
- SW-420 or industrial vibration sensor module.
- Optional relay module for idle cut-off demonstration.
- Local gateway using Raspberry Pi or low-cost mini PC for poor connectivity areas.

## Data Flow

1. Sensors measure voltage, current, temperature and vibration.
2. ESP32 calculates RMS current, voltage and approximate power.
3. ESP32 sends readings through MQTT or HTTP every 5 to 15 seconds.
4. Backend stores readings and runs AI rules.
5. Dashboard updates machine health, alerts, recommendations and reports.

## Safety Notes

Electrical sensing must be isolated and installed by a trained technician. For hackathon demonstration, use simulated data or low-voltage lab loads. For field deployment, use proper enclosures, fuses, terminal blocks and certified current transformers.

## ML Upgrade Path

- Collect baseline data for each machine for 2 to 4 weeks.
- Train anomaly detection using Isolation Forest, One-Class SVM or LSTM autoencoder.
- Add remaining useful life prediction after enough failure/maintenance records.
- Benchmark energy intensity by sector and machine type.
