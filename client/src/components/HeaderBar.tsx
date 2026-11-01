import { Card, DatePicker, Tag, Typography, Space, Flex } from 'antd';
import { ThunderboltOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import type { DeliveryWindow } from '../types/energy';

const { Title, Text } = Typography;

interface HeaderBarProps {
  selectedDate: string;
  onDateChange: (date: string) => void;
  deliveryWindow: DeliveryWindow | null;
}

export default function HeaderBar({ selectedDate, onDateChange, deliveryWindow }: HeaderBarProps) {
  return (
    <Card
      style={{ marginBottom: 24, background: 'linear-gradient(135deg, #1e3a5f 0%, #0f2942 100%)', borderRadius: 12, border: 'none' }}
      styles={{ body: { padding: '20px 28px' } }}
    >
      <Flex wrap gap={24} align="center" justify="space-between">
        {/* Title */}
        <Space direction="vertical" size={2}>
          <Space align="center" size={10}>
            <ThunderboltOutlined style={{ fontSize: 26, color: '#60a5fa' }} />
            <Title level={4} style={{ margin: 0, color: '#f0f9ff', letterSpacing: '-0.3px' }}>
              UK Day-Ahead Wind Power Generation Visualizer
            </Title>
          </Space>
        </Space>

        {/* Controls */}
        <Flex wrap gap={16} align="center">
          <Space direction="vertical" size={2}>
            <Text style={{ color: '#bfdbfe', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.8px' }}>
              Delivery Date (D)
            </Text>
            <DatePicker
              value={dayjs(selectedDate)}
              minDate={dayjs('2026-01-01')}
              maxDate={dayjs('2026-01-31')}
              format="YYYY-MM-DD"
              allowClear={false}
              onChange={(d) => d && onDateChange(d.format('YYYY-MM-DD'))}
              style={{ width: 150 }}
            />
          </Space>

          {deliveryWindow && (
            <>
              <Space direction="vertical" size={4}>
                <Text style={{ color: '#bfdbfe', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.8px' }}>
                  Bid Gate Closure (D-1)
                </Text>
                <Tag color="blue" style={{ fontSize: 13, padding: '4px 10px', margin: 0 }}>
                  {deliveryWindow.decision_date} 11:00 UTC
                </Tag>
              </Space>
              <Space direction="vertical" size={4}>
                <Text style={{ color: '#bfdbfe', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.8px' }}>
                  Settlement Window
                </Text>
                <Tag color="geekblue" style={{ fontSize: 12, padding: '4px 10px', margin: 0 }}>
                  {deliveryWindow.decision_date} 23:00 → {deliveryWindow.delivery_date} 22:30 UTC &nbsp;·&nbsp; 48 × 30 min
                </Tag>
              </Space>
            </>
          )}
        </Flex>
      </Flex>
    </Card>
  );
}

