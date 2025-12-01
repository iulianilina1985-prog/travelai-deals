import React from "react";
import Icon from "../../../components/AppIcon";

const StatsSection = () => {
  return (
    <section className="max-w-7xl mx-auto px-6 py-20">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center">

        <div className="space-y-2">
          <Icon name="Plane" size={40} color="var(--color-primary)" />
          <h3 className="text-3xl font-bold">+150.000</h3>
          <p className="text-muted-foreground">Oferte analizate zilnic</p>
        </div>

        <div className="space-y-2">
          <Icon name="Sparkles" size={40} color="var(--color-primary)" />
          <h3 className="text-3xl font-bold">AI-Powered</h3>
          <p className="text-muted-foreground">Recomandări personalizate</p>
        </div>

        <div className="space-y-2">
          <Icon name="Users" size={40} color="var(--color-primary)" />
          <h3 className="text-3xl font-bold">+20.000</h3>
          <p className="text-muted-foreground">Utilizatori mulțumiți</p>
        </div>

      </div>
    </section>
  );
};

export default StatsSection;
