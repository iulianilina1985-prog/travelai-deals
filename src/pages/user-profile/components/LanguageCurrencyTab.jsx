import React, { useState, useEffect } from 'react';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';
import { supabase } from "../../../lib/supabase";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const LanguageCurrencyTab = () => {
  const [currentLanguage, setCurrentLanguage] = useState('ro');
  const [currentCurrency, setCurrentCurrency] = useState('EUR');
  const [dateFormat, setDateFormat] = useState('DD/MM/YYYY');
  const [numberFormat, setNumberFormat] = useState('european');
  const [isEditing, setIsEditing] = useState(false);

  // 🔹 Opțiuni
  const languageOptions = [
    { value: 'ro', label: 'Romanian 🇷🇴' },
    { value: 'en', label: 'English 🇬🇧' },
    { value: 'de', label: 'German 🇩🇪' },
    { value: 'fr', label: 'French 🇫🇷' },
    { value: 'it', label: 'Italian 🇮🇹' },
    { value: 'es', label: 'Spanish 🇪🇸' },
  ];

  const currencyOptions = [
    { value: 'EUR', label: 'Euro (€)', symbol: '€' },
    { value: 'RON', label: 'Romanian Leu (RON)', symbol: 'RON' },
    { value: 'USD', label: 'US Dollar ($)', symbol: '$' },
    { value: 'GBP', label: 'British Pound (£)', symbol: '£' },
    { value: 'CHF', label: 'Swiss Franc (CHF)', symbol: 'CHF' },
  ];

  const dateFormatOptions = [
    { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY (European format)' },
    { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY (US format)' },
    { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD (ISO format)' },
    { value: 'DD.MM.YYYY', label: 'DD.MM.YYYY (German format)' },
  ];

  const numberFormatOptions = [
    { value: 'european', label: '1.234,56 (European format)' },
    { value: 'us', label: '1,234.56 (US format)' },
    { value: 'space', label: '1 234,56 (with space)' },
  ];

  // 🔹 Schimbare limbă
  const handleLanguageChange = (language) => {
    setCurrentLanguage(language);
    localStorage.setItem('selectedLanguage', language);
  };

  // 🔹 Salvare setări
  const handleSaveSettings = async () => {
    setIsEditing(false);

    localStorage.setItem("selectedLanguage", currentLanguage);
    localStorage.setItem("selectedCurrency", currentCurrency);
    localStorage.setItem("dateFormat", dateFormat);
    localStorage.setItem("numberFormat", numberFormat);

    try {
      const { data: authData } = await supabase.auth.getUser();
      const user = authData?.user;
      if (!user) {
        toast.warn("⚠️ You must be authenticated to save settings!");
        return;
      }

      const { error } = await supabase
        .from("user_profiles")
        .update({
          language: currentLanguage,
          currency: currentCurrency,
          date_format: dateFormat,
          number_format: numberFormat,
          updated_at: new Date(),
        })
        .eq("id", user.id);

      if (error) {
        console.error("❌ Error saving:", error.message);
        toast.error("❌ Could not save settings!");
      } else {
        toast.success("✅ Settings saved successfully!");
      }
    } catch (err) {
      console.error("Error synchronizing with Supabase:", err.message);
      toast.error("⚠️ Server connection error!");
    }
  };

  // 🔹 Formatare date și prețuri
  const formatSamplePrice = (price) => {
    switch (numberFormat) {
      case 'us':
        return `${currencyOptions.find(c => c.value === currentCurrency)?.symbol || '€'}${price.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
      case 'space':
        return `${price.toLocaleString('fr-FR', { minimumFractionDigits: 2 }).replace(',', ' ')} ${currentCurrency}`;
      default:
        return `${price.toLocaleString('de-DE', { minimumFractionDigits: 2 })} ${currencyOptions.find(c => c.value === currentCurrency)?.symbol || '€'}`;
    }
  };

  const formatSampleDate = () => {
    const date = new Date();
    switch (dateFormat) {
      case 'MM/DD/YYYY': return date.toLocaleDateString('en-US');
      case 'YYYY-MM-DD': return date.toISOString().split('T')[0];
      case 'DD.MM.YYYY': return date.toLocaleDateString('de-DE');
      default: return date.toLocaleDateString('en-GB');
    }
  };

  // 🔹 Load user settings
  useEffect(() => {
    const loadSettingsFromDB = async () => {
      try {
        const { data: authData } = await supabase.auth.getUser();
        const user = authData?.user;
        if (!user) return;

        const { data, error } = await supabase
          .from("user_profiles")
          .select("language, currency, date_format, number_format")
          .eq("id", user.id)
          .single();

        if (error) return console.warn("⚠️ Could not load settings:", error.message);

        if (data) {
          setCurrentLanguage(data.language || "ro");
          setCurrentCurrency(data.currency || "EUR");
          setDateFormat(data.date_format || "DD/MM/YYYY");
          setNumberFormat(data.number_format || "european");
          localStorage.setItem("selectedLanguage", data.language || "ro");
        }
      } catch (err) {
        console.error("Error reading settings:", err.message);
      }
    };

    loadSettingsFromDB();
  }, []);

  return (
    <>
      <div className="space-y-6">

        {/* LANGUAGE AND CURRENCY */}
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-foreground">Language and Currency</h3>
              <p className="text-sm text-muted-foreground">Personalize your regional preferences</p>
            </div>
            <Button
              variant={isEditing ? "outline" : "default"}
              size="sm"
              iconName={isEditing ? "X" : "Edit"}
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? "Cancel" : "Edit"}
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Select
              label="Interface language"
              description="Choose your desired language"
              options={languageOptions}
              value={currentLanguage}
              onChange={handleLanguageChange}
              disabled={!isEditing}
            />

            <Select
              label="Primary currency"
              description="Default currency for price display"
              options={currencyOptions}
              value={currentCurrency}
              onChange={setCurrentCurrency}
              disabled={!isEditing}
            />

            <Select
              label="Date format"
              description="How calendar dates are displayed"
              options={dateFormatOptions}
              value={dateFormat}
              onChange={setDateFormat}
              disabled={!isEditing}
            />

            <Select
              label="Number format"
              description="How numbers and prices are displayed"
              options={numberFormatOptions}
              value={numberFormat}
              onChange={setNumberFormat}
              disabled={!isEditing}
            />
          </div>

          {isEditing && (
            <div className="flex justify-end mt-6 space-x-3">
              <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
              <Button onClick={handleSaveSettings} iconName="Save">Save settings</Button>
            </div>
          )}
        </div>

        {/* PREVIZUALIZARE */}
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-accent text-accent-foreground rounded-full flex items-center justify-center">
              <Icon name="Eye" size={20} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">Preview</h3>
              <p className="text-sm text-muted-foreground">This is how your data will be displayed</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 border border-border rounded-lg bg-muted">
              <h4 className="font-medium text-foreground mb-3">Example offer</h4>
              <div className="space-y-2">
                <div className="flex justify-between"><span>Flight price:</span><span>{formatSamplePrice(299.99)}</span></div>
                <div className="flex justify-between"><span>Hotel price:</span><span>{formatSamplePrice(1250.00)}</span></div>
                <div className="flex justify-between"><span>Departure date:</span><span>{formatSampleDate()}</span></div>
              </div>
            </div>

            <div className="p-4 border border-border rounded-lg bg-muted">
              <h4 className="font-medium text-foreground mb-3">Current settings</h4>
              <div className="space-y-2">
                <div className="flex justify-between"><span>Language:</span><span>{currentLanguage.toUpperCase()}</span></div>
                <div className="flex justify-between"><span>Currency:</span><span>{currentCurrency}</span></div>
                <div className="flex justify-between"><span>Date format:</span><span>{dateFormat}</span></div>
                <div className="flex justify-between"><span>Number format:</span><span>{numberFormat}</span></div>
              </div>
            </div>
          </div>
        </div>

        {/* REGIONAL INFORMATION */}
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center">
              <Icon name="Globe" size={20} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">Regional information</h3>
              <p className="text-sm text-muted-foreground">Additional region-specific settings</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 bg-muted rounded-lg">
              <Icon name="MapPin" size={16} className="text-primary inline-block mr-2" />
              <span className="font-medium">Timezone:</span> Europe/Bucharest (UTC+2)
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <Icon name="Shield" size={16} className="text-success inline-block mr-2" />
              <span className="font-medium">GDPR:</span> Data protection according to EU standards
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <Icon name="Calendar" size={16} className="text-warning inline-block mr-2" />
              <span className="font-medium">Holiday calendar:</span> Romanian and European public holidays
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <Icon name="CreditCard" size={16} className="text-accent inline-block mr-2" />
              <span className="font-medium">Payments:</span> Payment methods available in Europe
            </div>
          </div>
        </div>
      </div>

      <ToastContainer position="bottom-right" autoClose={2500} theme="colored" />
    </>
  );
};

export default LanguageCurrencyTab;
