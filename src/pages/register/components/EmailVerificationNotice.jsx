import React, { useState, useEffect } from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const EmailVerificationNotice = ({ email, onResendVerification, onBackToForm }) => {
  const [resendCooldown, setResendCooldown] = useState(0);
  const [resendLoading, setResendLoading] = useState(false);
  const safeEmail = email || "adresa ta de email";

  // Cooldown timer
  useEffect(() => {
    if (resendCooldown === 0) return;

    const timer = setInterval(() => {
      setResendCooldown((prev) => Math.max(prev - 1, 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [resendCooldown]);

  // Retrimitere email
  const handleResendVerification = async () => {
    if (!safeEmail) return;

    setResendLoading(true);
    try {
      await onResendVerification(safeEmail);
      setResendCooldown(60);
      alert("Verification email resent successfully!");
    } catch (error) {
      console.error("Error resending verification email:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setResendLoading(false);
    }
  };

  const steps = [
    {
      number: 1,
      title: "Check your email",
      description: `We've sent a confirmation link to ${safeEmail}.`
    },
    {
      number: 2,
      title: "Access the verification link",
      description: "Open the email and click the confirmation link to activate your account."
    },
    {
      number: 3,
      title: "Start exploring deals",
      description: "After confirmation, you can log in and use TravelAI Deals."
    }
  ];

  return (
    <div className="max-w-md mx-auto text-center space-y-8">
      {/* Icon success */}
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto shadow-sm">
        <Icon name="Mail" size={42} className="text-green-600" />
      </div>

      {/* Mesaj principal */}
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-foreground">
          Verify your email address
        </h2>
        <p className="text-muted-foreground">
          We've sent you a confirmation email. Follow the instructions to activate your account.
        </p>
      </div>

      {/* Email afișat */}
      <div className="bg-muted rounded-lg p-4 border border-border">
        <div className="flex items-center justify-center space-x-2">
          <Icon name="Mail" size={16} className="text-muted-foreground" />
          <span className="text-sm font-medium text-foreground break-all">
            {safeEmail}
          </span>
        </div>
      </div>

      {/* Pașii următori */}
      <div className="space-y-4 text-left">
        <h3 className="text-lg font-semibold text-center text-foreground">
          Next steps
        </h3>

        {steps.map((step) => (
          <div key={step.number} className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0">
              {step.number}
            </div>
            <div>
              <h4 className="text-sm font-medium text-foreground">{step.title}</h4>
              <p className="text-xs text-muted-foreground">{step.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Retrimitere email */}
      <div className="space-y-3">
        <p className="text-sm text-muted-foreground">
          Didn't receive the email? Check your Spam folder or request a resend.
        </p>

        <Button
          variant="outline"
          onClick={handleResendVerification}
          loading={resendLoading}
          disabled={resendCooldown > 0}
          iconName="RefreshCw"
          iconPosition="left"
          fullWidth
        >
          {resendCooldown > 0
            ? `Resend in ${resendCooldown}s`
            : "Resend verification email"}
        </Button>
      </div>

      {/* Secțiune de ajutor */}
      <div className="bg-card border border-border rounded-lg p-4 space-y-3 shadow-sm">
        <div className="flex items-center space-x-2">
          <Icon name="HelpCircle" size={16} className="text-muted-foreground" />
          <span className="text-sm font-medium text-foreground">
            Need help?
          </span>
        </div>

        <div className="space-y-2 text-xs text-muted-foreground">
          <p>• Check Spam or Junk folder</p>
          <p>• Ensure address is correct</p>
          <p>• Link expires in 24 hours</p>
          <p>• Contact support if problem persists</p>
        </div>

        <div className="flex items-center justify-center space-x-4 pt-2">
          <a
            href="mailto:support@travelaideals.ro"
            className="text-primary hover:underline text-xs"
          >
            Contact support
          </a>

          <span className="text-muted-foreground">•</span>

          <button
            onClick={onBackToForm}
            className="text-primary hover:underline text-xs"
          >
            Change email address
          </button>
        </div>
      </div>

      {/* Notificare securitate */}
      <div className="bg-muted/50 rounded-lg p-3 border border-border text-left">
        <div className="flex items-start space-x-2">
          <Icon name="Shield" size={14} className="text-muted-foreground" />
          <p className="text-xs text-muted-foreground">
            For your security, the verification link expires in 24 hours.
          </p>
        </div>
      </div>
    </div>
  );
};

export default EmailVerificationNotice;
