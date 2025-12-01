import React, { useEffect } from "react";

const CheckoutSuccess = () => {
  useEffect(() => {
    // poate notifica backend-ul, poate reîncărca statusul abonamentului
  }, []);

  return (
    <div className="p-10 text-center">
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
