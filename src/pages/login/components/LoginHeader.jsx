import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';

const LoginHeader = () => {
  return (
    <div className="w-full">
      {/* Top Navigation Bar */}
      <div className="flex items-center justify-between mb-8">
        {/* Logo */}
        <Link to="/ai-chat-interface" className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <Icon name="Plane" size={24} color="white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">TravelAI Deals</h1>
            <p className="text-xs text-muted-foreground">Oferte inteligente de călătorie</p>
          </div>
        </Link>

        {/* Language Selector */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 bg-muted rounded-lg p-2">
            <Icon name="Globe" size={16} className="text-muted-foreground" />
            <select className="bg-transparent text-sm font-medium text-foreground border-none outline-none cursor-pointer">
              <option value="ro">Română</option>
              <option value="en">English</option>
              <option value="de">Deutsch</option>
              <option value="fr">Français</option>
            </select>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
          Descoperă ofertele perfecte de călătorie
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-6">
          Asistentul nostru AI îți găsește automat cele mai bune oferte de vacanțe, 
          zboruri și pachete turistice personalizate pentru tine.
        </p>
        
        {/* Key Features */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
          <div className="flex items-center space-x-2">
            <Icon name="Zap" size={16} className="text-primary" />
            <span>Căutare automată AI</span>
          </div>
          <div className="flex items-center space-x-2">
            <Icon name="Bell" size={16} className="text-primary" />
            <span>Notificări în timp real</span>
          </div>
          <div className="flex items-center space-x-2">
            <Icon name="Euro" size={16} className="text-primary" />
            <span>Economii până la 70%</span>
          </div>
          <div className="flex items-center space-x-2">
            <Icon name="MapPin" size={16} className="text-primary" />
            <span>Destinații europene</span>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
        <div className="text-center">
          <div className="text-2xl font-bold text-primary mb-1">50,000+</div>
          <div className="text-sm text-muted-foreground">Utilizatori activi</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-primary mb-1">€2.5M</div>
          <div className="text-sm text-muted-foreground">Economii generate</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-primary mb-1">95%</div>
          <div className="text-sm text-muted-foreground">Satisfacție clienți</div>
        </div>
      </div>
    </div>
  );
};

export default LoginHeader;