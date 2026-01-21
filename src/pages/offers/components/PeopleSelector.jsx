import React from "react";

const PeopleSelector = ({
  adults,
  children,
  childrenAges,
  handleCounterChange,
  onChildAgeChange
}) => {
  return (
    <div className="space-y-4">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
        Number of persons
      </h2>

      {/* Adults + Children + Budget */}
      <div className="grid gap-4 md:grid-cols-3">

        {/* Adults */}
        <div className="space-y-1">
          <label className="text-xs font-medium text-slate-600">Adults</label>

          <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5">
            <button
              type="button"
              onClick={() => handleCounterChange("adults", -1, 1, 10)}
              className="w-8 h-8 flex items-center justify-center rounded-full border border-slate-300 hover:bg-slate-100"
            >
              –
            </button>

            <span className="font-semibold">{adults}</span>

            <button
              type="button"
              onClick={() => handleCounterChange("adults", 1, 1, 10)}
              className="w-8 h-8 flex items-center justify-center rounded-full border border-slate-300 hover:bg-slate-100"
            >
              +
            </button>
          </div>
        </div>

        {/* Children */}
        <div className="space-y-1">
          <label className="text-xs font-medium text-slate-600">Children</label>

          <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5">
            <button
              type="button"
              onClick={() => handleCounterChange("children", -1, 0, 8)}
              className="w-8 h-8 flex items-center justify-center rounded-full border border-slate-300 hover:bg-slate-100"
            >
              –
            </button>

            <span className="font-semibold">{children}</span>

            <button
              type="button"
              onClick={() => handleCounterChange("children", 1, 0, 8)}
              className="w-8 h-8 flex items-center justify-center rounded-full border border-slate-300 hover:bg-slate-100"
            >
              +
            </button>
          </div>
        </div>

        {/* Maximum budget */}
        <div className="space-y-1">
          <label className="text-xs font-medium text-slate-600">
            Max budget (€)
          </label>
          <input
            type="number"
            min="0"
            onChange={(e) => onChildAgeChange("maxBudget", e.target.value)}
            placeholder="E.g.: 800"
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Children ages */}
      {children > 0 && (
        <div className="grid gap-3 md:grid-cols-2">
          {childrenAges.map((age, idx) => (
            <div key={idx} className="space-y-1">
              <label className="text-xs font-medium text-slate-600">
                Child {idx + 1} age
              </label>
              <select
                value={age}
                onChange={(e) => onChildAgeChange(idx, e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select age</option>
                {Array.from({ length: 17 }).map((_, age) => (
                  <option key={age} value={age}>
                    {age} years old
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PeopleSelector;
