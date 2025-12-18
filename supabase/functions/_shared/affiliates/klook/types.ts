export type KlookRawResponse = {
  results?: any[];
};

export type KlookActivityOffer = {
  provider: "klook";
  city: string;
  title: string;
  price: number | null;
  currency: string | null;
  rating: number | null;
  image: string | null;
  affiliate_url: string;
};
