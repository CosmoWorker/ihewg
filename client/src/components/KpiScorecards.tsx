import { Card, Col, Row, Statistic, Tag } from 'antd';
import type { Metrics } from '../types/energy';

interface KpiScorecardsProps {
  metrics: Metrics;
}

export default function KpiScorecards({ metrics }: KpiScorecardsProps) {
  if (!metrics) return null;
  const biasTag =
    metrics.bias > 0 ? (
      <Tag color="error">Over-forecasted (Shortfall Risk)</Tag>
    ) : metrics.bias < 0 ? (
      <Tag color="success">Under-forecasted (Surplus Wind)</Tag>
    ) : (
      <Tag>Unbiased</Tag>
    );

  const biasValue = metrics.bias > 0 ? `+${metrics.bias.toFixed(1)}` : metrics.bias.toFixed(1);

  return (
    <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
      {/* RMSE */}
      <Col xs={24} sm={12} lg={6}>
        <Card bordered style={{ borderRadius: 10, height: '100%' }}>
          <Statistic
            title="RMSE (Root Mean Square Error)"
            value={metrics.rmse.toFixed(2)}
            suffix="MW"
            valueStyle={{ color: '#343536ff' }}
          />
          <div style={{ marginTop: 8, fontSize: 12, color: '#6b7280' }}>
            Penalizes large half-hourly forecast deviations
          </div>
        </Card>
      </Col>

      {/* Mean Bias */}
      <Col xs={24} sm={12} lg={6}>
        <Card bordered style={{ borderRadius: 10, height: '100%' }}>
          <Statistic
            title="Mean Forecast Bias (Forecast − Actual)"
            value={biasValue}
            suffix="MW"
            valueStyle={{ color: metrics.bias > 0 ? '#ef4444' : metrics.bias < 0 ? '#10b981' : '#374151' }}
          />
          <div style={{ marginTop: 8 }}>{biasTag}</div>
        </Card>
      </Col>

      {/* Max Shortfall */}
      <Col xs={24} sm={12} lg={6}>
        <Card bordered style={{ borderRadius: 10, height: '100%' }}>
          <Statistic
            title="Peak Wind Shortfall (Max Thermal Backup)"
            value={metrics.max_shortfall.toFixed(2)}
            suffix="MW"
            valueStyle={{ color: metrics.max_shortfall > 0 ? '#2b2826ff' : '#374151' }}
          />
          <div style={{ marginTop: 8, fontSize: 12, color: '#6b7280' }}>
            Worst single 30-min wind deficit (max Forecast &gt; Actual)
          </div>
        </Card>
      </Col>

      {/* P95 Shortfall */}
      <Col xs={24} sm={12} lg={6}>
        <Card bordered style={{ borderRadius: 10, height: '100%' }}>
          <Statistic
            title="P95 Shortfall / Absolute Error"
            value={metrics.p95_shortfall.toFixed(2)}
            suffix="MW"
            valueStyle={{ color: metrics.p95_shortfall > 0 ? '#5e3b99ff' : '#374151' }}
          />
          <div style={{ marginTop: 8, fontSize: 12, color: '#6b7280' }}>
            95th-percentile half-hourly shortfall — worst realistic case
          </div>
        </Card>
      </Col>
    </Row>
  );
}

