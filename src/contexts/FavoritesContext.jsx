import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "./AuthContext";

const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
    const { user } = useAuth();
    const [favorites, setFavorites] = useState([]);

    useEffect(() => {
        if (!user) {
            setFavorites([]);
            return;
        }

        supabase
            .from("saved_offers")
            .select("*")
            .eq("user_id", user.id)
            .order("created_at", { ascending: false })
            .then(({ data }) => setFavorites(data || []));
    }, [user]);

    const toggleFavorite = async (offer) => {
        if (!user) {
            alert("Te rog autentifică-te pentru a salva favorite.");
            return;
        }

        // Normalizare ID și Provider
        const offerId = offer.offer_id || offer.id || offer.cta?.url || offer.link;
        if (!offerId) {
            console.error("Missing offerId for favorite toggle", offer);
            return;
        }

        const provider = offer.provider || "Partner";

        const existing = favorites.find(
            f => (f.offer_id === offerId && f.provider === provider) || (offer.id && f.id === offer.id)
        );

        try {
            if (existing) {
                // 🗑️ DELETE
                const { error } = await supabase
                    .from("saved_offers")
                    .delete()
                    .eq("user_id", user.id)
                    .match({ id: existing.id }); // Folosim ID-ul exact daca il avem

                if (error) throw error;

                setFavorites(prev => prev.filter(f => f.id !== existing.id));
            } else {
                // ❤️ INSERT
                const payload = {
                    user_id: user.id,
                    offer_id: offerId,
                    provider: provider,
                    title: offer.title || "Oferta Salvată",
                    image: offer.image || offer.image_url || offer.thumbnail || null,
                    price: offer.price ?? null,
                    link: offer.link || offer.cta?.url || null,
                    type: offer.type || null,
                    // raw: removed because column does not exist
                };

                const { data, error } = await supabase
                    .from("saved_offers")
                    .insert(payload)
                    .select()
                    .single();

                if (error) throw error;
                if (data) {
                    setFavorites(prev => [data, ...prev]);
                }
            }
        } catch (err) {
            console.error("Error in toggleFavorite:", err);
            alert("Eroare la procesarea favoritei: " + (err.message || "Eroare necunoscută"));
        }
    };


    return (
        <FavoritesContext.Provider value={{ favorites, toggleFavorite }}>
            {children}
        </FavoritesContext.Provider>
    );
};

export const useFavorites = () => useContext(FavoritesContext);
