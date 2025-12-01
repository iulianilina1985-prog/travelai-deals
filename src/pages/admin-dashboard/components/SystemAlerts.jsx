import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const SystemAlerts = () => {
  const [alerts, setAlerts] = useState([
    {
      id: 1,
      type: 'error',
      title: 'API Rate Limit Exceeded',
      message: 'Booking.com API has exceeded rate limits. Some searches may be delayed.',
      timestamp: '5 minutes ago',
      severity: 'high',
      resolved: false
    },
    {
      id: 2,
      type: 'warning',
      title: 'High Server Load',
      message: 'Server CPU usage is at 85%. Consider scaling resources.',
      timestamp: '12 minutes ago',
      severity: 'medium',
      resolved: false
    },
    {
      id: 3,
      type: 'info',
      title: 'Scheduled Maintenance',
      message: 'Database maintenance scheduled for tonight at 2:00 AM UTC.',
      timestamp: '1 hour ago',
      severity: 'low',
      resolved: false
    },
    {
      id: 4,
      type: 'success',
      title: 'Backup Completed',
      message: 'Daily database backup completed successfully.',
      timestamp: '2 hours ago',
      severity: 'low',
      resolved: true
    },
    {
      id: 5,
      type: 'warning',
      title: 'Payment Gateway Issue',
      message: 'Stripe webhook delivery failed for 3 transactions. Manual verification needed.',
      timestamp: '3 hours ago',
      severity: 'high',
      resolved: false
    }
  ]);

  const getAlertIcon = (type) => {
    switch (type) {
      case 'error':
        return 'XCircle';
      case 'warning':
        return 'AlertTriangle';
      case 'info':
        return 'Info';
      case 'success':
        return 'CheckCircle';
      default:
        return 'Bell';
    }
  };

  const getAlertColor = (type, severity) => {
    if (type === 'error' || severity === 'high') return 'text-destructive';
    if (type === 'warning' || severity === 'medium') return 'text-warning';
    if (type === 'success') return 'text-success';
    return 'text-primary';
  };

  const getAlertBg = (type, severity) => {
    if (type === 'error' || severity === 'high') return 'bg-destructive/10 border-destructive/20';
    if (type === 'warning' || severity === 'medium') return 'bg-warning/10 border-warning/20';
    if (type === 'success') return 'bg-success/10 border-success/20';
    return 'bg-primary/10 border-primary/20';
  };

  const getSeverityBadge = (severity) => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-medium";
    switch (severity) {
      case 'high':
        return `${baseClasses} bg-destructive/10 text-destructive`;
      case 'medium':
        return `${baseClasses} bg-warning/10 text-warning`;
      case 'low':
        return `${baseClasses} bg-muted text-muted-foreground`;
      default:
        return `${baseClasses} bg-muted text-muted-foreground`;
    }
  };

  const resolveAlert = (alertId) => {
    setAlerts(prev => prev?.map(alert => 
      alert?.id === alertId ? { ...alert, resolved: true } : alert
    ));
  };

  const dismissAlert = (alertId) => {
    setAlerts(prev => prev?.filter(alert => alert?.id !== alertId));
  };

  const activeAlerts = alerts?.filter(alert => !alert?.resolved);
  const resolvedAlerts = alerts?.filter(alert => alert?.resolved);

  return (
    <div className="bg-card border border-border rounded-lg shadow-card">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-semibold text-foreground">System Alerts</h3>
            {activeAlerts?.length > 0 && (
              <span className="bg-destructive text-destructive-foreground text-xs px-2 py-1 rounded-full">
                {activeAlerts?.length} active
              </span>
            )}
          </div>
          <Button variant="outline" size="sm" iconName="Settings">
            Configure
          </Button>
        </div>
      </div>
      <div className="p-6">
        {activeAlerts?.length === 0 && resolvedAlerts?.length === 0 ? (
          <div className="text-center py-8">
            <Icon name="Shield" size={48} className="text-success mx-auto mb-4" />
            <p className="text-muted-foreground">All systems operational</p>
          </div>
        ) : (
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {/* Active Alerts */}
            {activeAlerts?.map((alert) => (
              <div
                key={alert?.id}
                className={`border rounded-lg p-4 ${getAlertBg(alert?.type, alert?.severity)}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 flex-1">
                    <Icon
                      name={getAlertIcon(alert?.type)}
                      size={20}
                      className={getAlertColor(alert?.type, alert?.severity)}
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-foreground">{alert?.title}</h4>
                        <span className={getSeverityBadge(alert?.severity)}>
                          {alert?.severity}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{alert?.message}</p>
                      <p className="text-xs text-muted-foreground">{alert?.timestamp}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => resolveAlert(alert?.id)}
                      iconName="Check"
                    >
                      Resolve
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => dismissAlert(alert?.id)}
                      iconName="X"
                    >
                      Dismiss
                    </Button>
                  </div>
                </div>
              </div>
            ))}

            {/* Resolved Alerts */}
            {resolvedAlerts?.map((alert) => (
              <div
                key={alert?.id}
                className="border border-border rounded-lg p-4 opacity-60"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 flex-1">
                    <Icon
                      name="CheckCircle"
                      size={20}
                      className="text-success"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-foreground line-through">{alert?.title}</h4>
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-success/10 text-success">
                          Resolved
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{alert?.message}</p>
                      <p className="text-xs text-muted-foreground">{alert?.timestamp}</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => dismissAlert(alert?.id)}
                    iconName="X"
                  >
                    Remove
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SystemAlerts;