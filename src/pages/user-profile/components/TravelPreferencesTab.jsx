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
          console.warn("User is not authenticated.");
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
          console.error("Error reading preferences:", error.message);
        }

        setPreferences(
          data || {
            preferred_destinations: [],
            budget_range: "medium",
            accommodation_stars: "4",
            meal_plan: "breakfast",
            group_size: "2",
            travel_style: [],
          }
        );
      } catch (err) {
        console.error("Error loading:", err.message);
      } finally {
        setLoading(false);
      }
    };

    loadPreferences();
  }, []);

  // 🔹 Salvează preferințele utilizatorului
  const handleSavePreferences = async () => {
    if (!userId) {
      alert("You are not authenticated.");
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

      alert("Preferences have been saved successfully!");
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving:", error.message);
      alert("An error occurred while saving preferences!");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Opțiuni afișate în română
  const destinationOptions = [
    { value: "europe", label: "Europe" },
    { value: "asia", label: "Asia" },
    { value: "america", label: "America" },
    { value: "africa", label: "Africa" },
    { value: "oceania", label: "Oceania" },
    { value: "orient", label: "Middle East" },
  ];

  const budgetOptions = [
    { value: "economic", label: "Economic (500–1000 €)" },
    { value: "medium", label: "Medium (1000–2500 €)" },
    { value: "premium", label: "Premium (2500–5000 €)" },
    { value: "luxury", label: "Luxury (5000 €+)" },
  ];

  const starOptions = [
    { value: "3", label: "3 stars" },
    { value: "4", label: "4 stars" },
    { value: "5", label: "5 stars" },
    { value: "any", label: "Any" },
  ];

  const mealOptions = [
    { value: "none", label: "No meals" },
    { value: "breakfast", label: "Breakfast included" },
    { value: "half-board", label: "Half board" },
    { value: "full-board", label: "Full board" },
    { value: "all-inclusive", label: "All inclusive" },
  ];

  const groupSizeOptions = [
    { value: "1", label: "Solo" },
    { value: "2", label: "Couple (2 persons)" },
    { value: "3-4", label: "Small group (3–4 persons)" },
    { value: "5+", label: "Large group (5+ persons)" },
  ];

  const travelStyles = [
    { id: "adventure", label: "Adventure & outdoor", icon: "Mountain" },
    { id: "cultural", label: "Cultural & historical", icon: "Landmark" },
    { id: "relaxation", label: "Relaxation & beach", icon: "Waves" },
    { id: "urban", label: "Urban & city-break", icon: "Building" },
    { id: "nature", label: "Nature & landscapes", icon: "Trees" },
    { id: "gastronomy", label: "Gastronomy & wine", icon: "UtensilsCrossed" },
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
        <Icon name="Loader2" className="animate-spin inline-block mr-2" /> Loading preferences...
      </div>
    );

  return (
    <div className="space-y-6">
      {/* 🔹 Formular principal */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-foreground">
              Travel Preferences
            </h3>
            <p className="text-sm text-muted-foreground">
              Set up your preferences for personalized AI recommendations
            </p>
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

        {/* Selectori */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Select
            label="Preferred destinations"
            options={destinationOptions}
            value={preferences.preferred_destinations}
            onChange={(v) => handleChange("preferred_destinations", v)}
            multiple
            disabled={!isEditing}
          />
          <Select
            label="Budget"
            options={budgetOptions}
            value={preferences.budget_range}
            onChange={(v) => handleChange("budget_range", v)}
            disabled={!isEditing}
          />
          <Select
            label="Accommodation"
            options={starOptions}
            value={preferences.accommodation_stars}
            onChange={(v) => handleChange("accommodation_stars", v)}
            disabled={!isEditing}
          />
          <Select
            label="Meal Type"
            options={mealOptions}
            value={preferences.meal_plan}
            onChange={(v) => handleChange("meal_plan", v)}
            disabled={!isEditing}
          />
          <Select
            label="Group Size"
            options={groupSizeOptions}
            value={preferences.group_size}
            onChange={(v) => handleChange("group_size", v)}
            disabled={!isEditing}
          />
        </div>

        {/* Stil de călătorie */}
        <div className="mt-6">
          <h4 className="text-md font-medium text-foreground mb-4">
            Travel Style
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
              Cancel
            </Button>
            <Button onClick={handleSavePreferences} iconName="Save" loading={loading}>
              Save preferences
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
            <h4 className="font-medium text-foreground">AI Recommendation Engine</h4>
            <p className="text-sm text-muted-foreground">
              Your preferences are used to generate personalized offers in real-time.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div className="text-center p-4 bg-muted rounded-lg">
            <div className="text-2xl font-bold text-primary">{aiStats?.match}%</div>
            <div className="text-sm text-muted-foreground">Recommendation accuracy</div>
          </div>
          <div className="text-center p-4 bg-muted rounded-lg">
            <div className="text-2xl font-bold text-success">{aiStats?.deals}</div>
            <div className="text-sm text-muted-foreground">Deals found</div>
          </div>
          <div className="text-center p-4 bg-muted rounded-lg">
            <div className="text-2xl font-bold text-warning">€{aiStats?.savings}</div>
            <div className="text-sm text-muted-foreground">Estimated savings</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TravelPreferencesTab;
