import React, { useState, useEffect } from "react";
import Icon from "../../../components/AppIcon";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import Select from "../../../components/ui/Select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./datepicker-custom.css";

const FilterPanel = ({
  filters,
  onFiltersChange,
  onClearFilters,
  isCollapsed,
  onToggleCollapse,
  onApplyFilters,
}) => {
  // 🔹 Deal types — EXTENDED with Klook, eSIM, Insurance
  const dealTypeOptions = [
    { value: "all", label: "All types" },
    { value: "flight", label: "Flights ✈️" },
    { value: "hotel", label: "Hotels 🏨" },
    { value: "package", label: "Complete packages 🎁" },
    { value: "car", label: "Rent a Car 🚗" },

    // 🔥 NEW
    { value: "activity", label: "Activities 🎟️" },     // Klook
    { value: "esim", label: "eSIM 🌐" },                // eSIM affiliation
    { value: "insurance", label: "Insurance 🛡️" },     // Travel insurance
  ];

  const sortOptions = [
    { value: "newest", label: "Newest" },
    { value: "price_low", label: "Price ascending" },
    { value: "price_high", label: "Price descending" },
    { value: "expiry", label: "Expiring soon" },
    { value: "rating", label: "High rating" },
  ];

  const [dateRange, setDateRange] = useState([
    filters?.startDate ? new Date(filters.startDate) : null,
    filters?.endDate ? new Date(filters.endDate) : null,
  ]);
  const [startDate, endDate] = dateRange;

  useEffect(() => {
    onFiltersChange({
      ...filters,
      startDate: startDate ? startDate.toISOString().split("T")[0] : "",
      endDate: endDate ? endDate.toISOString().split("T")[0] : "",
    });
  }, [startDate, endDate]);

  const handleFilterChange = (key, value) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  };

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">

      {/* Mobile header */}
      <div className="md:hidden flex items-center justify-between p-4 border-b border-border">
        <h3 className="font-semibold text-foreground">Filters and sorting</h3>
        <Button variant="ghost" size="icon" onClick={onToggleCollapse}>
          <Icon name={isCollapsed ? "ChevronDown" : "ChevronUp"} size={20} />
        </Button>
      </div>

      <div className={`${isCollapsed ? "hidden md:block" : "block"}`}>
        <div className="p-4 space-y-4">

          {/* 🔍 Search */}
          <Input
            type="search"
            placeholder="Search destinations, cities, hotels..."
            value={filters?.search || ""}
            onChange={(e) => handleFilterChange("search", e.target.value)}
          />

          {/* 🏙 Destination */}
          <Input
            type="text"
            label="Destination"
            placeholder="Ex: Rome, Athens, Dubai..."
            value={filters?.destination || ""}
            onChange={(e) => handleFilterChange("destination", e.target.value)}
          />

          {/* 🎁 Deal type */}
          <Select
            label="Deal type"
            options={dealTypeOptions}
            value={filters?.dealType || "all"}
            onChange={(value) => handleFilterChange("dealType", value)}
          />

          {/* 💶 Price */}
          <div className="grid grid-cols-2 gap-2">
            <Input
              type="number"
              label="Min price (€)"
              placeholder="0"
              min="0"
              value={filters?.minPrice || ""}
              onChange={(e) => handleFilterChange("minPrice", e.target.value)}
            />
            <Input
              type="number"
              label="Max price (€)"
              placeholder="5000"
              min="0"
              value={filters?.maxPrice || ""}
              onChange={(e) => handleFilterChange("maxPrice", e.target.value)}
            />
          </div>

          {/* 📅 Date interval */}
          <div>
            <label className="text-sm font-medium text-foreground">
              Travel period
            </label>

            <DatePicker
              selectsRange
              startDate={startDate}
              endDate={endDate}
              onChange={(update) => setDateRange(update)}
              minDate={new Date()}
              dateFormat="dd/MM/yyyy"
              placeholderText="Select period..."
              monthsShown={2}
              showMonthDropdown
              showYearDropdown
              dropdownMode="select"
              className="w-full p-2 text-sm border border-border rounded-md bg-background placeholder:text-xs"
            />
          </div>

          {/* 🔽 Sort */}
          <Select
            label="Sort by"
            options={sortOptions}
            value={filters?.sortBy || "newest"}
            onChange={(value) => handleFilterChange("sortBy", value)}
          />

          {/* ACTION BUTTONS */}
          <div className="flex flex-col gap-2 pt-3">
            <Button
              variant="default"
              size="sm"
              className="w-full"
              onClick={onApplyFilters}
            >
              <Icon name="Search" size={14} className="mr-1" />
              Search offers
            </Button>

            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={onClearFilters}
            >
              <Icon name="X" size={14} className="mr-1" />
              Reset
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;
