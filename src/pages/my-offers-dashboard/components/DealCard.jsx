import React from "react";
import Image from "../../../components/AppImage";
import Icon from "../../../components/AppIcon";
import Button from "../../../components/ui/Button";

const DealCard = ({ deal, onRemove, onShare, onViewDetails, onToggleSave }) => {
  const formatDate = (dateString) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleDateString("ro-RO", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const getDaysUntilExpiry = (expiryDate) => {
    if (!expiryDate) return null;
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diff = expiry - today;
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const daysLeft = getDaysUntilExpiry(deal?.expiry_date);
  const expiringSoon = daysLeft !== null && daysLeft <= 3;

  const isNew = deal?.is_new;
  const isSaved = deal?.is_saved;

  return (
    <div className="deal-card group border rounded-xl shadow-sm hover:shadow-lg transition overflow-hidden bg-card">
      {/* IMAGE */}
      <div className="relative">
        <div className="aspect-video overflow-hidden">
          <Image
            src={deal?.image_url}
            alt={deal?.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>

        {/* BADGES */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {isNew && (
            <span className="bg-success text-success-foreground px-2 py-1 rounded-md text-xs font-medium">
              Nou
            </span>
          )}
        </div>

        {/* EXPIRARE */}
        {expiringSoon && (
          <div className="absolute top-3 right-3">
            <span className="bg-destructive text-destructive-foreground px-2 py-1 rounded-md text-xs font-medium flex items-center gap-1">
              <Icon name="Clock" size={12} />
              {daysLeft} zile
            </span>
          </div>
        )}

        {/* ❤️ SAVE BUTTON */}
        <button
          onClick={() => onToggleSave?.(deal)}
          className="absolute bottom-3 left-3 bg-background/80 backdrop-blur-md p-2 rounded-full shadow hover:bg-background transition"
        >
          <Icon
            name={isSaved ? "Heart" : "Heart"}
            size={18}
            className={isSaved ? "text-red-500 fill-red-500" : "text-primary"}
            strokeWidth={isSaved ? 0 : 2}
          />
        </button>

        {/* SHARE + REMOVE */}
        <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <div className="flex gap-2">
            <Button
              variant="secondary"
              size="icon"
              onClick={() => onShare?.(deal)}
              className="bg-background/90 backdrop-blur-sm"
            >
              <Icon name="Share2" size={16} />
            </Button>

            <Button
              variant="destructive"
              size="icon"
              onClick={() => onRemove?.(deal.id)}
              className="bg-background/90 backdrop-blur-sm"
            >
              <Icon name="Trash2" size={16} />
            </Button>
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="p-4">
        {/* TITLE */}
        <h3 className="font-semibold text-lg line-clamp-2 mb-3">{deal?.title}</h3>

        {/* DETAILS */}
        <div className="space-y-2 text-sm text-muted-foreground mb-4">
          <div className="flex items-center gap-2">
            <Icon name="MapPin" size={14} />
            <span>{deal?.destination}</span>
          </div>

          <div className="flex items-center gap-2">
            <Icon name="Calendar" size={14} />
            <span>
              {formatDate(deal?.departure_date)} — {formatDate(deal?.return_date)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Icon name="Clock" size={14} />
            <span>Expiră: {formatDate(deal?.expiry_date)}</span>
          </div>
        </div>

        {/* RATING + PROVIDER */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Icon
                key={i}
                name="Star"
                size={14}
                className={
                  i < Math.round(deal?.rating || 0)
                    ? "text-warning fill-warning"
                    : "text-muted-foreground"
                }
              />
            ))}
          </div>

          <span className="text-xs text-muted-foreground">{deal?.provider}</span>
        </div>

        {/* BUTTONS */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onViewDetails?.(deal)}
            className="flex-1"
          >
            <Icon name="Eye" size={16} className="mr-2" />
            Detalii
          </Button>

          <Button
            variant="default"
            size="sm"
            className="flex-1"
            onClick={() =>
              window.open(deal?.booking_url || "https://www.booking.com", "_blank")
            }
          >
            <Icon name="ExternalLink" size={16} className="mr-2" />
            Vezi oferta
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DealCard;
