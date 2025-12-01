import React from 'react';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const DealCard = ({ deal, onRemove, onShare, onViewDetails }) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('ro-RO', {
      style: 'currency',
      currency: 'EUR'
    })?.format(price);
  };

  const formatDate = (dateString) => {
    return new Date(dateString)?.toLocaleDateString('ro-RO', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getDaysUntilExpiry = (expiryDate) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysLeft = getDaysUntilExpiry(deal?.expiryDate);
  const isExpiringSoon = daysLeft <= 3;
  const isNewDeal = deal?.isNew;

  return (
    <div className="deal-card group">
      <div className="relative">
        <div className="aspect-video overflow-hidden rounded-t-lg">
          <Image
            src={deal?.image}
            alt={deal?.imageAlt}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {isNewDeal && (
            <span className="bg-success text-success-foreground px-2 py-1 rounded-md text-xs font-medium">
              Nou
            </span>
          )}
          {deal?.priceDropPercentage && (
            <span className="bg-accent text-accent-foreground px-2 py-1 rounded-md text-xs font-medium">
              -{deal?.priceDropPercentage}%
            </span>
          )}
        </div>

        {/* Expiry Warning */}
        {isExpiringSoon && (
          <div className="absolute top-3 right-3">
            <span className="bg-destructive text-destructive-foreground px-2 py-1 rounded-md text-xs font-medium flex items-center gap-1">
              <Icon name="Clock" size={12} />
              {daysLeft} zile
            </span>
          </div>
        )}

        {/* Quick Actions */}
        <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <div className="flex gap-2">
            <Button
              variant="secondary"
              size="icon"
              onClick={() => onShare(deal)}
              className="bg-background/90 backdrop-blur-sm"
            >
              <Icon name="Share2" size={16} />
            </Button>
            <Button
              variant="destructive"
              size="icon"
              onClick={() => onRemove(deal?.id)}
              className="bg-background/90 backdrop-blur-sm"
            >
              <Icon name="Trash2" size={16} />
            </Button>
          </div>
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-lg text-foreground line-clamp-2">
            {deal?.title}
          </h3>
          <div className="text-right ml-2">
            <div className="text-2xl font-bold text-primary">
              {formatPrice(deal?.currentPrice)}
            </div>
            {deal?.originalPrice && deal?.originalPrice > deal?.currentPrice && (
              <div className="text-sm text-muted-foreground line-through">
                {formatPrice(deal?.originalPrice)}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Icon name="MapPin" size={14} />
            <span>{deal?.destination}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Icon name="Calendar" size={14} />
            <span>{formatDate(deal?.departureDate)} - {formatDate(deal?.returnDate)}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Icon name="Users" size={14} />
            <span>{deal?.travelers} persoane</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Icon name="Clock" size={14} />
            <span>Expiră pe {formatDate(deal?.expiryDate)}</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex items-center">
              {[...Array(5)]?.map((_, i) => (
                <Icon
                  key={i}
                  name="Star"
                  size={14}
                  className={i < deal?.rating ? 'text-warning fill-current' : 'text-muted-foreground'}
                />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">({deal?.reviews})</span>
          </div>
          <span className="text-xs text-muted-foreground">
            {deal?.provider}
          </span>
        </div>

        <div className="flex gap-2 mt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onViewDetails(deal)}
            className="flex-1"
          >
            <Icon name="Eye" size={16} className="mr-2" />
            Detalii
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={() => window.open(deal?.bookingUrl, '_blank')}
            className="flex-1"
          >
            <Icon name="ExternalLink" size={16} className="mr-2" />
            Rezervă
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DealCard;