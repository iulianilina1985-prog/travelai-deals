import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const SavedSearchCard = ({ search, onEdit, onDelete, onToggleMonitoring }) => {
  const formatDate = (dateString) => {
    return new Date(dateString)?.toLocaleDateString('ro-RO', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'text-success';
      case 'paused':
        return 'text-warning';
      case 'expired':
        return 'text-destructive';
      default:
        return 'text-muted-foreground';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active':
        return 'Play';
      case 'paused':
        return 'Pause';
      case 'expired':
        return 'AlertCircle';
      default:
        return 'Clock';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'active':
        return 'Activ';
      case 'paused':
        return 'Pauzat';
      case 'expired':
        return 'Expirat';
      default:
        return 'Necunoscut';
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4 hover:shadow-elevated transition-all duration-200">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="font-semibold text-foreground mb-1">
            {search?.destination}
          </h3>
          <p className="text-sm text-muted-foreground">
            {search?.description}
          </p>
        </div>
        <div className={`flex items-center gap-1 ${getStatusColor(search?.status)}`}>
          <Icon name={getStatusIcon(search?.status)} size={16} />
          <span className="text-sm font-medium">
            {getStatusText(search?.status)}
          </span>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Icon name="Calendar" size={14} />
            <span>{formatDate(search?.departureDate)} - {formatDate(search?.returnDate)}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Icon name="Users" size={14} />
            <span>{search?.travelers} persoane</span>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Icon name="Euro" size={14} />
            <span>Max {search?.maxBudget}€</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Icon name="RefreshCw" size={14} />
            <span>Ultima verificare: {formatDate(search?.lastChecked)}</span>
          </div>
        </div>
      </div>
      {search?.foundDeals > 0 && (
        <div className="bg-muted rounded-md p-3 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Icon name="Gift" size={16} className="text-success" />
              <span className="text-sm font-medium">
                {search?.foundDeals} oferte găsite
              </span>
            </div>
            {search?.newDeals > 0 && (
              <span className="bg-success text-success-foreground px-2 py-1 rounded-md text-xs font-medium">
                {search?.newDeals} noi
              </span>
            )}
          </div>
        </div>
      )}
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(search)}
          >
            <Icon name="Edit2" size={14} className="mr-1" />
            Editează
          </Button>
          <Button
            variant={search?.status === 'active' ? 'secondary' : 'default'}
            size="sm"
            onClick={() => onToggleMonitoring(search?.id)}
          >
            <Icon 
              name={search?.status === 'active' ? 'Pause' : 'Play'} 
              size={14} 
              className="mr-1" 
            />
            {search?.status === 'active' ? 'Pauzează' : 'Activează'}
          </Button>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDelete(search?.id)}
          className="text-destructive hover:text-destructive"
        >
          <Icon name="Trash2" size={14} />
        </Button>
      </div>
    </div>
  );
};

export default SavedSearchCard;