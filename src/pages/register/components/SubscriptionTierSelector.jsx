import React from 'react';
import Icon from '../../../components/AppIcon';

const SubscriptionTierSelector = ({ selectedTier, onTierChange }) => {
  const tiers = [
    {
      id: 'free',
      name: 'Free',
      price: '€0',
      period: '/month',
      description: 'Perfect for occasional travelers',
      features: [
        'AI Intelligent Search',
        'Up to 2 saved notifications',
        'Basic offer alerts',
        'Email notifications',
        'Standard support'
      ],
      limitations: [
        'Limited to 2 saved searches',
        'Standard offer priority',
        'Email-only support'
      ],
      popular: false,
      color: 'border-border'
    },
    {
      id: 'premium',
      name: 'Premium',
      price: '€9.99',
      period: '/month',
      description: 'Unlimited access to all features',
      features: [
        'Everything in Free plan',
        'Unlimited notifications',
        'Exclusive Premium offers',
        'Priority offer alerts',
        'SMS and push notifications',
        'Advanced offer filtering',
        'AI price drop predictions',
        'Priority customer support',
        'Early access to new features'
      ],
      limitations: [],
      popular: true,
      color: 'border-primary'
    }
  ];

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-foreground mb-2">Choose your plan</h3>
        <p className="text-sm text-muted-foreground">
          Select the plan that best fits your needs. You can upgrade at any time.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {tiers?.map((tier) => (
          <div
            key={tier?.id}
            onClick={() => onTierChange(tier?.id)}
            className={`relative cursor-pointer rounded-lg border-2 p-6 transition-all duration-200 hover:shadow-elevated ${selectedTier === tier?.id
                ? `${tier?.color} bg-primary/5`
                : 'border-border bg-card hover:border-primary/30'
              }`}
          >
            {/* Insignă plan popular */}
            {tier?.popular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-medium">
                  Most Popular
                </span>
              </div>
            )}

            {/* Indicator selecție */}
            <div className="absolute top-4 right-4">
              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedTier === tier?.id
                    ? 'border-primary bg-primary'
                    : 'border-muted-foreground'
                  }`}
              >
                {selectedTier === tier?.id && (
                  <Icon name="Check" size={12} color="white" />
                )}
              </div>
            </div>

            {/* Antet plan */}
            <div className="mb-4">
              <h4 className="text-xl font-bold text-foreground">{tier?.name}</h4>
              <div className="flex items-baseline space-x-1 mt-2">
                <span className="text-3xl font-bold text-foreground">{tier?.price}</span>
                <span className="text-sm text-muted-foreground">{tier?.period}</span>
              </div>
              <p className="text-sm text-muted-foreground mt-2">{tier?.description}</p>
            </div>

            {/* Features list */}
            <div className="space-y-3">
              <div>
                <h5 className="text-sm font-medium text-foreground mb-2">Included features:</h5>
                <ul className="space-y-2">
                  {tier?.features?.map((feature, index) => (
                    <li key={index} className="flex items-start space-x-2 text-sm">
                      <Icon name="Check" size={16} className="text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Limitations */}
              {tier?.limitations?.length > 0 && (
                <div>
                  <h5 className="text-sm font-medium text-foreground mb-2">Limitations:</h5>
                  <ul className="space-y-2">
                    {tier?.limitations?.map((limitation, index) => (
                      <li key={index} className="flex items-start space-x-2 text-sm">
                        <Icon name="X" size={16} className="text-red-500 mt-0.5 flex-shrink-0" />
                        <span className="text-muted-foreground">{limitation}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Free plan notice */}
            {tier?.id === 'free' && (
              <div className="mt-4 p-3 bg-muted rounded-lg">
                <p className="text-xs text-muted-foreground text-center">
                  You can upgrade to Premium at any time from your account settings.
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* GDPR Section */}
      <div className="bg-muted/50 rounded-lg p-4 border border-border">
        <div className="flex items-start space-x-3">
          <Icon name="Shield" size={20} className="text-primary mt-0.5 flex-shrink-0" />
          <div className="space-y-2">
            <h5 className="text-sm font-medium text-foreground">GDPR Compliance and Data Protection</h5>
            <p className="text-xs text-muted-foreground">
              Your personal data is processed in accordance with the EU GDPR Regulation.
              We use information exclusively for providing TravelAI Deals services and do not share it
              with third parties without your explicit consent. You can request access, modification, or deletion of your data at any time.
            </p>
            <div className="flex items-center space-x-4 text-xs text-muted-foreground">
              <div className="flex items-center space-x-1">
                <Icon name="Lock" size={12} />
                <span>SSL Encryption</span>
              </div>
              <div className="flex items-center space-x-1">
                <Icon name="Shield" size={12} />
                <span>GDPR Compliant</span>
              </div>
              <div className="flex items-center space-x-1">
                <Icon name="MapPin" size={12} />
                <span>EU Data Centers</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionTierSelector;
