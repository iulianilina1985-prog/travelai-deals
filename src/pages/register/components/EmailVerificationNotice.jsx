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
      alert("Emailul de verificare a fost retrimis cu succes!");
    } catch (error) {
      console.error("Eroare la retrimiterea emailului de verificare:", error);
      alert("A apărut o eroare. Te rugăm să încerci din nou.");
    } finally {
      setResendLoading(false);
    }
  };

  const steps = [
    {
      number: 1,
      title: "Verifică-ți emailul",
      description: `Ți-am trimis un link de confirmare la adresa ${safeEmail}.`
    },
    {
      number: 2,
      title: "Accesează linkul de verificare",
      description: "Deschide emailul și apasă linkul de confirmare pentru a-ți activa contul."
    },
    {
      number: 3,
      title: "Începe explorarea ofertelor",
      description: "După confirmare, te poți autentifica și folosi TravelAI Deals."
    }
  ];

  return (
    <div className="max-w-md mx-auto text-center space-y-8">
      {/* Icon succes */}
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto shadow-sm">
        <Icon name="Mail" size={42} className="text-green-600" />
      </div>

      {/* Mesaj principal */}
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-foreground">
          Verifică-ți adresa de email
        </h2>
        <p className="text-muted-foreground">
          Ți-am trimis un email de confirmare. Urmează instrucțiunile pentru a activa contul.
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
          Următorii pași
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
          Nu ai primit emailul? Verifică și folderul Spam sau cere retrimiterea.
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
            ? `Retrimite în ${resendCooldown}s`
            : "Retrimite emailul de verificare"}
        </Button>
      </div>

      {/* Secțiune de ajutor */}
      <div className="bg-card border border-border rounded-lg p-4 space-y-3 shadow-sm">
        <div className="flex items-center space-x-2">
          <Icon name="HelpCircle" size={16} className="text-muted-foreground" />
          <span className="text-sm font-medium text-foreground">
            Ai nevoie de ajutor?
          </span>
        </div>

        <div className="space-y-2 text-xs text-muted-foreground">
          <p>• Verifică folderul Spam sau Junk</p>
          <p>• Asigură-te că adresa este corectă</p>
          <p>• Linkul expiră în 24 de ore</p>
          <p>• Contactează suportul dacă problema persistă</p>
        </div>

        <div className="flex items-center justify-center space-x-4 pt-2">
          <a
            href="mailto:support@travelaideals.ro"
            className="text-primary hover:underline text-xs"
          >
            Contact suport
          </a>

          <span className="text-muted-foreground">•</span>

          <button
            onClick={onBackToForm}
            className="text-primary hover:underline text-xs"
          >
            Schimbă adresa de email
          </button>
        </div>
      </div>

      {/* Notificare securitate */}
      <div className="bg-muted/50 rounded-lg p-3 border border-border text-left">
        <div className="flex items-start space-x-2">
          <Icon name="Shield" size={14} className="text-muted-foreground" />
          <p className="text-xs text-muted-foreground">
            Pentru siguranța ta, linkul de verificare expiră în 24 de ore.
          </p>
        </div>
      </div>
    </div>
  );
};

export default EmailVerificationNotice;
