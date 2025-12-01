import React from 'react';
import Icon from '../../../components/AppIcon';

const UsageStatsCard = ({ usageStats }) => {
  const getProgressColor = (percentage) => {
    if (percentage >= 90) return 'bg-error';
    if (percentage >= 70) return 'bg-warning';
    return 'bg-primary';
  };

  const getProgressBgColor = (percentage) => {
    if (percentage >= 90) return 'bg-error/10';
    if (percentage >= 70) return 'bg-warning/10';
    return 'bg-primary/10';
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-card">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
          <Icon name="BarChart3" size={20} color="var(--color-primary)" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-foreground">Usage Statistics</h3>
          <p className="text-sm text-muted-foreground">Current billing period</p>
        </div>
      </div>
      <div className="space-y-6">
        {/* Notifications Usage */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-foreground">Saved Notifications</span>
            <span className="text-sm text-muted-foreground">
              {usageStats?.notifications?.used} / {usageStats?.notifications?.limit}
            </span>
          </div>
          <div className={`w-full h-2 rounded-full ${getProgressBgColor(usageStats?.notifications?.percentage)}`}>
            <div 
              className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(usageStats?.notifications?.percentage)}`}
              style={{ width: `${Math.min(usageStats?.notifications?.percentage, 100)}%` }}
            />
          </div>
          {usageStats?.notifications?.percentage >= 80 && (
            <p className="text-xs text-warning mt-1">
              {usageStats?.notifications?.percentage >= 100 ? 'Limit reached' : 'Approaching limit'}
            </p>
          )}
        </div>

        {/* API Calls Usage */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-foreground">API Calls</span>
            <span className="text-sm text-muted-foreground">
              {usageStats?.apiCalls?.used?.toLocaleString()} / {usageStats?.apiCalls?.limit?.toLocaleString()}
            </span>
          </div>
          <div className={`w-full h-2 rounded-full ${getProgressBgColor(usageStats?.apiCalls?.percentage)}`}>
            <div 
              className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(usageStats?.apiCalls?.percentage)}`}
              style={{ width: `${Math.min(usageStats?.apiCalls?.percentage, 100)}%` }}
            />
          </div>
        </div>

        {/* Premium Features Access */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-foreground">Premium Features</span>
            <span className={`text-sm px-2 py-1 rounded-full ${
              usageStats?.premiumAccess 
                ? 'bg-success/10 text-success' :'bg-muted text-muted-foreground'
            }`}>
              {usageStats?.premiumAccess ? 'Active' : 'Locked'}
            </span>
          </div>
          {!usageStats?.premiumAccess && (
            <p className="text-xs text-muted-foreground">
              Upgrade to premium to unlock exclusive features
            </p>
          )}
        </div>
      </div>
      {/* Usage Summary */}
      <div className="mt-6 pt-6 border-t border-border">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-foreground">{usageStats?.totalDealsFound}</div>
            <div className="text-xs text-muted-foreground">Deals Found</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-foreground">{usageStats?.totalSavings}</div>
            <div className="text-xs text-muted-foreground">Total Savings</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UsageStatsCard;