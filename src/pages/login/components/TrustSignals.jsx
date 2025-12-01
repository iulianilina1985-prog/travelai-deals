import React from 'react';
import Icon from '../../../components/AppIcon';

const TrustSignals = () => {
  const trustBadges = [
    {
      id: 1,
      icon: 'Shield',
      title: 'SSL Securizat',
      description: 'Conexiune criptată 256-bit'
    },
    {
      id: 2,
      icon: 'Lock',
      title: 'GDPR Compliant',
      description: 'Protecția datelor UE'
    },
    {
      id: 3,
      icon: 'CheckCircle',
      title: 'Înregistrat în România',
      description: 'Companie autorizată ONRC'
    },
    {
      id: 4,
      icon: 'Users',
      title: '50,000+ Utilizatori',
      description: 'De încredere în Europa'
    }
  ];

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Main Trust Message */}
      <div className="text-center mb-8">
        <h2 className="text-xl font-semibold text-foreground mb-2">
          Securitatea ta este prioritatea noastră
        </h2>
        <p className="text-muted-foreground">
          Platforma ta de încredere pentru oferte de călătorie în Europa
        </p>
      </div>
      {/* Trust Badges Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {trustBadges?.map((badge) => (
          <div
            key={badge?.id}
            className="bg-card border border-border rounded-lg p-4 text-center hover:shadow-elevated transition-all duration-200"
          >
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Icon name={badge?.icon} size={24} className="text-primary" />
            </div>
            <h3 className="font-medium text-foreground text-sm mb-1">
              {badge?.title}
            </h3>
            <p className="text-xs text-muted-foreground">
              {badge?.description}
            </p>
          </div>
        ))}
      </div>
      {/* Security Features */}
      <div className="bg-muted/50 rounded-lg p-6">
        <div className="flex items-start space-x-4">
          <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center flex-shrink-0">
            <Icon name="ShieldCheck" size={20} className="text-success" />
          </div>
          <div className="flex-1">
            <h3 className="font-medium text-foreground mb-2">
              Protecție avansată a datelor
            </h3>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li className="flex items-center space-x-2">
                <Icon name="Check" size={16} className="text-success" />
                <span>Autentificare cu doi factori disponibilă</span>
              </li>
              <li className="flex items-center space-x-2">
                <Icon name="Check" size={16} className="text-success" />
                <span>Monitorizare activitate suspectă 24/7</span>
              </li>
              <li className="flex items-center space-x-2">
                <Icon name="Check" size={16} className="text-success" />
                <span>Backup automat și recuperare date</span>
              </li>
              <li className="flex items-center space-x-2">
                <Icon name="Check" size={16} className="text-success" />
                <span>Conformitate completă GDPR și CCPA</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      {/* Compliance Logos */}
      <div className="flex items-center justify-center space-x-8 mt-8 opacity-60">
        <div className="flex items-center space-x-2">
          <Icon name="Shield" size={20} className="text-muted-foreground" />
          <span className="text-xs font-medium text-muted-foreground">SSL</span>
        </div>
        <div className="flex items-center space-x-2">
          <Icon name="Globe" size={20} className="text-muted-foreground" />
          <span className="text-xs font-medium text-muted-foreground">GDPR</span>
        </div>
        <div className="flex items-center space-x-2">
          <Icon name="Award" size={20} className="text-muted-foreground" />
          <span className="text-xs font-medium text-muted-foreground">ISO 27001</span>
        </div>
        <div className="flex items-center space-x-2">
          <Icon name="CheckCircle" size={20} className="text-muted-foreground" />
          <span className="text-xs font-medium text-muted-foreground">ONRC</span>
        </div>
      </div>
    </div>
  );
};

export default TrustSignals;