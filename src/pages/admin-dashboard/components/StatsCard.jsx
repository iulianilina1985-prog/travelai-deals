import React from 'react';
import Icon from '../../../components/AppIcon';

const StatsCard = ({ title, value, icon }) => {
  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-card hover:shadow-elevated transition-all duration-200">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
          <p className="text-2xl font-bold text-foreground">
            {value !== undefined && value !== null ? value : '0'}
          </p>
        </div>

        <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-primary">
          <Icon name={icon} size={24} color="white" />
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
