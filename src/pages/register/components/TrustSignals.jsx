import React from 'react';
import Icon from '../../../components/AppIcon';

const TrustSignals = () => {
  const trustBadges = [
    {
      icon: 'Shield',
      title: 'Conform GDPR',
      description: 'Respectăm integral normele europene privind protecția datelor'
    },
    {
      icon: 'Lock',
      title: 'Securizat SSL',
      description: 'Criptare de 256 de biți pentru toate transmisiile de date'
    },
    {
      icon: 'MapPin',
      title: 'Afacere românească',
      description: 'Înregistrată și licențiată în România'
    },
    {
      icon: 'Users',
      title: '10.000+ utilizatori',
      description: 'De încredere pentru călători din întreaga Europă'
    }
  ];

  const securityFeatures = [
    'Criptare de nivel bancar pentru date',
    'Audituri de securitate periodice',
    'Fără partajarea datelor cu terți',
    'Dreptul la ștergerea datelor (Art. 17 GDPR)',
    'Politică de confidențialitate transparentă',
    'Monitorizare 24/7 a securității sistemului'
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
              Datele tale sunt în siguranță
            </h3>
            <p className="text-sm text-muted-foreground">
              Tratăm confidențialitatea cu seriozitate și respectăm cele mai stricte standarde europene de protecție a datelor.
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
          Întrebări despre protecția datelor? Contactează responsabilul nostru cu protecția datelor la{' '}
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
