import React, { useState, useEffect } from "react";
import Select from "../../../components/ui/Select";
import { Checkbox } from "../../../components/ui/Checkbox";
import Button from "../../../components/ui/Button";
import Icon from "../../../components/AppIcon";
import { supabase } from "../../../lib/supabase";

const TravelPreferencesTab = () => {
  const [preferences, setPreferences] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);

  // 🔹 Încarcă userul curent și preferințele salvate
  useEffect(() => {
    const loadPreferences = async () => {
      try {
        const { data: userData, error: userError } = await supabase.auth.getUser();
        if (userError || !userData?.user) {
          console.warn("Utilizatorul nu este autentificat.");
          setLoading(false);
          return;
        }

        const user = userData.user;
        setUserId(user.id);

        const { data, error } = await supabase
          .from("travel_preferences")
          .select("*")
          .eq("user_id", user.id)
          .single();

        if (error && error.code !== "PGRST116") {
          console.error("Eroare la citirea preferințelor:", error.message);
        }

        setPreferences(
          data || {
            preferred_destinations: [],
            budget_range: "mediu",
            accommodation_stars: "4",
            meal_plan: "mic-dejun",
            group_size: "2",
            travel_style: [],
          }
        );
      } catch (err) {
        console.error("Eroare la încărcare:", err.message);
      } finally {
        setLoading(false);
      }
    };

    loadPreferences();
  }, []);

  // 🔹 Salvează preferințele utilizatorului
  const handleSavePreferences = async () => {
    if (!userId) {
      alert("Nu ești autentificat.");
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase
        .from("travel_preferences")
        .upsert({
          user_id: userId,
          ...preferences,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;

      alert("Preferințele au fost salvate cu succes!");
      setIsEditing(false);
    } catch (error) {
      console.error("Eroare la salvare:", error.message);
      alert("A apărut o eroare la salvarea preferințelor!");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Opțiuni afișate în română
  const destinationOptions = [
    { value: "europa", label: "Europa" },
    { value: "asia", label: "Asia" },
    { value: "america", label: "America" },
    { value: "africa", label: "Africa" },
    { value: "oceania", label: "Oceania" },
    { value: "orient", label: "Orientul Mijlociu" },
  ];

  const budgetOptions = [
    { value: "economic", label: "Economic (500–1000 €)" },
    { value: "mediu", label: "Mediu (1000–2500 €)" },
    { value: "premium", label: "Premium (2500–5000 €)" },
    { value: "lux", label: "Lux (5000 €+)" },
  ];

  const starOptions = [
    { value: "3", label: "3 stele" },
    { value: "4", label: "4 stele" },
    { value: "5", label: "5 stele" },
    { value: "oricare", label: "Oricare" },
  ];

  const mealOptions = [
    { value: "fara", label: "Fără masă" },
    { value: "mic-dejun", label: "Mic dejun inclus" },
    { value: "demipensiune", label: "Demipensiune" },
    { value: "pensiune-completa", label: "Pensiune completă" },
    { value: "all-inclusive", label: "All inclusive" },
  ];

  const groupSizeOptions = [
    { value: "1", label: "Solo" },
    { value: "2", label: "Cuplu (2 persoane)" },
    { value: "3-4", label: "Grup mic (3–4 persoane)" },
    { value: "5+", label: "Grup mare (5+ persoane)" },
  ];

  const travelStyles = [
    { id: "aventura", label: "Aventură & outdoor", icon: "Mountain" },
    { id: "cultural", label: "Cultural & istoric", icon: "Landmark" },
    { id: "relaxare", label: "Relaxare & plajă", icon: "Waves" },
    { id: "urban", label: "Urban & city-break", icon: "Building" },
    { id: "natura", label: "Natură & peisaje", icon: "Trees" },
    { id: "gastronomie", label: "Gastronomie & vinuri", icon: "UtensilsCrossed" },
  ];

  const handleChange = (key, value) =>
    setPreferences((prev) => ({ ...prev, [key]: value }));

  const handleStyleChange = (style, checked) => {
    setPreferences((prev) => ({
      ...prev,
      travel_style: checked
        ? [...prev.travel_style, style]
        : prev.travel_style.filter((s) => s !== style),
    }));
  };

  // 🔹 Simulare AI — înlocuibil ulterior cu un endpoint real
  const aiStats = preferences
    ? {
        match: Math.floor(Math.random() * 10) * 10 + 70,
        deals: Math.floor(Math.random() * 200) + 50,
        savings: Math.floor(Math.random() * 2000) + 500,
      }
    : null;

  if (loading)
    return (
      <div className="p-6 text-center text-muted-foreground">
        <Icon name="Loader2" className="animate-spin inline-block mr-2" /> Se încarcă preferințele...
      </div>
    );

  return (
    <div className="space-y-6">
      {/* 🔹 Formular principal */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-foreground">
              Preferințe de călătorie
            </h3>
            <p className="text-sm text-muted-foreground">
              Configurează-ți preferințele pentru recomandări AI personalizate
            </p>
          </div>
          <Button
            variant={isEditing ? "outline" : "default"}
            size="sm"
            iconName={isEditing ? "X" : "Edit"}
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? "Renunță" : "Editează"}
          </Button>
        </div>

        {/* Selectori */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Select
            label="Destinații preferate"
            options={destinationOptions}
            value={preferences.preferred_destinations}
            onChange={(v) => handleChange("preferred_destinations", v)}
            multiple
            disabled={!isEditing}
          />
          <Select
            label="Buget"
            options={budgetOptions}
            value={preferences.budget_range}
            onChange={(v) => handleChange("budget_range", v)}
            disabled={!isEditing}
          />
          <Select
            label="Cazare"
            options={starOptions}
            value={preferences.accommodation_stars}
            onChange={(v) => handleChange("accommodation_stars", v)}
            disabled={!isEditing}
          />
          <Select
            label="Tip masă"
            options={mealOptions}
            value={preferences.meal_plan}
            onChange={(v) => handleChange("meal_plan", v)}
            disabled={!isEditing}
          />
          <Select
            label="Mărimea grupului"
            options={groupSizeOptions}
            value={preferences.group_size}
            onChange={(v) => handleChange("group_size", v)}
            disabled={!isEditing}
          />
        </div>

        {/* Stil de călătorie */}
        <div className="mt-6">
          <h4 className="text-md font-medium text-foreground mb-4">
            Stil de călătorie
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {travelStyles.map((style) => (
              <div key={style.id} className="flex items-center space-x-3 p-3 bg-muted rounded-lg">
                <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center">
                  <Icon name={style.icon} size={16} />
                </div>
                <Checkbox
                  label={style.label}
                  checked={preferences.travel_style.includes(style.id)}
                  onChange={(e) => handleStyleChange(style.id, e.target.checked)}
                  disabled={!isEditing}
                />
              </div>
            ))}
          </div>
        </div>

        {isEditing && (
          <div className="flex justify-end mt-6 space-x-3">
            <Button variant="outline" onClick={() => setIsEditing(false)}>
              Anulează
            </Button>
            <Button onClick={handleSavePreferences} iconName="Save" loading={loading}>
              Salvează preferințele
            </Button>
          </div>
        )}
      </div>

      {/* 🔹 Secțiune AI - simulare */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-success text-success-foreground rounded-full flex items-center justify-center">
            <Icon name="Brain" size={20} />
          </div>
          <div>
            <h4 className="font-medium text-foreground">Motor de recomandări AI</h4>
            <p className="text-sm text-muted-foreground">
              Preferințele tale sunt folosite pentru a genera oferte personalizate în timp real.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div className="text-center p-4 bg-muted rounded-lg">
            <div className="text-2xl font-bold text-primary">{aiStats?.match}%</div>
            <div className="text-sm text-muted-foreground">Precizie recomandări</div>
          </div>
          <div className="text-center p-4 bg-muted rounded-lg">
            <div className="text-2xl font-bold text-success">{aiStats?.deals}</div>
            <div className="text-sm text-muted-foreground">Oferte găsite</div>
          </div>
          <div className="text-center p-4 bg-muted rounded-lg">
            <div className="text-2xl font-bold text-warning">€{aiStats?.savings}</div>
            <div className="text-sm text-muted-foreground">Economii estimate</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TravelPreferencesTab;
