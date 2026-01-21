import React from "react";
import { useFavorites } from "../../contexts/FavoritesContext";
import Button from "../../components/ui/Button";
import Icon from "../../components/AppIcon";
import OfferCard from "../../components/OfferCard";

export default function FavoritesPage() {
    const { favorites, toggleFavorite } = useFavorites();

    const handleRefresh = () => {
        window.location.reload();
    };

    return (
        <div className="max-w-6xl mx-auto p-4 pt-24 pb-20">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-900">Favorite</h1>
                    <p className="text-slate-600 mt-2">
                        Your saved offers from AI Chat and Searches.
                    </p>
                </div>

                <Button variant="outline" onClick={handleRefresh} iconName="RefreshCw">
                    Reîncarcă
                </Button>
            </div>

            <div className="border-b mb-8" />

            {favorites.length === 0 ? (
                <div className="p-12 text-center border-2 border-dashed rounded-2xl bg-white">
                    <div className="text-4xl mb-4">❤️</div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        N-ai încă favorite
                    </h3>
                    <p className="text-gray-600">
                        Save an offer from AI Chat or from Search Offers to see it here.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {favorites.map((o) => (
                        <OfferCard
                            key={o.id || o.offer_id}
                            offer={o.raw || o} // raw conține obiectul original
                            mode="live"
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
