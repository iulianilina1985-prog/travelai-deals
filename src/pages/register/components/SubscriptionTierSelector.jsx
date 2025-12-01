import React from 'react';
import Icon from '../../../components/AppIcon';

const SubscriptionTierSelector = ({ selectedTier, onTierChange }) => {
  const tiers = [
    {
      id: 'free',
      name: 'Gratuit',
      price: '€0',
      period: '/lună',
      description: 'Perfect pentru călătorii ocazionali',
      features: [
        'Căutare inteligentă cu AI',
        'Până la 2 notificări salvate',
        'Alerte de oferte de bază',
        'Notificări prin email',
        'Suport standard'
      ],
      limitations: [
        'Limitat la 2 căutări salvate',
        'Prioritate standard pentru oferte',
        'Suport doar prin email'
      ],
      popular: false,
      color: 'border-border'
    },
    {
      id: 'premium',
      name: 'Premium',
      price: '€9.99',
      period: '/lună',
      description: 'Acces nelimitat la toate funcțiile',
      features: [
        'Tot ce include planul Gratuit',
        'Notificări nelimitate',
        'Oferte exclusive Premium',
        'Alerte prioritare pentru oferte',
        'Notificări prin SMS și push',
        'Filtrare avansată a ofertelor',
        'Predicții AI pentru scăderi de preț',
        'Suport clienți prioritar',
        'Acces anticipat la funcții noi'
      ],
      limitations: [],
      popular: true,
      color: 'border-primary'
    }
  ];

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-foreground mb-2">Alege planul dorit</h3>
        <p className="text-sm text-muted-foreground">
          Selectează planul care se potrivește cel mai bine nevoilor tale. Poți face upgrade oricând.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {tiers?.map((tier) => (
          <div
            key={tier?.id}
            onClick={() => onTierChange(tier?.id)}
            className={`relative cursor-pointer rounded-lg border-2 p-6 transition-all duration-200 hover:shadow-elevated ${
              selectedTier === tier?.id
                ? `${tier?.color} bg-primary/5`
                : 'border-border bg-card hover:border-primary/30'
            }`}
          >
            {/* Insignă plan popular */}
            {tier?.popular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-medium">
                  Cel mai popular
                </span>
              </div>
            )}

            {/* Indicator selecție */}
            <div className="absolute top-4 right-4">
              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  selectedTier === tier?.id
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

            {/* Lista funcționalități */}
            <div className="space-y-3">
              <div>
                <h5 className="text-sm font-medium text-foreground mb-2">Funcționalități incluse:</h5>
                <ul className="space-y-2">
                  {tier?.features?.map((feature, index) => (
                    <li key={index} className="flex items-start space-x-2 text-sm">
                      <Icon name="Check" size={16} className="text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Limitări */}
              {tier?.limitations?.length > 0 && (
                <div>
                  <h5 className="text-sm font-medium text-foreground mb-2">Limitări:</h5>
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

            {/* Notificare pentru planul gratuit */}
            {tier?.id === 'free' && (
              <div className="mt-4 p-3 bg-muted rounded-lg">
                <p className="text-xs text-muted-foreground text-center">
                  Poți trece oricând la planul Premium din setările contului tău.
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Secțiune GDPR */}
      <div className="bg-muted/50 rounded-lg p-4 border border-border">
        <div className="flex items-start space-x-3">
          <Icon name="Shield" size={20} className="text-primary mt-0.5 flex-shrink-0" />
          <div className="space-y-2">
            <h5 className="text-sm font-medium text-foreground">Conformitate GDPR și protecția datelor</h5>
            <p className="text-xs text-muted-foreground">
              Datele tale personale sunt prelucrate în conformitate cu Regulamentul GDPR al Uniunii Europene.
              Folosim informațiile exclusiv pentru furnizarea serviciilor TravelAI Deals și nu le partajăm
              cu terți fără consimțământul tău explicit. Poți solicita oricând accesul, modificarea sau ștergerea datelor tale.
            </p>
            <div className="flex items-center space-x-4 text-xs text-muted-foreground">
              <div className="flex items-center space-x-1">
                <Icon name="Lock" size={12} />
                <span>Criptare SSL</span>
              </div>
              <div className="flex items-center space-x-1">
                <Icon name="Shield" size={12} />
                <span>Conform GDPR</span>
              </div>
              <div className="flex items-center space-x-1">
                <Icon name="MapPin" size={12} />
                <span>Centre de date în UE</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionTierSelector;
