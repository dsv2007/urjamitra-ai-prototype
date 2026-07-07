# Block Diagram

```mermaid
flowchart TD
  A["MSME Machine"] --> B["Sensor Unit"]
  B --> C["IoT Controller"]
  C --> D["Data Transmission"]
  D --> E["Cloud / Local Database"]
  E --> F["AI Energy Twin Engine"]
  F --> G["Fault Prediction + Energy Analysis"]
  G --> H["Dashboard + Alerts + Reports"]
  H --> I["MSME Owner / Technician Action"]
```

## Explanation

The machine is connected to a low-cost sensor unit that measures electrical and health parameters. The IoT controller collects readings and sends them to either a cloud server or a local gateway. The database stores machine-wise time-series data. The AI Energy Twin engine compares live readings against expected patterns and generates failure risk, idle wastage, efficiency rating, savings and carbon estimates. The dashboard converts the analysis into alerts, recommendations, reports and technician actions.
