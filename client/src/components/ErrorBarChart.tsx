import { Card } from 'antd';
import ReactApexChart from 'react-apexcharts';
import type { ApexOptions } from 'apexcharts';
import type { SeriesPoint } from '../types/energy';

interface ErrorBarChartProps {
  series: SeriesPoint[];
}

function formatLabel(isoStr: string): string {
  const d = new Date(isoStr);
  const day = d.getUTCDate().toString().padStart(2, '0');
  const month = d.toLocaleString('en-GB', { month: 'short', timeZone: 'UTC' });
  const hh = d.getUTCHours().toString().padStart(2, '0');
  const mm = d.getUTCMinutes().toString().padStart(2, '0');
  return `${day} ${month} ${hh}:${mm}Z`;
}

export default function ErrorBarChart({ series }: ErrorBarChartProps) {
  const categories = series.map((s) => formatLabel(s.start_time));
  const errorValues = series.map((s) => s.error_mw);

  // Per-bar colors: red for shortfall (error > 0), green for surplus (error <= 0)
  const barColors = errorValues.map((v) => (v > 0 ? '#ef4444' : '#10b981'));

  const chartSeries = [
    {
      name: 'Forecast Error (Forecast − Actual MW)',
      data: errorValues,
    },
  ];

  const options: ApexOptions = {
    chart: {
      id: 'wind-err-bar',
      type: 'bar',
      toolbar: { show: false },
      animations: { enabled: false },
    },
    plotOptions: {
      bar: {
        columnWidth: '75%',
        distributed: true, // required for per-bar coloring
      },
    },
    colors: barColors,
    fill: { opacity: 1 },
    xaxis: {
      categories,
      tickAmount: 12,
      labels: { rotate: -30, style: { fontSize: '11px' } },
    },
    yaxis: {
      title: { text: 'Error MW (Forecast − Actual)' },
      labels: {
        formatter: (v: number) => `${v > 0 ? '+' : ''}${v.toLocaleString(undefined, { maximumFractionDigits: 0 })}`,
      },
    },
    tooltip: {
      y: {
        formatter: (v: number) =>
          `${v > 0 ? '+' : ''}${v.toLocaleString(undefined, { maximumFractionDigits: 1 })} MW`,
      },
    },
    dataLabels: { enabled: false },
    grid: { borderColor: '#e5e7eb' },
    legend: { show: false },
    subtitle: {
      text: 'Red (+MW) = Wind Shortfall (Extra Thermal Procurement Needed) | Green (−MW) = Wind Surplus',
      style: { fontSize: '12px', color: '#6b7280' },
    },
  };

  return (
    <Card
      title="Half-Hourly Forecast Error Diverging Bar Chart"
      style={{ marginBottom: 24, borderRadius: 10 }}
    >
      <ReactApexChart type="bar" series={chartSeries} options={options} height={280} />
    </Card>
  );
}
