export interface DeliveryWindow {
  delivery_date: string;
  decision_date: string;
  bid_deadline: string;
  publish_from: string;
  publish_to: string;
}

export interface Metrics {
  rmse: number;
  bias: number;
  max_shortfall: number;
  p95_shortfall: number;
}

export interface SeriesPoint {
  start_time: string;
  actual_mw: number;
  forecast_mw: number;
  error_mw: number;
}

export interface EnergyResponse {
  delivery_window: DeliveryWindow;
  metrics: Metrics;
  series: SeriesPoint[];
}

