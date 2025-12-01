import React from 'react';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const DealDetailsModal = ({ deal, isOpen, onClose }) => {
  if (!isOpen || !deal) return null;

  const formatPrice = (price) => {
    return new Intl.NumberFormat('ro-RO', {
      style: 'currency',
      currency: 'EUR'
    })?.format(price);
  };

  const formatDate = (dateString) => {
    return new Date(dateString)?.toLocaleDateString('ro-RO', {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    return new Date(`2000-01-01T${timeString}`)?.toLocaleTimeString('ro-RO', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      {/* Modal */}
      <div className="relative bg-background rounded-lg shadow-modal max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-2xl font-bold text-foreground">
            Detalii ofertă
          </h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
          >
            <Icon name="X" size={24} />
          </Button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="p-6 space-y-6">
            {/* Main Image */}
            <div className="aspect-video overflow-hidden rounded-lg">
              <Image
                src={deal?.image}
                alt={deal?.imageAlt}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Title and Price */}
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <div className="flex-1">
                <h3 className="text-3xl font-bold text-foreground mb-2">
                  {deal?.title}
                </h3>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Icon name="MapPin" size={18} />
                  <span className="text-lg">{deal?.destination}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-4xl font-bold text-primary mb-1">
                  {formatPrice(deal?.currentPrice)}
                </div>
                {deal?.originalPrice && deal?.originalPrice > deal?.currentPrice && (
                  <div className="flex items-center gap-2">
                    <span className="text-lg text-muted-foreground line-through">
                      {formatPrice(deal?.originalPrice)}
                    </span>
                    <span className="bg-accent text-accent-foreground px-2 py-1 rounded-md text-sm font-medium">
                      -{deal?.priceDropPercentage}%
                    </span>
                  </div>
                )}
                <div className="text-sm text-muted-foreground mt-1">
                  per persoană
                </div>
              </div>
            </div>

            {/* Travel Details */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-foreground">
                  Detalii călătorie
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Icon name="Calendar" size={18} className="text-primary" />
                    <div>
                      <div className="font-medium">Plecare</div>
                      <div className="text-muted-foreground">{formatDate(deal?.departureDate)}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Icon name="Calendar" size={18} className="text-primary" />
                    <div>
                      <div className="font-medium">Întoarcere</div>
                      <div className="text-muted-foreground">{formatDate(deal?.returnDate)}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Icon name="Users" size={18} className="text-primary" />
                    <div>
                      <div className="font-medium">Numărul de persoane</div>
                      <div className="text-muted-foreground">{deal?.travelers} persoane</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Icon name="Clock" size={18} className="text-primary" />
                    <div>
                      <div className="font-medium">Durata</div>
                      <div className="text-muted-foreground">{deal?.duration} zile</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-foreground">
                  Informații zbor
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Icon name="Plane" size={18} className="text-primary" />
                    <div>
                      <div className="font-medium">Companie aeriană</div>
                      <div className="text-muted-foreground">{deal?.airline}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Icon name="Clock" size={18} className="text-primary" />
                    <div>
                      <div className="font-medium">Plecare</div>
                      <div className="text-muted-foreground">{formatTime(deal?.departureTime)} - {formatTime(deal?.arrivalTime)}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Icon name="MapPin" size={18} className="text-primary" />
                    <div>
                      <div className="font-medium">Aeroporturi</div>
                      <div className="text-muted-foreground">{deal?.departureAirport} → {deal?.arrivalAirport}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Icon name="Luggage" size={18} className="text-primary" />
                    <div>
                      <div className="font-medium">Bagaj</div>
                      <div className="text-muted-foreground">{deal?.baggage}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Hotel Details */}
            {deal?.hotel && (
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-foreground">
                  Detalii hotel
                </h4>
                <div className="bg-muted rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h5 className="font-semibold text-foreground">{deal?.hotel?.name}</h5>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex items-center">
                          {[...Array(5)]?.map((_, i) => (
                            <Icon
                              key={i}
                              name="Star"
                              size={14}
                              className={i < deal?.hotel?.stars ? 'text-warning fill-current' : 'text-muted-foreground'}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-muted-foreground">
                          ({deal?.hotel?.rating}/10 - {deal?.hotel?.reviews} recenzii)
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Icon name="MapPin" size={14} />
                        <span>{deal?.hotel?.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Icon name="Bed" size={14} />
                        <span>{deal?.hotel?.roomType}</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Icon name="Utensils" size={14} />
                        <span>{deal?.hotel?.mealPlan}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Icon name="Wifi" size={14} />
                        <span>WiFi gratuit</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Description */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-foreground">
                Descriere
              </h4>
              <p className="text-muted-foreground leading-relaxed">
                {deal?.description}
              </p>
            </div>

            {/* Inclusions */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-foreground">
                Ce include
              </h4>
              <div className="grid md:grid-cols-2 gap-2">
                {deal?.inclusions?.map((inclusion, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Icon name="Check" size={16} className="text-success" />
                    <span className="text-sm">{inclusion}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Terms */}
            <div className="bg-muted rounded-lg p-4">
              <h5 className="font-semibold text-foreground mb-2">
                Termeni și condiții
              </h5>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Prețurile sunt per persoană în cameră dublă</li>
                <li>• Oferta este valabilă până pe {new Date(deal.expiryDate)?.toLocaleDateString('ro-RO')}</li>
                <li>• Disponibilitate limitată</li>
                <li>• Prețurile pot varia în funcție de disponibilitate</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-border bg-muted/50">
          <div className="text-sm text-muted-foreground">
            Oferit de {deal?.provider}
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: deal?.title,
                    text: `Ofertă specială: ${deal?.title} - ${formatPrice(deal?.currentPrice)}`,
                    url: window.location?.href
                  });
                }
              }}
            >
              <Icon name="Share2" size={16} className="mr-2" />
              Distribuie
            </Button>
            <Button
              variant="default"
              onClick={() => window.open(deal?.bookingUrl, '_blank')}
            >
              <Icon name="ExternalLink" size={16} className="mr-2" />
              Rezervă acum
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DealDetailsModal;