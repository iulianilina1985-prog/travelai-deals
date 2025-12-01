import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ApiMonitoring = () => {
  const [selectedTimeRange, setSelectedTimeRange] = useState('24h');

  const apiData = [
    { time: '00:00', requests: 245, errors: 2, responseTime: 120 },
    { time: '04:00', requests: 180, errors: 1, responseTime: 95 },
    { time: '08:00', requests: 420, errors: 5, responseTime: 150 },
    { time: '12:00', requests: 680, errors: 8, responseTime: 180 },
    { time: '16:00', requests: 590, errors: 3, responseTime: 140 },
    { time: '20:00', requests: 380, errors: 2, responseTime: 110 }
  ];

  const apiServices = [
    {
      name: 'Booking.com API',
      status: 'operational',
      requests: '12,450',
      errors: '23',
      uptime: '99.8%',
      responseTime: '145ms',
      lastCheck: '2 min ago'
    },
    {
      name: 'Expedia API',
      status: 'operational',
      requests: '8,920',
      errors: '12',
      uptime: '99.9%',
      responseTime: '98ms',
      lastCheck: '1 min ago'
    },
    {
      name: 'Skyscanner API',
      status: 'degraded',
      requests: '6,780',
      errors: '45',
      uptime: '97.2%',
      responseTime: '320ms',
      lastCheck: '30 sec ago'
    },
    {
      name: 'Hotels.com API',
      status: 'operational',
      requests: '4,560',
      errors: '8',
      uptime: '99.5%',
      responseTime: '125ms',
      lastCheck: '1 min ago'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'operational':
        return 'text-success';
      case 'degraded':
        return 'text-warning';
      case 'down':
        return 'text-destructive';
      default:
        return 'text-muted-foreground';
    }
  };

  const getStatusBg = (status) => {
    switch (status) {
      case 'operational':
        return 'bg-success/10';
      case 'degraded':
        return 'bg-warning/10';
      case 'down':
        return 'bg-destructive/10';
      default:
        return 'bg-muted/10';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'operational':
        return 'CheckCircle';
      case 'degraded':
        return 'AlertTriangle';
      case 'down':
        return 'XCircle';
      default:
        return 'Clock';
    }
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload?.length) {
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-elevated">
          <p className="font-medium text-foreground mb-2">{label}</p>
          {payload?.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry?.color }}>
              {entry?.name}: {entry?.value}
              {entry?.dataKey === 'responseTime' ? 'ms' : ''}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-card border border-border rounded-lg shadow-card">
      <div className="p-6 border-b border-border">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-foreground">API Monitoring</h3>
            <p className="text-sm text-muted-foreground">Real-time API performance and status</p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant={selectedTimeRange === '1h' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedTimeRange('1h')}
            >
              1H
            </Button>
            <Button
              variant={selectedTimeRange === '24h' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedTimeRange('24h')}
            >
              24H
            </Button>
            <Button
              variant={selectedTimeRange === '7d' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedTimeRange('7d')}
            >
              7D
            </Button>
          </div>
        </div>
      </div>
      <div className="p-6">
        {/* API Services Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {apiServices?.map((service, index) => (
            <div key={index} className="border border-border rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Icon
                    name={getStatusIcon(service?.status)}
                    size={16}
                    className={getStatusColor(service?.status)}
                  />
                  <h4 className="font-medium text-foreground">{service?.name}</h4>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBg(service?.status)} ${getStatusColor(service?.status)}`}>
                  {service?.status}
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Requests</p>
                  <p className="font-medium text-foreground">{service?.requests}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Errors</p>
                  <p className="font-medium text-foreground">{service?.errors}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Uptime</p>
                  <p className="font-medium text-foreground">{service?.uptime}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Response</p>
                  <p className="font-medium text-foreground">{service?.responseTime}</p>
                </div>
              </div>
              
              <p className="text-xs text-muted-foreground mt-2">Last check: {service?.lastCheck}</p>
            </div>
          ))}
        </div>

        {/* Performance Chart */}
        <div className="border border-border rounded-lg p-4">
          <h4 className="font-medium text-foreground mb-4">API Performance Metrics</h4>
          <div className="h-64" aria-label="API Performance Chart">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={apiData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis 
                  dataKey="time" 
                  stroke="var(--color-muted-foreground)"
                  fontSize={12}
                />
                <YAxis 
                  stroke="var(--color-muted-foreground)"
                  fontSize={12}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line 
                  type="monotone" 
                  dataKey="requests" 
                  stroke="var(--color-primary)" 
                  strokeWidth={2}
                  name="Requests"
                />
                <Line 
                  type="monotone" 
                  dataKey="errors" 
                  stroke="var(--color-destructive)" 
                  strokeWidth={2}
                  name="Errors"
                />
                <Line 
                  type="monotone" 
                  dataKey="responseTime" 
                  stroke="var(--color-warning)" 
                  strokeWidth={2}
                  name="Response Time"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-2 mt-4">
          <Button variant="outline" size="sm" iconName="RefreshCw">
            Refresh Status
          </Button>
          <Button variant="outline" size="sm" iconName="Settings">
            Configure APIs
          </Button>
          <Button variant="outline" size="sm" iconName="Download">
            Export Report
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ApiMonitoring;