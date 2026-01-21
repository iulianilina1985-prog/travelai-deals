import React from 'react';
import Icon from '../../../components/AppIcon';

const TrustSignals = () => {
  const trustBadges = [
    {
      icon: 'Shield',
      title: 'GDPR Compliant',
      description: 'Fully compliant with European data protection regulations'
    },
    {
      icon: 'Lock',
      title: 'SSL Secured',
      description: '256-bit encryption for all data transmissions'
    },
    {
      icon: 'MapPin',
      title: 'European Business',
      description: 'Registered and licensed in Romania'
    },
    {
      icon: 'Users',
      title: '10,000+ Users',
      description: 'Trusted by travelers from all over Europe'
    }
  ];

  const securityFeatures = [
    'Bank-level data encryption',
    'Regular security audits',
    'No data sharing with third parties',
    'Right to data deletion (Art. 17 GDPR)',
    'Transparent privacy policy',
    '24/7 system security monitoring'
  ];

  return (
    <div className="space-y-6">
      {/* Insigne de încredere */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {trustBadges?.map((badge, index) => (
          <div
            key={index}
            className="text-center p-4 bg-card rounded-lg border border-border"
          >
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
              <Icon name={badge?.icon} size={24} className="text-primary" />
            </div>
            <h4 className="text-sm font-medium text-foreground mb-1">{badge?.title}</h4>
            <p className="text-xs text-muted-foreground">{badge?.description}</p>
          </div>
        ))}
      </div>

      {/* Informații despre securitate */}
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
            <Icon name="ShieldCheck" size={20} className="text-green-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">
              Your data is safe
            </h3>
            <p className="text-sm text-muted-foreground">
              We take privacy seriously and comply with the strictest European data protection standards.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {securityFeatures?.map((feature, index) => (
            <div key={index} className="flex items-center space-x-2">
              <Icon name="Check" size={16} className="text-green-600 flex-shrink-0" />
              <span className="text-sm text-muted-foreground">{feature}</span>
            </div>
          ))}
        </div>

        {/* Logo-uri de conformitate */}
        <div className="mt-6 pt-6 border-t border-border">
          <div className="flex items-center justify-center space-x-8 opacity-60">
            <div className="flex items-center space-x-2">
              <Icon name="Shield" size={16} />
              <span className="text-xs font-medium">GDPR</span>
            </div>
            <div className="flex items-center space-x-2">
              <Icon name="Lock" size={16} />
              <span className="text-xs font-medium">SSL</span>
            </div>
            <div className="flex items-center space-x-2">
              <Icon name="Globe" size={16} />
              <span className="text-xs font-medium">UE</span>
            </div>
            <div className="flex items-center space-x-2">
              <Icon name="Building" size={16} />
              <span className="text-xs font-medium">RO</span>
            </div>
          </div>
        </div>
      </div>

      {/* Informații de contact */}
      <div className="text-center text-xs text-muted-foreground">
        <p>
          Questions about data protection? Contact our Data Protection Officer at{' '}
          <a
            href="mailto:dpo@travelaideals.ro"
            className="text-primary hover:underline"
          >
            dpo@travelaideals.ro
          </a>
        </p>
      </div>
    </div>
  );
};

export default TrustSignals;
