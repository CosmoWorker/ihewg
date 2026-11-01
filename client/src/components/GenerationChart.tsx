import { Card } from 'antd';
import ReactApexChart from 'react-apexcharts';
import type { ApexOptions } from 'apexcharts';
import type { SeriesPoint } from '../types/energy';

interface GenerationChartProps {
  series: SeriesPoint[];
}

function formatLabel(isoStr: string): string {
  // "2026-01-14T23:00:00Z" → "14 Jan 23:00Z"
  const d = new Date(isoStr);
  const day = d.getUTCDate().toString().padStart(2, '0');
  const month = d.toLocaleString('en-GB', { month: 'short', timeZone: 'UTC' });
  const hh = d.getUTCHours().toString().padStart(2, '0');
  const mm = d.getUTCMinutes().toString().padStart(2, '0');
  return `${day} ${month} ${hh}:${mm}Z`;
}

export default function GenerationChart({ series }: GenerationChartProps) {
  const categories = series.map((s) => formatLabel(s.start_time));

  const chartSeries = [
    { name: 'Day-Ahead Forecast (MW)', data: series.map((s) => s.forecast_mw) },
    { name: 'Actual Metered Generation (MW)', data: series.map((s) => s.actual_mw) },
  ];

  const options: ApexOptions = {
    chart: {
      id: 'wind-gen-line',
      type: 'line',
      toolbar: { show: true },
      animations: { enabled: false },
      zoom: { enabled: true },
    },
    colors: ['#2563eb', '#10b981'],
    stroke: { width: [3, 3], curve: 'straight' },
    xaxis: {
      categories,
      tickAmount: 12,
      labels: { rotate: -30, style: { fontSize: '11px' } },
    },
    yaxis: {
      title: { text: 'Wind Generation (MW)' },
      labels: { formatter: (v: number) => v.toLocaleString() },
    },
    tooltip: {
      shared: true,
      intersect: false,
      y: { formatter: (v: number) => `${v.toLocaleString()} MW` },
    },
    legend: { position: 'top' },
    grid: { borderColor: '#e5e7eb' },
    markers: { size: 0 },
    dataLabels: { enabled: false },
  };

  return (
    <Card
      title="Wind Generation: Day-Ahead Forecast vs. Actual Metered Output"
      style={{ marginBottom: 16, borderRadius: 10 }}
    >
      <ReactApexChart type="line" series={chartSeries} options={options} height={360} />
    </Card>
  );
}

