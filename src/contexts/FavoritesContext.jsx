import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "./AuthContext";

const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
    const { user } = useAuth();
    const [favorites, setFavorites] = useState([]);

    useEffect(() => {
        if (!user) return setFavorites([]);

        supabase
            .from("saved_offers")
            .select("*")
            .eq("user_id", user.id)
            .then(({ data }) => setFavorites(data || []));
    }, [user]);

    const toggleFavorite = async (offer) => {
        const existing = favorites.find(
            f => f.offer_id === offer.id && f.provider === offer.provider
        );

        if (existing) {
            await supabase.from("saved_offers").delete().eq("id", existing.id);
            setFavorites(favorites.filter(f => f.id !== existing.id));
        } else {
            const payload = {
                user_id: user.id,
                offer_id: offer.id,
                provider: offer.provider,
                title: offer.title,
                image: offer.image_url,
                price: offer.price,
                link: offer.cta?.url,
                type: offer.type,
            };

            const { data } = await supabase
                .from("saved_offers")
                .insert(payload)
                .select()
                .single();

            setFavorites([data, ...favorites]);
        }
    };

    return (
        <FavoritesContext.Provider value={{ favorites, toggleFavorite }}>
            {children}
        </FavoritesContext.Provider>
    );
};

export const useFavorites = () => useContext(FavoritesContext);
