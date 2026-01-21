import React, { useEffect, useMemo, useState } from "react";
import { AFFILIATES } from "../../../affiliates/registry";

const ROTATE_EVERY_MS = 5000;
const ITEMS_PER_PAGE = 8;

const PartnersSection = () => {
  const partners = useMemo(() => {
    return Object.values(AFFILIATES).filter(p => p.image_url);
  }, []);

  const [page, setPage] = useState(0);

  const totalPages = Math.ceil(partners.length / ITEMS_PER_PAGE);

  useEffect(() => {
    if (totalPages <= 1) return;

    const interval = setInterval(() => {
      setPage(prev => (prev + 1) % totalPages);
    }, ROTATE_EVERY_MS);

    return () => clearInterval(interval);
  }, [totalPages]);

  const visiblePartners = partners.slice(
    page * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE + ITEMS_PER_PAGE
  );

  return (
    <section className="w-full py-16 bg-white">
      <div className="max-w-7xl mx-auto px-6 text-center">

        <h2 className="text-2xl lg:text-3xl font-bold mb-12 text-foreground">
          Ofertele sunt verificate automat prin partenerii noștri oficiali
        </h2>

        <div
          className="
            grid
            grid-cols-2
            sm:grid-cols-3
            md:grid-cols-4
            lg:grid-cols-8
            gap-12
            place-items-center
          "
        >
          {visiblePartners.map((p) => (
            <a
              key={p.id}
              href={p.buildLink()}
              target="_blank"
              rel="noopener noreferrer"
              title={p.name}
              className="
                flex items-center justify-center
                opacity-80
                hover:opacity-100
                hover:scale-105
                transition
                duration-300
              "
            >
              <img
                src={p.image_url}
                alt={p.name}
                loading="lazy"
                className="
                    h-20
                    sm:h-24
                    md:h-28
                    lg:h-32
                    object-contain
                    transition
                    duration-300
                  "
              />

            </a>
          ))}
        </div>

      </div>
    </section>
  );
};

export default PartnersSection;
