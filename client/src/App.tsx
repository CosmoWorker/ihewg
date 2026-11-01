import 'antd/dist/reset.css';
import { useEffect, useState } from 'react';
import { Alert, ConfigProvider, Spin } from 'antd';
import type { EnergyResponse } from './types/energy';
import HeaderBar from './components/HeaderBar';
import KpiScorecards from './components/KpiScorecards';
import GenerationChart from './components/GenerationChart';
import ErrorBarChart from './components/ErrorBarChart';
import SettlementTable from './components/SettlementTable';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export default function App() {
  const [selectedDate, setSelectedDate] = useState('2026-01-15');
  const [data, setData] = useState<EnergyResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch(`${API_BASE}/?date_str=${selectedDate}`)
      .then((res) => {
        if (!res.ok) throw new Error(`API error ${res.status}: ${res.statusText}`);
        return res.json() as Promise<EnergyResponse>;
      })
      .then((json) => {
        setData(json);
      })
      .catch((err: Error) => {
        setError(err.message);
        setData(null);
      })
      .finally(() => setLoading(false));
  }, [selectedDate]);

  return (
    <ConfigProvider
      theme={{
        token: {
          borderRadius: 8,
          colorPrimary: '#2563eb',
        },
      }}
    >
      <div
        style={{
          maxWidth: 1400,
          margin: '0 auto',
          padding: '24px 24px 48px',
          minHeight: '100vh',
          background: '#f5f7fa',
          boxSizing: 'border-box',
        }}
      >
        <HeaderBar
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
          deliveryWindow={data?.delivery_window ?? null}
        />

        {error && (
          <Alert
            type="error"
            message="Failed to load data"
            description={error}
            showIcon
            style={{ marginBottom: 24, borderRadius: 10 }}
          />
        )}

        <Spin spinning={loading} tip="Loading settlement data…" size="large">
          {data && (
            <>
              <KpiScorecards metrics={data.metrics} />
              <GenerationChart series={data.series} />
              <ErrorBarChart series={data.series} />
              <SettlementTable series={data.series} />
            </>
          )}
        </Spin>
      </div>
    </ConfigProvider>
  );
}
