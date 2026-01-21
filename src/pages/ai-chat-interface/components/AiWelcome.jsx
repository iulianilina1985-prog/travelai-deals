import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import {
  useTranslation
} from 'react-i18next';

const WelcomeScreen = ({ onStartChat, isServiceAvailable = true, serviceStatus = null, offlineMode = false }) => {
  const { t } = useTranslation();
  const travelSuggestions = [
    {
      icon: 'MapPin',
      title: 'Popular Destinations',
      description: 'Discover the most searched destinations',
      query: 'Show me the most popular destinations for this season'
    },
    {
      icon: 'Wallet',
      title: 'Low Budget Offers',
      description: 'Affordable vacations for any budget',
      query: 'I am looking for a cheap vacation under 300 euros'
    },
    {
      icon: 'Sun',
      title: 'Summer Vacations',
      description: 'Sun, beach and perfect relaxation',
      query: 'I want a sea vacation with a beautiful beach'
    },
    {
      icon: 'Mountain',
      title: 'Mountain Adventures',
      description: 'Hiking and spectacular landscapes',
      query: 'Recommend a mountain destination for hiking'
    },
    {
      icon: 'Building',
      title: 'City Break',
      description: 'Explore major European cities',
      query: 'I want a city break in a European city'
    },
    {
      icon: 'Heart',
      title: 'Romantic Travels',
      description: 'Perfect destinations for couples',
      query: 'I am looking for a romantic honeymoon destination'
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
      title: offlineMode ? 'Cached Destinations' : 'Popular Destinations',
      description: offlineMode ? 'Explore from local database' : 'Discover the most searched destinations',
      message: offlineMode ? 'Show me destinations from local cache' : 'Show me the most popular destinations for this season'
    },
    {
      icon: 'Wallet',
      title: offlineMode ? 'Saved Offers' : 'Low Budget Offers',
      description: offlineMode ? 'See local stored offers' : 'Affordable vacations for any budget',
      message: offlineMode ? 'Show offline available offers' : 'I am looking for a cheap vacation under 300 euros'
    },
    {
      icon: offlineMode ? 'BookOpen' : 'Sun',
      title: offlineMode ? 'Travel Guides' : 'Summer Vacations',
      description: offlineMode ? 'Useful info and tips' : 'Sun, beach and perfect relaxation',
      message: offlineMode ? 'Give me travel planning tips' : 'I want a sea vacation with a beautiful beach'
    },
    {
      icon: 'Mountain',
      title: offlineMode ? 'Tourist Romania' : 'Mountain Adventures',
      description: offlineMode ? 'Local destinations in Romania' : 'Hiking and spectacular landscapes',
      message: offlineMode ? 'Recommendations for tourism in Romania' : 'Recommend a mountain destination for hiking'
    },
    {
      icon: 'Building',
      title: offlineMode ? 'European Cities' : 'City Break',
      description: offlineMode ? 'City information' : 'Explore major European cities',
      message: offlineMode ? 'Cached European city information' : 'I want a city break in a European city'
    },
    {
      icon: 'Heart',
      title: offlineMode ? 'Couple Travels' : 'Romantic Travels',
      description: offlineMode ? 'Couple ideas from local database' : 'Perfect destinations for couples',
      message: offlineMode ? 'Romantic suggestions from local guides' : 'I am looking for a romantic honeymoon destination'
    }
  ];

  const travelTips = [
    {
      title: 'Vacanțe de vară',
      tips: [
        'Look for destinations with a beautiful beach and tropical climate',
        'Check prices for the summer season',
        'Search for vacation offers with transport included'
      ]
    },
    {
      title: 'Vacanțe de iarnă',
      tips: [
        'Look for destinations with a cold climate and winter activities',
        'Check prices for the winter season',
        'Search for vacation offers with transport included'
      ]
    },
    {
      title: 'Vacanțe de familie',
      tips: [
        'Look for destinations with activities for children',
        'Check prices for the summer season',
        'Search for vacation offers with transport included'
      ]
    }
  ];

  return (
    <div className="max-w-4xl mx-auto">
      {/* Enhanced Header */}
      <div className="text-center mb-8">
        <div className={`w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg ${offlineMode
            ? 'bg-gradient-to-br from-blue-500 to-cyan-500' : 'bg-gradient-to-br from-primary to-secondary'
          }`}>
          <Icon name={offlineMode ? 'Database' : 'Plane'} size={32} color="white" />
        </div>
        <h1 className="text-3xl font-bold text-foreground mb-2">
          {offlineMode ? 'TravelAI Offline Mode! 🛄' : 'Welcome to TravelAI! ✈️'}
        </h1>
        <p className="text-lg text-muted-foreground">
          {offlineMode
            ? 'Basic functions and local recommendations available' : 'Your personal assistant for perfect travels'
          }
        </p>

        {/* Enhanced Service Status Message */}
        {serviceStatus && (
          <div className={`mt-4 p-4 rounded-lg border ${serviceStatus?.status === 'quota_exceeded' ? 'bg-orange-50 border-orange-200'
              : serviceStatus?.status === 'offline' ? 'bg-blue-50 border-blue-200' : 'bg-yellow-50 border-yellow-200'
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
              <span className={`font-medium ${serviceStatus?.status === 'quota_exceeded' ? 'text-orange-800' :
                  serviceStatus?.status === 'offline' ? 'text-blue-800' : 'text-yellow-800'
                }`}>
                {serviceStatus?.status === 'quota_exceeded' && 'AI Service is on daily break'}
                {serviceStatus?.status === 'offline' && 'Operating in offline mode'}
                {serviceStatus?.status === 'error' && 'Service temporarily unavailable'}
                {serviceStatus?.status === 'rate_limited' && 'High traffic - reduced functions'}
              </span>
            </div>
            <p className="text-sm text-muted-foreground mt-2 text-center">
              {serviceStatus?.status === 'quota_exceeded' && `Reset: ${serviceStatus?.resetTime}. Offline functions fully functional!`}
              {serviceStatus?.status === 'offline' && 'All basic functions and local recommendations are available'}
              {serviceStatus?.status === 'error' && 'Try again later or use offline functions'}
              {serviceStatus?.status === 'rate_limited' && 'Automatic retry in progress'}
            </p>

            {/* Enhanced capabilities display */}
            {serviceStatus?.capabilities && (
              <div className="mt-3 p-3 bg-background/60 rounded-lg">
                <p className="text-sm font-medium text-muted-foreground mb-2">Active functions</p>
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
          <span>{offlineMode ? '📱 Offline options' : '🚀 Quick start'}</span>
          {offlineMode && (
            <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
              Local cache
            </span>
          )}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {quickStartOptions?.map((option, index) => (
            <Button
              key={index}
              variant="outline"
              className={`p-6 h-auto text-left justify-start hover:bg-primary/5 transition-all duration-200 group ${offlineMode ? 'border-blue-200 hover:border-blue-300' : ''
                }`}
              onClick={() => handleQuickStart(option?.message)}
            >
              <div className="flex items-start space-x-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform ${offlineMode
                    ? 'bg-gradient-to-br from-blue-100 to-cyan-100' : 'bg-gradient-to-br from-primary/20 to-secondary/20'
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
                      <span className="text-xs text-blue-600">Available offline</span>
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
      <div className={`bg-card border rounded-lg p-6 ${offlineMode ? 'border-blue-200 bg-blue-50/30' : 'border-border'
        }`}>
        <h3 className="font-semibold text-foreground mb-4">
          {offlineMode ? 'Offline question examples:' : 'Question examples:'}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          <Button
            variant="ghost"
            className="text-left justify-start h-auto p-3"
            onClick={() => handleSuggestionClick(offlineMode ? 'Information about Greece from cache' : 'Find me a vacation in Greece under 500€')}>
            <Icon name="MessageSquare" size={16} className={`mr-2 ${offlineMode ? 'text-blue-600' : 'text-primary'}`} />
            {offlineMode ? '"Information about Greece from cache"' : '"Find me a vacation in Greece under 500€"'}
          </Button>

          <Button
            variant="ghost"
            className="text-left justify-start h-auto p-3"
            onClick={() => handleSuggestionClick(offlineMode ? 'Paris tourist guide offline' : 'I want a romantic city break in Paris')}>
            <Icon name="MessageSquare" size={16} className={`mr-2 ${offlineMode ? 'text-blue-600' : 'text-primary'}`} />
            {offlineMode ? '"Paris tourist guide offline"' : '"I want a romantic city break in Paris"'}
          </Button>

          <Button
            variant="ghost"
            className="text-left justify-start h-auto p-3"
            onClick={() => handleSuggestionClick(offlineMode ? 'Romania destinations from local database' : 'Recommend a Mediterranean cruise')}>
            <Icon name="MessageSquare" size={16} className={`mr-2 ${offlineMode ? 'text-blue-600' : 'text-primary'}`} />
            {offlineMode ? '"Romania destinations from local database"' : '"Recommend a Mediterranean cruise"'}
          </Button>

          <Button
            variant="ghost"
            className="text-left justify-start h-auto p-3"
            onClick={() => handleSuggestionClick(offlineMode ? 'General travel tips' : 'I am looking for a ski trip in the Alps')}>
            <Icon name="MessageSquare" size={16} className={`mr-2 ${offlineMode ? 'text-blue-600' : 'text-primary'}`} />
            {offlineMode ? '"General travel tips"' : '"I am looking for a ski trip in the Alps"'}
          </Button>
        </div>
      </div>
      {/* AI Features Highlight */}
      <div className="mt-8 text-center">
        <div className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full ${offlineMode
            ? 'bg-blue-100 text-blue-700' : 'bg-primary/10 text-primary'
          }`}>
          <Icon name={offlineMode ? 'Database' : 'Sparkles'} size={16} />
          <span className="text-sm font-medium">
            {offlineMode
              ? 'Offline Mode - Local database of destinations and guides' : 'Powered by OpenAI GPT-4 - Intelligent and personalized answers'
            }
          </span>
        </div>
        {offlineMode && (
          <p className="text-xs text-muted-foreground mt-2">
            Full functions available when the AI service reconnects
          </p>
        )}
      </div>
    </div>
  );
};

export default WelcomeScreen;