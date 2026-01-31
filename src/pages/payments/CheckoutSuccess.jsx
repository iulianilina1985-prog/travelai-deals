import React, { useEffect } from "react";
import SEO from "../../components/seo/SEO";

const CheckoutSuccess = () => {
  useEffect(() => {
    // poate notifica backend-ul, poate reîncărca statusul abonamentului
  }, []);

  return (
    <div className="p-10 text-center">
      <SEO
        title="Checkout success"
        description="Payment processed successfully."
        canonicalPath="/checkout-success"
        noindex
      />
      <h1 className="text-3xl font-bold text-green-600">
        Plata a fost procesată cu succes! 🎉
      </h1>
      <p className="mt-4 text-lg">
        Abonamentul tău este activ. Poți continua să folosești TravelAI la capacitate maximă!
      </p>
    </div>
  );
};

export default CheckoutSuccess;
