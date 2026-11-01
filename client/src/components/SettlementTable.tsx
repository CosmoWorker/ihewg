import { Card, Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { SeriesPoint } from '../types/energy';

interface SettlementTableProps {
  series: SeriesPoint[];
}

interface TableRow extends SeriesPoint {
  period: number;
}

export default function SettlementTable({ series }: SettlementTableProps) {
  const dataSource: TableRow[] = series.map((s, i) => ({ ...s, period: i + 1 }));

  const columns: ColumnsType<TableRow> = [
    {
      title: 'Period',
      dataIndex: 'period',
      key: 'period',
      width: 80,
      sorter: (a, b) => a.period - b.period,
    },
    {
      title: 'Start Time (UTC)',
      dataIndex: 'start_time',
      key: 'start_time',
      render: (v: string) => (
        <span style={{ fontFamily: 'monospace', fontSize: 13 }}>
          {v.replace('T', ' ').replace('Z', ' UTC')}
          {v.endsWith(':30:00Z') && (
            <Tag color="default" style={{ marginLeft: 6, fontSize: 10 }}>
              :30 Interp.
            </Tag>
          )}
        </span>
      ),
    },
    {
      title: 'Forecast (MW)',
      dataIndex: 'forecast_mw',
      key: 'forecast_mw',
      sorter: (a, b) => a.forecast_mw - b.forecast_mw,
      render: (v: number) => v.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 }),
      align: 'right',
    },
    {
      title: 'Actual (MW)',
      dataIndex: 'actual_mw',
      key: 'actual_mw',
      sorter: (a, b) => a.actual_mw - b.actual_mw,
      render: (v: number) => v.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 }),
      align: 'right',
    },
    {
      title: 'Error (Forecast − Actual) MW',
      dataIndex: 'error_mw',
      key: 'error_mw',
      sorter: (a, b) => a.error_mw - b.error_mw,
      defaultSortOrder: undefined,
      align: 'right',
      render: (v: number) => (
        <span style={{ color: v > 0 ? '#ef4444' : v < 0 ? '#10b981' : '#374151', fontWeight: 600 }}>
          {v > 0 ? '+' : ''}{v.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}
        </span>
      ),
    },
    {
      title: 'Market Impact',
      key: 'impact',
      width: 200,
      render: (_, row) =>
        row.error_mw > 0 ? (
          <Tag color="volcano">Shortfall (Buy Thermal)</Tag>
        ) : row.error_mw < 0 ? (
          <Tag color="green">Surplus Wind</Tag>
        ) : (
          <Tag>Balanced</Tag>
        ),
    },
  ];

  return (
    <Card title="48 Half-Hourly Settlement Periods Breakdown" style={{ borderRadius: 10 }}>
      <Table<TableRow>
        dataSource={dataSource}
        columns={columns}
        rowKey="period"
        size="small"
        pagination={{ pageSize: 16, showSizeChanger: false }}
        scroll={{ x: 'max-content' }}
      />
    </Card>
  );
}

