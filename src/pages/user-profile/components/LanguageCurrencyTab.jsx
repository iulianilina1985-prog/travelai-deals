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
    { value: 'ro', label: 'Română 🇷🇴' },
    { value: 'en', label: 'Engleză 🇬🇧' },
    { value: 'de', label: 'Germană 🇩🇪' },
    { value: 'fr', label: 'Franceză 🇫🇷' },
    { value: 'it', label: 'Italiană 🇮🇹' },
    { value: 'es', label: 'Spaniolă 🇪🇸' },
  ];

  const currencyOptions = [
    { value: 'EUR', label: 'Euro (€)', symbol: '€' },
    { value: 'RON', label: 'Leu românesc (RON)', symbol: 'RON' },
    { value: 'USD', label: 'Dolar american ($)', symbol: '$' },
    { value: 'GBP', label: 'Liră sterlină (£)', symbol: '£' },
    { value: 'CHF', label: 'Franc elvețian (CHF)', symbol: 'CHF' },
  ];

  const dateFormatOptions = [
    { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY (format european)' },
    { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY (format american)' },
    { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD (format ISO)' },
    { value: 'DD.MM.YYYY', label: 'DD.MM.YYYY (format german)' },
  ];

  const numberFormatOptions = [
    { value: 'european', label: '1.234,56 (format european)' },
    { value: 'us', label: '1,234.56 (format american)' },
    { value: 'space', label: '1 234,56 (cu spațiu)' },
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
        toast.warn("⚠️ Trebuie să fii autentificat pentru a salva setările!");
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
        console.error("❌ Eroare la salvare:", error.message);
        toast.error("❌ Nu s-au putut salva setările!");
      } else {
        toast.success("✅ Setările au fost salvate cu succes!");
      }
    } catch (err) {
      console.error("Eroare la sincronizarea cu Supabase:", err.message);
      toast.error("⚠️ Eroare de conexiune la server!");
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

        if (error) return console.warn("⚠️ Nu s-au putut încărca setările:", error.message);

        if (data) {
          setCurrentLanguage(data.language || "ro");
          setCurrentCurrency(data.currency || "EUR");
          setDateFormat(data.date_format || "DD/MM/YYYY");
          setNumberFormat(data.number_format || "european");
          localStorage.setItem("selectedLanguage", data.language || "ro");
        }
      } catch (err) {
        console.error("Eroare la citirea setărilor:", err.message);
      }
    };

    loadSettingsFromDB();
  }, []);

  return (
    <>
      <div className="space-y-6">

        {/* LIMBĂ ȘI MONEDĂ */}
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-foreground">Limbă și monedă</h3>
              <p className="text-sm text-muted-foreground">Personalizează preferințele tale regionale</p>
            </div>
            <Button
              variant={isEditing ? "outline" : "default"}
              size="sm"
              iconName={isEditing ? "X" : "Edit"}
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? "Anulează" : "Editează"}
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Select
              label="Limba interfeței"
              description="Alege limba dorită"
              options={languageOptions}
              value={currentLanguage}
              onChange={handleLanguageChange}
              disabled={!isEditing}
            />

            <Select
              label="Monedă principală"
              description="Moneda implicită pentru afișarea prețurilor"
              options={currencyOptions}
              value={currentCurrency}
              onChange={setCurrentCurrency}
              disabled={!isEditing}
            />

            <Select
              label="Format dată"
              description="Cum sunt afișate datele calendaristice"
              options={dateFormatOptions}
              value={dateFormat}
              onChange={setDateFormat}
              disabled={!isEditing}
            />

            <Select
              label="Format numere"
              description="Cum sunt afișate numerele și prețurile"
              options={numberFormatOptions}
              value={numberFormat}
              onChange={setNumberFormat}
              disabled={!isEditing}
            />
          </div>

          {isEditing && (
            <div className="flex justify-end mt-6 space-x-3">
              <Button variant="outline" onClick={() => setIsEditing(false)}>Anulează</Button>
              <Button onClick={handleSaveSettings} iconName="Save">Salvează setările</Button>
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
              <h3 className="text-lg font-semibold text-foreground">Previzualizare</h3>
              <p className="text-sm text-muted-foreground">Așa vor fi afișate datele tale</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 border border-border rounded-lg bg-muted">
              <h4 className="font-medium text-foreground mb-3">Ofertă exemplu</h4>
              <div className="space-y-2">
                <div className="flex justify-between"><span>Preț zbor:</span><span>{formatSamplePrice(299.99)}</span></div>
                <div className="flex justify-between"><span>Preț hotel:</span><span>{formatSamplePrice(1250.00)}</span></div>
                <div className="flex justify-between"><span>Data plecării:</span><span>{formatSampleDate()}</span></div>
              </div>
            </div>

            <div className="p-4 border border-border rounded-lg bg-muted">
              <h4 className="font-medium text-foreground mb-3">Setări curente</h4>
              <div className="space-y-2">
                <div className="flex justify-between"><span>Limba:</span><span>{currentLanguage.toUpperCase()}</span></div>
                <div className="flex justify-between"><span>Monedă:</span><span>{currentCurrency}</span></div>
                <div className="flex justify-between"><span>Format dată:</span><span>{dateFormat}</span></div>
                <div className="flex justify-between"><span>Format numere:</span><span>{numberFormat}</span></div>
              </div>
            </div>
          </div>
        </div>

        {/* INFORMAȚII REGIONALE */}
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center">
              <Icon name="Globe" size={20} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">Informații regionale</h3>
              <p className="text-sm text-muted-foreground">Setări suplimentare specifice regiunii</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 bg-muted rounded-lg">
              <Icon name="MapPin" size={16} className="text-primary inline-block mr-2" />
              <span className="font-medium">Fus orar:</span> Europa/București (UTC+2)
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <Icon name="Shield" size={16} className="text-success inline-block mr-2" />
              <span className="font-medium">GDPR:</span> Protecția datelor conform standardelor UE
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <Icon name="Calendar" size={16} className="text-warning inline-block mr-2" />
              <span className="font-medium">Calendar sărbători:</span> Zile legale românești și europene
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <Icon name="CreditCard" size={16} className="text-accent inline-block mr-2" />
              <span className="font-medium">Plăți:</span> Metode de plată disponibile în Europa
            </div>
          </div>
        </div>
      </div>

      <ToastContainer position="bottom-right" autoClose={2500} theme="colored" />
    </>
  );
};

export default LanguageCurrencyTab;
