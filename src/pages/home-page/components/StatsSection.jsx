import React from "react";
import Icon from "../../../components/AppIcon";

const StatsSection = () => {
  return (
    <section className="max-w-7xl mx-auto px-6 py-20">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">

        <div className="space-y-3">
          <Icon name="Plane" size={40} color="var(--color-primary)" />
          <h3 className="text-xl font-semibold">
            Multi-platform travel search
          </h3>
          <p className="text-muted-foreground text-sm">
            TravelAI explores flights, stays, activities and extras across trusted travel platforms.
          </p>
        </div>

        <div className="space-y-3">
          <Icon name="Sparkles" size={40} color="var(--color-primary)" />
          <h3 className="text-xl font-semibold">
            AI-assisted recommendations
          </h3>
          <p className="text-muted-foreground text-sm">
            Intelligent analysis highlights relevant options based on your destination and preferences.
          </p>
        </div>

        <div className="space-y-3">
          <Icon name="Users" size={40} color="var(--color-primary)" />
          <h3 className="text-xl font-semibold">
            Direct booking, full control
          </h3>
          <p className="text-muted-foreground text-sm">
            You are always redirected to the provider’s official website to complete your booking.
          </p>
        </div>

      </div>
    </section>

  );
};

export default StatsSection;
