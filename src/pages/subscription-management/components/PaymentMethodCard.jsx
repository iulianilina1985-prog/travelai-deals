import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const PaymentMethodCard = ({ paymentMethods, onAddPaymentMethod, onRemovePaymentMethod, onSetDefault }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newPaymentMethod, setNewPaymentMethod] = useState({
    type: 'card',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    holderName: '',
    billingAddress: ''
  });

  const getPaymentIcon = (type) => {
    switch (type) {
      case 'visa':
        return 'CreditCard';
      case 'mastercard':
        return 'CreditCard';
      case 'paypal':
        return 'Wallet';
      case 'sepa':
        return 'Building2';
      default:
        return 'CreditCard';
    }
  };

  const getPaymentColor = (type) => {
    switch (type) {
      case 'visa':
        return 'var(--color-primary)';
      case 'mastercard':
        return 'var(--color-error)';
      case 'paypal':
        return 'var(--color-warning)';
      case 'sepa':
        return 'var(--color-secondary)';
      default:
        return 'var(--color-muted-foreground)';
    }
  };

  const handleAddPaymentMethod = (e) => {
    e?.preventDefault();
    onAddPaymentMethod(newPaymentMethod);
    setNewPaymentMethod({
      type: 'card',
      cardNumber: '',
      expiryDate: '',
      cvv: '',
      holderName: '',
      billingAddress: ''
    });
    setShowAddForm(false);
  };

  const handleInputChange = (field, value) => {
    setNewPaymentMethod(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-card">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
            <Icon name="CreditCard" size={20} color="var(--color-accent)" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Payment Methods</h3>
            <p className="text-sm text-muted-foreground">Manage your payment options</p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowAddForm(!showAddForm)}
          iconName="Plus"
          iconPosition="left"
        >
          Add Method
        </Button>
      </div>
      {/* Add Payment Method Form */}
      {showAddForm && (
        <div className="mb-6 p-4 border border-border rounded-lg bg-muted/20">
          <h4 className="text-sm font-medium text-foreground mb-4">Add New Payment Method</h4>
          <form onSubmit={handleAddPaymentMethod} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Card Holder Name"
                type="text"
                placeholder="John Doe"
                value={newPaymentMethod?.holderName}
                onChange={(e) => handleInputChange('holderName', e?.target?.value)}
                required
              />
              <Input
                label="Card Number"
                type="text"
                placeholder="1234 5678 9012 3456"
                value={newPaymentMethod?.cardNumber}
                onChange={(e) => handleInputChange('cardNumber', e?.target?.value)}
                required
              />
              <Input
                label="Expiry Date"
                type="text"
                placeholder="MM/YY"
                value={newPaymentMethod?.expiryDate}
                onChange={(e) => handleInputChange('expiryDate', e?.target?.value)}
                required
              />
              <Input
                label="CVV"
                type="text"
                placeholder="123"
                value={newPaymentMethod?.cvv}
                onChange={(e) => handleInputChange('cvv', e?.target?.value)}
                required
              />
            </div>
            <Input
              label="Billing Address"
              type="text"
              placeholder="123 Main St, City, Country"
              value={newPaymentMethod?.billingAddress}
              onChange={(e) => handleInputChange('billingAddress', e?.target?.value)}
              required
            />
            <div className="flex gap-2">
              <Button type="submit" variant="default" size="sm">
                Add Payment Method
              </Button>
              <Button 
                type="button" 
                variant="ghost" 
                size="sm"
                onClick={() => setShowAddForm(false)}
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}
      {/* Payment Methods List */}
      <div className="space-y-4">
        {paymentMethods?.map((method) => (
          <div key={method?.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
            <div className="flex items-center space-x-4">
              <Icon 
                name={getPaymentIcon(method?.type)} 
                size={24} 
                color={getPaymentColor(method?.type)} 
              />
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-medium text-foreground">
                    {method?.type?.toUpperCase()} •••• {method?.last4}
                  </span>
                  {method?.isDefault && (
                    <span className="px-2 py-1 text-xs bg-primary/10 text-primary rounded-full">
                      Default
                    </span>
                  )}
                </div>
                <div className="text-sm text-muted-foreground">
                  Expires {method?.expiryDate}
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {!method?.isDefault && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onSetDefault(method?.id)}
                >
                  Set Default
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onRemovePaymentMethod(method?.id)}
                iconName="Trash2"
              />
            </div>
          </div>
        ))}
      </div>
      {paymentMethods?.length === 0 && !showAddForm && (
        <div className="text-center py-8">
          <Icon name="CreditCard" size={48} color="var(--color-muted-foreground)" />
          <p className="text-muted-foreground mt-2">No payment methods added</p>
          <p className="text-sm text-muted-foreground">Add a payment method to manage your subscription</p>
        </div>
      )}
      {/* Security Notice */}
      <div className="mt-6 p-4 bg-muted/20 rounded-lg">
        <div className="flex items-start space-x-3">
          <Icon name="Shield" size={16} color="var(--color-success)" />
          <div className="text-sm">
            <p className="text-foreground font-medium">Secure Payment Processing</p>
            <p className="text-muted-foreground">
              All payment information is encrypted and processed securely through Stripe and PayPal. 
              We comply with PCI DSS standards and European GDPR regulations.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentMethodCard;