import React from "react";
import Icon from "../../../components/AppIcon";

const OperatorsSelector = ({ operators = [], selected = [], toggle = () => { } }) => {
  return (
    <div className="space-y-3">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
        Operator(s)
      </h2>

      <p className="text-xs text-slate-500">
        You can select one or more. If you don't choose anything, we search among all partners.
      </p>

      <div className="flex flex-wrap gap-2">
        {operators.map((op) => {
          const active = selected.includes(op);

          return (
            <button
              key={op}
              type="button"
              onClick={() => toggle(op)}
              className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-medium border transition-all ${active
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                }`}
            >
              {op}
              {active && <Icon name="Check" size={14} color="white" />}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default OperatorsSelector;
