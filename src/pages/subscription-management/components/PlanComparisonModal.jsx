import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const PlanComparisonModal = ({ isOpen, onClose, onSelectPlan, currentPlan }) => {
  if (!isOpen) return null;

  const plans = [
    {
      id: 'free',
      name: 'Free Plan',
      price: '€0',
      period: '/month',
      description: 'Perfect for casual travelers',
      features: [
        { text: '2 saved notifications', included: true },
        { text: 'Basic travel deals', included: true },
        { text: 'Email notifications', included: true },
        { text: 'Community support', included: true },
        { text: 'Unlimited notifications', included: false },
        { text: 'Exclusive premium offers', included: false },
        { text: 'Priority customer support', included: false },
        { text: 'Advanced deal filters', included: false }
      ],
      popular: false,
      buttonText: currentPlan === 'free' ? 'Current Plan' : 'Downgrade',
      buttonVariant: currentPlan === 'free' ? 'outline' : 'ghost'
    },
    {
      id: 'premium',
      name: 'Premium Plan',
      price: '€19.99',
      period: '/month',
      description: 'Best for frequent travelers',
      features: [
        { text: 'Unlimited notifications', included: true },
        { text: 'Exclusive premium offers', included: true },
        { text: 'Priority customer support', included: true },
        { text: 'Advanced deal filters', included: true },
        { text: 'Price drop alerts', included: true },
        { text: 'Mobile app access', included: true },
        { text: 'Custom travel preferences', included: true },
        { text: 'Booking assistance', included: true }
      ],
      popular: true,
      buttonText: currentPlan === 'premium' ? 'Current Plan' : 'Upgrade Now',
      buttonVariant: currentPlan === 'premium' ? 'outline' : 'default'
    }
  ];

  const handlePlanSelect = (planId) => {
    if (planId !== currentPlan) {
      onSelectPlan(planId);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      {/* Modal */}
      <div className="relative bg-background border border-border rounded-lg shadow-modal max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Choose Your Plan</h2>
            <p className="text-muted-foreground mt-1">
              Select the plan that best fits your travel needs
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
          >
            <Icon name="X" size={24} />
          </Button>
        </div>

        {/* Plans Comparison */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {plans?.map((plan) => (
              <div 
                key={plan?.id}
                className={`relative border rounded-lg p-6 ${
                  plan?.popular 
                    ? 'border-primary shadow-elevated' 
                    : 'border-border'
                } ${
                  currentPlan === plan?.id 
                    ? 'bg-primary/5' :'bg-card'
                }`}
              >
                {plan?.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-foreground">{plan?.name}</h3>
                  <p className="text-muted-foreground text-sm mt-1">{plan?.description}</p>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-foreground">{plan?.price}</span>
                    <span className="text-muted-foreground">{plan?.period}</span>
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  {plan?.features?.map((feature, index) => (
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

                <Button
                  variant={plan?.buttonVariant}
                  fullWidth
                  onClick={() => handlePlanSelect(plan?.id)}
                  disabled={currentPlan === plan?.id}
                >
                  {plan?.buttonText}
                </Button>
              </div>
            ))}
          </div>

          {/* Additional Information */}
          <div className="mt-8 p-4 bg-muted/20 rounded-lg">
            <div className="flex items-start space-x-3">
              <Icon name="Info" size={16} color="var(--color-primary)" />
              <div className="text-sm">
                <p className="text-foreground font-medium mb-2">Plan Change Information</p>
                <ul className="text-muted-foreground space-y-1">
                  <li>• Upgrades take effect immediately with prorated billing</li>
                  <li>• Downgrades take effect at the end of your current billing period</li>
                  <li>• You can cancel your subscription at any time</li>
                  <li>• All prices include applicable European VAT</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlanComparisonModal;