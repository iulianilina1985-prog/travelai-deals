import React from "react";
import SEO from "../../components/seo/SEO";

const CheckoutCancel = () => {
  return (
    <div className="p-10 text-center">
      <SEO
        title="Checkout canceled"
        description="Payment canceled."
        canonicalPath="/checkout-cancel"
        noindex
      />
      <h1 className="text-3xl font-bold text-red-600">
        Ai anulat plata ❌
      </h1>
      <p className="mt-4 text-lg">
        Nu e nicio problemă — poți încerca oricând din nou.
      </p>
    </div>
  );
};

export default CheckoutCancel;
