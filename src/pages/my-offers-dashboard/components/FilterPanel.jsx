import React, { useState, useEffect } from "react";
import Icon from "../../../components/AppIcon";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import Select from "../../../components/ui/Select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./datepicker-custom.css"; // 🎨 Stil pentru zilele colorate

const FilterPanel = ({
  filters,
  onFiltersChange,
  onClearFilters,
  isCollapsed,
  onToggleCollapse,
  onApplyFilters, // butonul „Caută”
}) => {
  // 🔹 Tipuri de oferte
  const dealTypeOptions = [
    { value: "all", label: "Toate tipurile" },
    { value: "flight", label: "Zboruri" },
    { value: "hotel", label: "Hoteluri" },
    { value: "package", label: "Pachete complete" },
    { value: "car", label: "Închirieri auto" },
  ];

  // 🔹 Sortare
  const sortOptions = [
    { value: "newest", label: "Cele mai noi" },
    { value: "price_low", label: "Preț crescător" },
    { value: "price_high", label: "Preț descrescător" },
    { value: "expiry", label: "Expiră în curând" },
    { value: "rating", label: "Rating înalt" },
  ];

  // 🔹 State pentru selecția intervalului
  const [dateRange, setDateRange] = useState([
    filters?.startDate ? new Date(filters.startDate) : null,
    filters?.endDate ? new Date(filters.endDate) : null,
  ]);
  const [startDate, endDate] = dateRange;

  // sincronizare cu filtrele globale
  useEffect(() => {
    onFiltersChange({
      ...filters,
      startDate: startDate ? startDate.toISOString().split("T")[0] : "",
      endDate: endDate ? endDate.toISOString().split("T")[0] : "",
    });
  }, [startDate, endDate]);

  // funcție auxiliară
  const handleFilterChange = (key, value) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  };

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      {/* 🔹 Header mobil */}
      <div className="md:hidden flex items-center justify-between p-4 border-b border-border">
        <h3 className="font-semibold text-foreground">Filtre și sortare</h3>
        <Button variant="ghost" size="icon" onClick={onToggleCollapse}>
          <Icon name={isCollapsed ? "ChevronDown" : "ChevronUp"} size={20} />
        </Button>
      </div>

      {/* 🔹 Conținut */}
      <div className={`${isCollapsed ? "hidden md:block" : "block"}`}>
        <div className="p-4 space-y-4">
          {/* 🔎 Căutare generală */}
          <Input
            type="search"
            placeholder="Caută oferte..."
            value={filters?.search || ""}
            onChange={(e) => handleFilterChange("search", e.target.value)}
          />

          {/* 🏙 Destinație liberă */}
          <Input
            type="text"
            label="Destinație"
            placeholder="Ex: Roma, Atena, Dubai..."
            value={filters?.destination || ""}
            onChange={(e) => handleFilterChange("destination", e.target.value)}
          />

          {/* 🧳 Tip ofertă */}
          <Select
            label="Tip ofertă"
            options={dealTypeOptions}
            value={filters?.dealType || "all"}
            onChange={(value) => handleFilterChange("dealType", value)}
          />

          {/* 💶 Interval de preț */}
          <div className="grid grid-cols-2 gap-2">
            <Input
              type="number"
              label="Preț minim (€)"
              placeholder="0"
              min="0"
              value={filters?.minPrice || ""}
              onChange={(e) => handleFilterChange("minPrice", e.target.value)}
            />
            <Input
              type="number"
              label="Preț maxim (€)"
              placeholder="5000"
              min="0"
              value={filters?.maxPrice || ""}
              onChange={(e) => handleFilterChange("maxPrice", e.target.value)}
            />
          </div>

          {/* 📅 Interval de date */}
          <div>
            <label className="text-sm font-medium text-foreground">
              Perioada călătoriei
            </label>
            <DatePicker
              selectsRange
              startDate={startDate}
              endDate={endDate}
              onChange={(update) => setDateRange(update)}
              minDate={new Date()} // 🔒 Blochează trecutul
              dateFormat="dd/MM/yyyy"
              placeholderText="Selectează perioada"
              monthsShown={2}
              showMonthDropdown
              showYearDropdown
              dropdownMode="select"
              className="w-full p-2 text-sm border border-border rounded-md bg-background placeholder:text-xs"
            />
          </div>

          {/* 🔽 Sortare */}
          <Select
            label="Sortează după"
            options={sortOptions}
            value={filters?.sortBy || "newest"}
            onChange={(value) => handleFilterChange("sortBy", value)}
          />

          {/* 🧭 Butoane acțiune */}
          <div className="flex flex-col gap-2 pt-3">
            <Button
              variant="default"
              size="sm"
              className="w-full"
              onClick={onApplyFilters}
            >
              <Icon name="Search" size={14} className="mr-1" />
              Caută oferte
            </Button>

            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={onClearFilters}
            >
              <Icon name="X" size={14} className="mr-1" />
              Resetează
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;
