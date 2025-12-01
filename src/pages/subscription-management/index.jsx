import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import CurrentPlanCard from './components/CurrentPlanCard';
import UsageStatsCard from './components/UsageStatsCard';
import BillingHistoryCard from './components/BillingHistoryCard';
import PaymentMethodCard from './components/PaymentMethodCard';
import PlanComparisonModal from './components/PlanComparisonModal';
import CancellationModal from './components/CancellationModal';

const SubscriptionManagement = () => {
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [showCancellationModal, setShowCancellationModal] = useState(false);
  const [currentPlan, setCurrentPlan] = useState({
    type: 'premium',
    nextBilling: '15 November 2025',
    status: 'active'
  });

  // Mock data for current user subscription
  const usageStats = {
    notifications: {
      used: 8,
      limit: 'unlimited',
      percentage: 0
    },
    apiCalls: {
      used: 2847,
      limit: 10000,
      percentage: 28.47
    },
    premiumAccess: true,
    totalDealsFound: 156,
    totalSavings: '€2,340'
  };

  const billingHistory = [
    {
      id: 'inv_001',
      invoiceNumber: 'TRV-2025-001',
      date: '15 October 2025',
      amount: '€19.99',
      status: 'paid',
      plan: 'Premium Monthly',
      paymentMethod: 'Visa •••• 4242',
      billingPeriod: '15 Oct - 15 Nov 2025',
      tax: '€3.80 (19% VAT)',
      billingAddress: `Strada Victoriei 123\nBucharest, Romania\n010101`
    },
    {
      id: 'inv_002',
      invoiceNumber: 'TRV-2025-002',
      date: '15 September 2025',
      amount: '€19.99',
      status: 'paid',
      plan: 'Premium Monthly',
      paymentMethod: 'Visa •••• 4242',
      billingPeriod: '15 Sep - 15 Oct 2025',
      tax: '€3.80 (19% VAT)',
      billingAddress: `Strada Victoriei 123\nBucharest, Romania\n010101`
    },
    {
      id: 'inv_003',
      invoiceNumber: 'TRV-2025-003',
      date: '15 August 2025',
      amount: '€19.99',
      status: 'failed',
      plan: 'Premium Monthly',
      paymentMethod: 'Visa •••• 4242',
      billingPeriod: '15 Aug - 15 Sep 2025',
      tax: '€3.80 (19% VAT)',
      billingAddress: `Strada Victoriei 123\nBucharest, Romania\n010101`
    }
  ];

  const [paymentMethods, setPaymentMethods] = useState([
    {
      id: 'pm_001',
      type: 'visa',
      last4: '4242',
      expiryDate: '12/26',
      isDefault: true,
      holderName: 'Alexandru Popescu'
    },
    {
      id: 'pm_002',
      type: 'paypal',
      last4: 'PayPal',
      expiryDate: 'N/A',
      isDefault: false,
      holderName: 'alexandru.popescu@email.com'
    }
  ]);

  useEffect(() => {
    const savedLanguage = localStorage.getItem('selectedLanguage') || 'en';
    setCurrentLanguage(savedLanguage);
  }, []);

  const handleUpgrade = () => {
    setShowPlanModal(true);
  };

  const handleCancelSubscription = () => {
    setShowCancellationModal(true);
  };

  const handlePlanSelect = (planId) => {
    setCurrentPlan(prev => ({
      ...prev,
      type: planId
    }));
    // Here you would typically make an API call to update the subscription
    console.log('Selected plan:', planId);
  };

  const handleConfirmCancellation = (cancellationData) => {
    console.log('Subscription cancelled:', cancellationData);
    setCurrentPlan(prev => ({
      ...prev,
      status: 'cancelled',
      type: 'free'
    }));
  };

  const handleDownloadInvoice = (invoiceId) => {
    console.log('Downloading invoice:', invoiceId);
    // Here you would typically trigger a PDF download
  };

  const handleAddPaymentMethod = (newMethod) => {
    const newPaymentMethod = {
      id: `pm_${Date.now()}`,
      type: 'visa', // This would be determined by card number validation
      last4: newMethod?.cardNumber?.slice(-4),
      expiryDate: newMethod?.expiryDate,
      isDefault: paymentMethods?.length === 0,
      holderName: newMethod?.holderName
    };
    setPaymentMethods(prev => [...prev, newPaymentMethod]);
  };

  const handleRemovePaymentMethod = (methodId) => {
    setPaymentMethods(prev => prev?.filter(method => method?.id !== methodId));
  };

  const handleSetDefaultPaymentMethod = (methodId) => {
    setPaymentMethods(prev => prev?.map(method => ({
      ...method,
      isDefault: method?.id === methodId
    })));
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Icon name="CreditCard" size={24} color="var(--color-primary)" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">Subscription Management</h1>
                <p className="text-muted-foreground">
                  Manage your premium subscription and billing preferences
                </p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap gap-3">
              <Button
                variant="default"
                onClick={handleUpgrade}
                iconName="ArrowUp"
                iconPosition="left"
              >
                Compare Plans
              </Button>
              <Button
                variant="outline"
                iconName="Download"
                iconPosition="left"
              >
                Download Invoices
              </Button>
              <Button
                variant="ghost"
                iconName="HelpCircle"
                iconPosition="left"
              >
                Billing Support
              </Button>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Plan & Usage */}
            <div className="lg:col-span-2 space-y-8">
              {/* Current Plan */}
              <CurrentPlanCard
                currentPlan={currentPlan}
                onUpgrade={handleUpgrade}
                onCancel={handleCancelSubscription}
              />

              {/* Usage Statistics */}
              <UsageStatsCard usageStats={usageStats} />

              {/* Billing History */}
              <BillingHistoryCard
                billingHistory={billingHistory}
                onDownloadInvoice={handleDownloadInvoice}
              />
            </div>

            {/* Right Column - Payment Methods */}
            <div className="space-y-8">
              <PaymentMethodCard
                paymentMethods={paymentMethods}
                onAddPaymentMethod={handleAddPaymentMethod}
                onRemovePaymentMethod={handleRemovePaymentMethod}
                onSetDefault={handleSetDefaultPaymentMethod}
              />

              {/* Subscription Status Card */}
              <div className="bg-card border border-border rounded-lg p-6 shadow-card">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
                    <Icon name="CheckCircle" size={20} color="var(--color-success)" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">Subscription Status</h3>
                    <p className="text-sm text-muted-foreground">Your account is in good standing</p>
                  </div>
                </div>
                
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Status:</span>
                    <span className="text-success font-medium">Active</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Next billing:</span>
                    <span className="text-foreground">{currentPlan?.nextBilling}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Auto-renewal:</span>
                    <span className="text-foreground">Enabled</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-border">
                  <Button
                    variant="ghost"
                    size="sm"
                    fullWidth
                    iconName="Settings"
                    iconPosition="left"
                  >
                    Manage Auto-renewal
                  </Button>
                </div>
              </div>

              {/* GDPR Compliance Card */}
              <div className="bg-card border border-border rounded-lg p-6 shadow-card">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center">
                    <Icon name="Shield" size={20} color="var(--color-secondary)" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">Data & Privacy</h3>
                    <p className="text-sm text-muted-foreground">GDPR compliant billing</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    fullWidth
                    iconName="Download"
                    iconPosition="left"
                  >
                    Export Billing Data
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    fullWidth
                    iconName="Trash2"
                    iconPosition="left"
                  >
                    Request Data Deletion
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      {/* Modals */}
      <PlanComparisonModal
        isOpen={showPlanModal}
        onClose={() => setShowPlanModal(false)}
        onSelectPlan={handlePlanSelect}
        currentPlan={currentPlan?.type}
      />
      <CancellationModal
        isOpen={showCancellationModal}
        onClose={() => setShowCancellationModal(false)}
        onConfirmCancellation={handleConfirmCancellation}
        currentPlan={currentPlan}
      />
    </div>
  );
};

export default SubscriptionManagement;