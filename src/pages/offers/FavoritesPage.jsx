import React, { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import Button from "../../components/ui/Button";
import Icon from "../../components/AppIcon";

export default function FavoritesPage() {
    const [loading, setLoading] = useState(true);
    const [offers, setOffers] = useState([]);
    const [error, setError] = useState(null);

    async function loadFavorites() {
        setLoading(true);
        setError(null);

        try {
            const { data: userData, error: userError } = await supabase.auth.getUser();
            if (userError) throw userError;

            const user = userData?.user;
            if (!user) {
                setOffers([]);
                return;
            }

            const { data, error } = await supabase
                .from("saved_offers")
                .select("*")
                .eq("user_id", user.id)
                .order("created_at", { ascending: false });

            if (error) throw error;

            setOffers(data || []);
        } catch (e) {
            console.error("Favorites load error:", e);
            setError(e?.message || "Eroare la încărcarea favoritelor.");
        } finally {
            setLoading(false);
        }
    }

    async function handleDelete(id) {
        try {
            const { error } = await supabase.from("saved_offers").delete().eq("id", id);
            if (error) throw error;
            setOffers((prev) => prev.filter((x) => x.id !== id));
        } catch (e) {
            alert(e?.message || "Nu am putut șterge oferta.");
        }
    }

    useEffect(() => {
        loadFavorites();
    }, []);

    return (
        <div className="max-w-4xl mx-auto p-4">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h1 className="text-xl font-semibold">Favorite</h1>
                    <p className="text-sm text-muted-foreground">
                        Ofertele salvate (din AI Chat + din Caută Oferte)
                    </p>
                </div>

                <Button variant="outline" onClick={loadFavorites} iconName="RefreshCw">
                    Reîncarcă
                </Button>
            </div>

            {loading && (
                <div className="p-4 text-muted-foreground">
                    <Icon name="Loader2" className="animate-spin inline-block mr-2" />
                    Se încarcă...
                </div>
            )}

            {!loading && error && (
                <div className="p-4 border border-red-300 rounded bg-red-50 text-red-700">
                    {error}
                </div>
            )}

            {!loading && !error && offers.length === 0 && (
                <div className="p-6 border rounded text-muted-foreground">
                    N-ai încă favorite. Salvează o ofertă din AI Chat sau din Caută Oferte.
                </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {offers.map((o) => (
                    <div key={o.id} className="border rounded-lg overflow-hidden bg-card">
                        {o.image && (
                            <img
                                src={o.image}
                                alt={o.title || "Oferta"}
                                className="w-full h-40 object-cover"
                            />
                        )}

                        <div className="p-3">
                            <div className="text-sm text-muted-foreground mb-1">
                                {o.provider || "Provider"} • {o.offer_id || ""}
                            </div>

                            <div className="font-medium">{o.title || "Ofertă salvată"}</div>

                            <div className="flex items-center gap-2 mt-3">
                                <Button
                                    size="sm"
                                    onClick={() => window.open(o.link, "_blank")}
                                    iconName="ExternalLink"
                                >
                                    Vezi
                                </Button>

                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleDelete(o.id)}
                                    iconName="Trash2"
                                >
                                    Șterge
                                </Button>

                                <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => navigator.share?.({ title: o.title, url: o.link })}
                                    iconName="Share2"
                                >
                                    Share
                                </Button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
