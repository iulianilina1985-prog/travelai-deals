import React from "react";

const CalendarFields = ({ checkIn, checkOut, onChange }) => {
  return (
    <div className="grid gap-4 md:grid-cols-2">

      {/* Check-in */}
      <div className="space-y-1">
        <label className="text-xs font-medium text-slate-600">
          From (check-in / departure)
        </label>
        <input
          type="date"
          value={checkIn}
          onChange={(e) => onChange("checkIn", e.target.value)}
          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 
                     text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
        />
      </div>

      {/* Check-out */}
      <div className="space-y-1">
        <label className="text-xs font-medium text-slate-600">
          To (check-out / return)
        </label>
        <input
          type="date"
          min={checkIn || ""}
          value={checkOut}
          onChange={(e) => onChange("checkOut", e.target.value)}
          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 
                     text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
        />
      </div>

    </div>
  );
};

export default CalendarFields;
