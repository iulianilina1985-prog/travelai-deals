import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const CurrentPlanCard = ({ currentPlan, onUpgrade, onCancel }) => {
  const planFeatures = {
    free: [
      { text: "2 saved notifications", included: true },
      { text: "Basic travel deals", included: true },
      { text: "Email notifications", included: true },
      { text: "Unlimited notifications", included: false },
      { text: "Exclusive premium offers", included: false },
      { text: "Priority customer support", included: false }
    ],
    premium: [
      { text: "Unlimited notifications", included: true },
      { text: "Exclusive premium offers", included: true },
      { text: "Priority customer support", included: true },
      { text: "Advanced deal filters", included: true },
      { text: "Price drop alerts", included: true },
      { text: "Mobile app access", included: true }
    ]
  };

  const features = planFeatures?.[currentPlan?.type] || planFeatures?.free;

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-card">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground capitalize">
            {currentPlan?.type} Plan
          </h2>
          <p className="text-muted-foreground mt-1">
            {currentPlan?.type === 'free' ? 'Current plan' : 'Active subscription'}
          </p>
        </div>
        <div className={`px-3 py-1 rounded-full text-sm font-medium ${
          currentPlan?.type === 'premium' ?'bg-primary/10 text-primary' :'bg-muted text-muted-foreground'
        }`}>
          {currentPlan?.type === 'premium' ? 'Premium' : 'Free'}
        </div>
      </div>
      <div className="mb-6">
        <div className="text-3xl font-bold text-foreground">
          {currentPlan?.type === 'free' ? '€0' : '€19.99'}
          <span className="text-lg font-normal text-muted-foreground">
            {currentPlan?.type === 'free' ? '/month' : '/month'}
          </span>
        </div>
        {currentPlan?.type === 'premium' && (
          <p className="text-sm text-muted-foreground mt-1">
            Next billing: {currentPlan?.nextBilling}
          </p>
        )}
      </div>
      <div className="space-y-3 mb-6">
        {features?.map((feature, index) => (
          <div key={index} className="flex items-center space-x-3">
            <Icon 
              name={feature?.included ? "Check" : "X"} 
              size={16} 
              color={feature?.included ? "var(--color-success)" : "var(--color-muted-foreground)"} 
            />
            <span className={`text-sm ${
              feature?.included ? 'text-foreground' : 'text-muted-foreground'
            }`}>
              {feature?.text}
            </span>
          </div>
        ))}
      </div>
      <div className="flex flex-col sm:flex-row gap-3">
        {currentPlan?.type === 'free' ? (
          <Button 
            variant="default" 
            fullWidth 
            onClick={onUpgrade}
            iconName="ArrowUp"
            iconPosition="left"
          >
            Upgrade to Premium
          </Button>
        ) : (
          <>
            <Button 
              variant="outline" 
              fullWidth 
              onClick={onCancel}
              iconName="X"
              iconPosition="left"
            >
              Cancel Subscription
            </Button>
            <Button 
              variant="ghost" 
              fullWidth
              iconName="Settings"
              iconPosition="left"
            >
              Manage Plan
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default CurrentPlanCard;