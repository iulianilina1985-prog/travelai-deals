import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';

const CancellationModal = ({ isOpen, onClose, onConfirmCancellation, currentPlan }) => {
  const [cancellationReason, setCancellationReason] = useState('');
  const [confirmationChecked, setConfirmationChecked] = useState(false);
  const [showRetentionOffer, setShowRetentionOffer] = useState(false);

  if (!isOpen) return null;

  const cancellationReasons = [
    'Too expensive',
    'Not using the service enough',
    'Found a better alternative',
    'Technical issues',
    'Customer service problems',
    'Other'
  ];

  const retentionOffers = [
    {
      title: '50% Off Next 3 Months',
      description: 'Continue with premium features at half price',
      price: '€9.99/month',
      savings: 'Save €30'
    },
    {
      title: 'Free Month Extension',
      description: 'Get one additional month free before cancellation',
      price: 'Free',
      savings: 'Save €19.99'
    }
  ];

  const handleReasonSelect = (reason) => {
    setCancellationReason(reason);
    if (reason && !showRetentionOffer) {
      setShowRetentionOffer(true);
    }
  };

  const handleConfirmCancellation = () => {
    if (confirmationChecked) {
      onConfirmCancellation({
        reason: cancellationReason,
        effectiveDate: currentPlan?.nextBilling
      });
      onClose();
    }
  };

  const handleAcceptOffer = (offer) => {
    // Handle retention offer acceptance
    console.log('Accepted retention offer:', offer);
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
      <div className="relative bg-background border border-border rounded-lg shadow-modal max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-error/10 rounded-lg flex items-center justify-center">
              <Icon name="AlertTriangle" size={20} color="var(--color-error)" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">Cancel Subscription</h2>
              <p className="text-muted-foreground text-sm">
                We're sorry to see you go
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
          >
            <Icon name="X" size={24} />
          </Button>
        </div>

        <div className="p-6">
          {!showRetentionOffer ? (
            <>
              {/* Cancellation Reason */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">
                  Help us improve - Why are you canceling?
                </h3>
                <div className="space-y-2">
                  {cancellationReasons?.map((reason) => (
                    <label 
                      key={reason}
                      className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                        cancellationReason === reason 
                          ? 'border-primary bg-primary/5' :'border-border hover:bg-muted/50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="cancellationReason"
                        value={reason}
                        checked={cancellationReason === reason}
                        onChange={(e) => handleReasonSelect(e?.target?.value)}
                        className="sr-only"
                      />
                      <div className={`w-4 h-4 rounded-full border-2 mr-3 ${
                        cancellationReason === reason 
                          ? 'border-primary bg-primary' :'border-muted-foreground'
                      }`}>
                        {cancellationReason === reason && (
                          <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5" />
                        )}
                      </div>
                      <span className="text-foreground">{reason}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Cancellation Impact */}
              <div className="mb-6 p-4 bg-muted/20 rounded-lg">
                <h4 className="font-medium text-foreground mb-2">What you'll lose:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Unlimited travel deal notifications</li>
                  <li>• Exclusive premium offers and discounts</li>
                  <li>• Priority customer support</li>
                  <li>• Advanced filtering and search options</li>
                  <li>• Price drop alerts and monitoring</li>
                </ul>
              </div>
            </>
          ) : (
            <>
              {/* Retention Offers */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">
                  Wait! We have a special offer for you
                </h3>
                <p className="text-muted-foreground mb-4">
                  Before you go, here are some exclusive offers to help you stay:
                </p>
                
                <div className="space-y-4">
                  {retentionOffers?.map((offer, index) => (
                    <div key={index} className="border border-border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-foreground">{offer?.title}</h4>
                        <span className="text-sm bg-success/10 text-success px-2 py-1 rounded-full">
                          {offer?.savings}
                        </span>
                      </div>
                      <p className="text-muted-foreground text-sm mb-3">{offer?.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-foreground">{offer?.price}</span>
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => handleAcceptOffer(offer)}
                        >
                          Accept Offer
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="text-center mb-6">
                <Button
                  variant="ghost"
                  onClick={() => setShowRetentionOffer(false)}
                >
                  No thanks, continue with cancellation
                </Button>
              </div>
            </>
          )}

          {/* Cancellation Confirmation */}
          {cancellationReason && !showRetentionOffer && (
            <div className="mb-6">
              <div className="p-4 bg-error/5 border border-error/20 rounded-lg mb-4">
                <div className="flex items-start space-x-3">
                  <Icon name="AlertCircle" size={16} color="var(--color-error)" />
                  <div className="text-sm">
                    <p className="text-foreground font-medium">Cancellation Details</p>
                    <p className="text-muted-foreground mt-1">
                      Your subscription will remain active until {currentPlan?.nextBilling}. 
                      After this date, you'll be moved to the free plan with limited features.
                    </p>
                  </div>
                </div>
              </div>

              <Checkbox
                label="I understand that my subscription will be canceled and I'll lose access to premium features"
                checked={confirmationChecked}
                onChange={(e) => setConfirmationChecked(e?.target?.checked)}
                className="mb-4"
              />
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              variant="ghost"
              fullWidth
              onClick={onClose}
            >
              Keep Subscription
            </Button>
            {cancellationReason && !showRetentionOffer && (
              <Button
                variant="destructive"
                fullWidth
                onClick={handleConfirmCancellation}
                disabled={!confirmationChecked}
              >
                Confirm Cancellation
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CancellationModal;