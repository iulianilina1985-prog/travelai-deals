import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const SubscriptionBanner = ({ userPlan, notificationCount, maxNotifications }) => {
  const isFreePlan = userPlan === 'free';
  const isNearLimit = notificationCount >= maxNotifications * 0.8;
  const isAtLimit = notificationCount >= maxNotifications;

  if (!isFreePlan) return null;

  return (
    <div className={`rounded-lg p-4 mb-6 ${
      isAtLimit 
        ? 'bg-destructive/10 border border-destructive/20' 
        : isNearLimit 
        ? 'bg-warning/10 border border-warning/20' :'bg-primary/10 border border-primary/20'
    }`}>
      <div className="flex items-start gap-4">
        <div className={`p-2 rounded-lg ${
          isAtLimit 
            ? 'bg-destructive/20' 
            : isNearLimit 
            ? 'bg-warning/20' :'bg-primary/20'
        }`}>
          <Icon 
            name={isAtLimit ? 'AlertTriangle' : isNearLimit ? 'AlertCircle' : 'Crown'} 
            size={24} 
            className={
              isAtLimit 
                ? 'text-destructive' 
                : isNearLimit 
                ? 'text-warning' :'text-primary'
            }
          />
        </div>
        
        <div className="flex-1">
          <h3 className="font-semibold text-foreground mb-1">
            {isAtLimit 
              ? 'Ai atins limita de notificări'
              : isNearLimit 
              ? 'Te apropii de limita de notificări'
              : 'Plan Gratuit Activ'
            }
          </h3>
          
          <p className="text-sm text-muted-foreground mb-3">
            {isAtLimit 
              ? `Ai folosit toate cele ${maxNotifications} notificări disponibile în planul gratuit. Upgrade la Premium pentru notificări nelimitate și oferte exclusive.`
              : isNearLimit 
              ? `Ai folosit ${notificationCount} din ${maxNotifications} notificări disponibile. Consideră un upgrade pentru a nu pierde ofertele importante.`
              : `Ai ${maxNotifications - notificationCount} notificări rămase din ${maxNotifications}. Upgrade la Premium pentru notificări nelimitate și oferte exclusive.`
            }
          </p>
          
          <div className="flex items-center gap-4 mb-3">
            <div className="flex-1">
              <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                <span>Notificări folosite</span>
                <span>{notificationCount}/{maxNotifications}</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${
                    isAtLimit 
                      ? 'bg-destructive' 
                      : isNearLimit 
                      ? 'bg-warning' :'bg-primary'
                  }`}
                  style={{ width: `${Math.min((notificationCount / maxNotifications) * 100, 100)}%` }}
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <Link to="/subscription-management">
              <Button 
                variant={isAtLimit ? 'default' : 'outline'}
                size="sm"
                className="w-full sm:w-auto"
              >
                <Icon name="Crown" size={16} className="mr-2" />
                {isAtLimit ? 'Upgrade acum' : 'Vezi planurile Premium'}
              </Button>
            </Link>
            
            {!isAtLimit && (
              <Button 
                variant="ghost" 
                size="sm"
                className="w-full sm:w-auto text-muted-foreground"
              >
                <Icon name="X" size={16} className="mr-2" />
                Închide
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Premium Benefits Preview */}
      <div className="mt-4 pt-4 border-t border-border/50">
        <h4 className="text-sm font-medium text-foreground mb-2">
          Beneficii Premium:
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <Icon name="Check" size={12} className="text-success" />
            <span>Notificări nelimitate</span>
          </div>
          <div className="flex items-center gap-2">
            <Icon name="Check" size={12} className="text-success" />
            <span>Oferte exclusive</span>
          </div>
          <div className="flex items-center gap-2">
            <Icon name="Check" size={12} className="text-success" />
            <span>Alertă preț în timp real</span>
          </div>
          <div className="flex items-center gap-2">
            <Icon name="Check" size={12} className="text-success" />
            <span>Suport prioritar</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionBanner;