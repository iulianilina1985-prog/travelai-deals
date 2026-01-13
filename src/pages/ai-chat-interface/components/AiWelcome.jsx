import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import {
  useTranslation } from 'react-i18next';

const WelcomeScreen = ({ onStartChat, isServiceAvailable = true, serviceStatus = null, offlineMode = false }) => {
  const { t } = useTranslation();
  const travelSuggestions = [
    {
      icon: 'MapPin',
      title: 'Destinații Populare',
      description: 'Descoperă cele mai căutate destinații',
      query: 'Arată-mi destinațiile cele mai populare pentru acest sezon'
    },
    {
      icon: 'Wallet',
      title: 'Oferte Buget Redus',
      description: 'Vacanțe accesibile pentru orice buzunar',
      query: 'Căut o vacanță ieftină sub 300 de euro'
    },
    {
      icon: 'Sun',
      title: 'Vacanțe de Vară',
      description: 'Soare, plajă și relaxare perfectă',
      query: 'Vreau o vacanță la mare cu plajă frumoasă'
    },
    {
      icon: 'Mountain',
      title: 'Aventuri la Munte',
      description: 'Drumeții și peisaje spectaculoase',
      query: 'Recomandă-mi o destinație montană pentru drumeții'
    },
    {
      icon: 'Building',
      title: 'City Break',
      description: 'Explorează marile orașe europene',
      query: 'Vreau un city break într-un oraș european'
    },
    {
      icon: 'Heart',
      title: 'Călătorii Romantice',
      description: 'Destinații perfecte pentru cupluri',
      query: 'Căut o destinație romantică pentru luna de miere'
    }
  ];

  const handleSuggestionClick = (query) => {
    onStartChat?.(query);
  };

  const handleQuickStart = (message) => {
    onStartChat?.(message);
  };

  const quickStartOptions = [
    {
      icon: 'MapPin',
      title: offlineMode ? 'Destinații Cache' : 'Destinații Populare',
      description: offlineMode ? 'Explorează din baza locală' : 'Descoperă cele mai căutate destinații',
      message: offlineMode ? 'Arată-mi destinațiile din cache-ul local' : 'Arată-mi destinațiile cele mai populare pentru acest sezon'
    },
    {
      icon: 'Wallet',
      title: offlineMode ? 'Oferte Salvate' : 'Oferte Buget Redus',
      description: offlineMode ? 'Vezi ofertele stocate local' : 'Vacanțe accesibile pentru orice buzunar',
      message: offlineMode ? 'Afișează ofertele disponibile offline' : 'Căut o vacanță ieftină sub 300 de euro'
    },
    {
      icon: offlineMode ? 'BookOpen' : 'Sun',
      title: offlineMode ? 'Ghiduri Călătorie' : 'Vacanțe de Vară',
      description: offlineMode ? 'Informații și sfaturi utile' : 'Soare, plajă și relaxare perfectă',
      message: offlineMode ? 'Dă-mi sfaturi pentru planificarea călătoriilor' : 'Vreau o vacanță la mare cu plajă frumoasă'
    },
    {
      icon: 'Mountain',
      title: offlineMode ? 'România Turistică' : 'Aventuri la Munte',
      description: offlineMode ? 'Destinații locale din România' : 'Drumeții și peisaje spectaculoase',
      message: offlineMode ? 'Recomandări pentru turism în România' : 'Recomandă-mi o destinație montană pentru drumeții'
    },
    {
      icon: 'Building',
      title: offlineMode ? 'Orașe Europene' : 'City Break',
      description: offlineMode ? 'Informații despre orașe' : 'Explorează marile orașe europene',
      message: offlineMode ? 'Informații despre orașele europene din cache' : 'Vreau un city break într-un oraș european'
    },
    {
      icon: 'Heart',
      title: offlineMode ? 'Călătorii de Cuplu' : 'Călătorii Romantice',
      description: offlineMode ? 'Idei pentru cupluri din baza locală' : 'Destinații perfecte pentru cupluri',
      message: offlineMode ? 'Sugestii romantice din ghidurile locale' : 'Căut o destinație romantică pentru luna de miere'
    }
  ];

  const travelTips = [
    {
      title: 'Vacanțe de vară',
      tips: [
        'Caută destinații cu plajă frumoasă și climă tropicală',
        'Verifică prețurile pentru sezonul de vară',
        'Caută oferte de vacanță cu transport inclus'
      ]
    },
    {
      title: 'Vacanțe de iarnă',
      tips: [
        'Caută destinații cu climă rece și activități de iarnă',
        'Verifică prețurile pentru sezonul de iarnă',
        'Caută oferte de vacanță cu transport inclus'
      ]
    },
    {
      title: 'Vacanțe de familie',
      tips: [
        'Caută destinații cu activități pentru copii',
        'Verifică prețurile pentru sezonul de vară',
        'Caută oferte de vacanță cu transport inclus'
      ]
    }
  ];

  return (
    <div className="max-w-4xl mx-auto">
      {/* Enhanced Header */}
      <div className="text-center mb-8">
        <div className={`w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg ${
          offlineMode 
            ? 'bg-gradient-to-br from-blue-500 to-cyan-500' :'bg-gradient-to-br from-primary to-secondary'
        }`}>
          <Icon name={offlineMode ? 'Database' : 'Plane'} size={32} color="white" />
        </div>
        <h1 className="text-3xl font-bold text-foreground mb-2">
          {offlineMode ? 'TravelAI Offline Mode! 🛄' : 'Bun venit la TravelAI! ✈️'}
        </h1>
        <p className="text-lg text-muted-foreground">
          {offlineMode 
            ? 'Funcții de bază și recomandări locale disponibile' :'Asistentul tău personal pentru călătorii perfecte'
          }
        </p>
        
        {/* Enhanced Service Status Message */}
        {serviceStatus && (
          <div className={`mt-4 p-4 rounded-lg border ${
            serviceStatus?.status === 'quota_exceeded' ?'bg-orange-50 border-orange-200'
              : serviceStatus?.status === 'offline' ?'bg-blue-50 border-blue-200' :'bg-yellow-50 border-yellow-200'
          }`}>
            <div className="flex items-center justify-center space-x-2">
              <Icon 
                name={
                  serviceStatus?.status === 'quota_exceeded' ? 'Clock' : 
                  serviceStatus?.status === 'offline' ? 'Database' : 'AlertTriangle'
                } 
                size={20} 
                className={
                  serviceStatus?.status === 'quota_exceeded' ? 'text-orange-600' :
                  serviceStatus?.status === 'offline' ? 'text-blue-600' : 'text-yellow-600'
                } 
              />
              <span className={`font-medium ${
                serviceStatus?.status === 'quota_exceeded' ? 'text-orange-800' :
                serviceStatus?.status === 'offline' ? 'text-blue-800' : 'text-yellow-800'
              }`}>
                {serviceStatus?.status === 'quota_exceeded' && 'Serviciul AI este în pauza zilnică'}
                {serviceStatus?.status === 'offline' && 'Funcționez în mod offline'}
                {serviceStatus?.status === 'error' && 'Serviciu temporar indisponibil'}
                {serviceStatus?.status === 'rate_limited' && 'Trafic intens - funcții reduse'}
              </span>
            </div>
            <p className="text-sm text-muted-foreground mt-2 text-center">
              {serviceStatus?.status === 'quota_exceeded' && `Resetare: ${serviceStatus?.resetTime}. Funcții offline complet funcționale!`}
              {serviceStatus?.status === 'offline' && 'Toate funcțiile de bază și recomandările locale sunt disponibile'}
              {serviceStatus?.status === 'error' && 'Încearcă din nou mai târziu sau folosește funcțiile offline'}
              {serviceStatus?.status === 'rate_limited' && 'Reîncercare automată în curs'}
            </p>
            
            {/* Enhanced capabilities display */}
            {serviceStatus?.capabilities && (
              <div className="mt-3 p-3 bg-background/60 rounded-lg">
                <p className="text-sm font-medium text-muted-foreground mb-2">{t("pages.ai-chat-interface.components.WelcomeScreen.func_ii_active")}</p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {serviceStatus?.capabilities?.map((capability, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Icon name="CheckCircle" size={12} className="text-green-600" />
                      <span className="text-xs text-muted-foreground">{capability}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      {/* Enhanced Quick Start Options */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-foreground mb-4 text-center flex items-center justify-center space-x-2">
          <span>{offlineMode ? '📱 Opțiuni offline' : '🚀 Începe rapid'}</span>
          {offlineMode && (
            <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
              Cache local
            </span>
          )}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {quickStartOptions?.map((option, index) => (
            <Button
              key={index}
              variant="outline"
              className={`p-6 h-auto text-left justify-start hover:bg-primary/5 transition-all duration-200 group ${
                offlineMode ? 'border-blue-200 hover:border-blue-300' : ''
              }`}
              onClick={() => handleQuickStart(option?.message)}
            >
              <div className="flex items-start space-x-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform ${
                  offlineMode 
                    ? 'bg-gradient-to-br from-blue-100 to-cyan-100' :'bg-gradient-to-br from-primary/20 to-secondary/20'
                }`}>
                  <Icon 
                    name={option?.icon} 
                    size={24} 
                    className={offlineMode ? 'text-blue-600' : 'text-primary'} 
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-foreground mb-1">{option?.title}</h3>
                  <p className="text-sm text-muted-foreground">{option?.description}</p>
                  {offlineMode && (
                    <div className="mt-1 flex items-center space-x-1">
                      <Icon name="Database" size={10} className="text-blue-500" />
                      <span className="text-xs text-blue-600">{t("pages.ai-chat-interface.components.WelcomeScreen.disponibil_offline")}</span>
                    </div>
                  )}
                </div>
              </div>
            </Button>
          ))}
        </div>
      </div>
      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {travelSuggestions?.map((suggestion, index) => (
          <div
            key={index}
            onClick={() => handleSuggestionClick(suggestion?.query)}
            className="p-4 border border-border rounded-lg cursor-pointer hover:shadow-md hover:border-primary transition-all duration-200 bg-card">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Icon name={suggestion?.icon} size={24} className="text-primary" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">
              {suggestion?.title}
            </h3>
            <p className="text-sm text-muted-foreground">
              {suggestion?.description}
            </p>
          </div>
        ))}
      </div>
      {/* Quick Start Examples */}
      <div className={`bg-card border rounded-lg p-6 ${
        offlineMode ? 'border-blue-200 bg-blue-50/30' : 'border-border'
      }`}>
        <h3 className="font-semibold text-foreground mb-4">
          {offlineMode ? 'Exemple întrebări offline:' : 'Exemple de întrebări:'}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          <Button
            variant="ghost"
            className="text-left justify-start h-auto p-3"
            onClick={() => handleSuggestionClick(offlineMode ? 'Informații despre Grecia din cache' : 'Găsește-mi o vacanță în Grecia sub 500€')}>
            <Icon name="MessageSquare" size={16} className={`mr-2 ${offlineMode ? 'text-blue-600' : 'text-primary'}`} />
            {offlineMode ? '"Informații despre Grecia din cache"' : '"Găsește-mi o vacanță în Grecia sub 500€"'}
          </Button>
          
          <Button
            variant="ghost"
            className="text-left justify-start h-auto p-3"
            onClick={() => handleSuggestionClick(offlineMode ? 'Ghid turistic Paris offline' : 'Vreau un city break romantic în Paris')}>
            <Icon name="MessageSquare" size={16} className={`mr-2 ${offlineMode ? 'text-blue-600' : 'text-primary'}`} />
            {offlineMode ? '"Ghid turistic Paris offline"' : '"Vreau un city break romantic în Paris"'}
          </Button>
          
          <Button
            variant="ghost"
            className="text-left justify-start h-auto p-3"
            onClick={() => handleSuggestionClick(offlineMode ? 'Destinații România din baza locală' : 'Recomandă-mi o croazieră în Mediterana')}>
            <Icon name="MessageSquare" size={16} className={`mr-2 ${offlineMode ? 'text-blue-600' : 'text-primary'}`} />
            {offlineMode ? '"Destinații România din baza locală"' : '"Recomandă-mi o croazieră în Mediterana"'}
          </Button>
          
          <Button
            variant="ghost"
            className="text-left justify-start h-auto p-3"
            onClick={() => handleSuggestionClick(offlineMode ? 'Sfaturi generale pentru călătorii' : 'Căut sejur la schi în Alpi')}>
            <Icon name="MessageSquare" size={16} className={`mr-2 ${offlineMode ? 'text-blue-600' : 'text-primary'}`} />
            {offlineMode ? '"Sfaturi generale pentru călătorii"' : '"Căut sejur la schi în Alpi"'}
          </Button>
        </div>
      </div>
      {/* AI Features Highlight */}
      <div className="mt-8 text-center">
        <div className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full ${
          offlineMode 
            ? 'bg-blue-100 text-blue-700' :'bg-primary/10 text-primary'
        }`}>
          <Icon name={offlineMode ? 'Database' : 'Sparkles'} size={16} />
          <span className="text-sm font-medium">
            {offlineMode 
              ? 'Mod Offline - Baza locală de destinații și ghiduri' :'Powered by OpenAI GPT-4 - Răspunsuri inteligente și personalizate'
            }
          </span>
        </div>
        {offlineMode && (
          <p className="text-xs text-muted-foreground mt-2">
            Funcții complete disponibile când serviciul AI se va reconecta
          </p>
        )}
      </div>
    </div>
  );
};

export default WelcomeScreen;