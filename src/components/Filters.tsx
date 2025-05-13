// components/Filters.tsx
import { DatePicker, Input, Button, Select } from "antd";
import { Dayjs } from "dayjs";
import React from "react";
import { SelectOption } from "../types/comps";
import useAuthStore from "../store/auth";

interface FiltersProps {
  // Search filter
  searchTerm?: string;
  onSearchChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  searchPlaceholder?: string;

  // Date filter
  dateFilter?: Dayjs | null;
  onDateChange?: (date: Dayjs | null) => void;

  // Item filter
  itemFilter?: string | null;
  onItemChange?: (value: string | null) => void;
  itemOptions?: SelectOption[];
  itemPlaceholder?: string;

  // Month filter
  monthFilter?: number | null;
  onMonthChange?: (value: number | null) => void;
  monthOptions?: SelectOption[];
  monthPlaceholder?: string;

  // Year filter
  yearFilter?: number | null;
  onYearChange?: (value: number | null) => void;
  yearOptions?: SelectOption[];
  yearPlaceholder?: string;

  // Warehouse filter
  warehouseFilter?: string | null;
  onWarehouseChange?: (value: string | null) => void;
  warehouseOptions?: SelectOption[];
  warehousePlaceholder?: string;

  // Shift filter
  shiftFilter?: string | null;
  onShiftChange?: (value: string | null) => void;
  shiftOptions?: SelectOption[];
  shiftPlaceholder?: string;

  // Expense Category filter
  expenseCategoryFilter?: string | null;
  onExpenseCategoryChange?: (value: string | null) => void;
  expenseCategoryOptions?: SelectOption[];
  expenseCategoryPlaceholder?: string;

  // Reset
  onReset?: () => void;
}

export default function Filters({
  // Search
  searchTerm,
  onSearchChange,
  searchPlaceholder = "Search...",

  // Date
  dateFilter,
  onDateChange,

  // Item
  itemFilter,
  onItemChange,
  itemOptions,
  itemPlaceholder = "Select item",

  // month
  monthFilter,
  onMonthChange,
  monthOptions,
  monthPlaceholder = "Select month",

  // year
  yearFilter,
  onYearChange,
  yearOptions,
  yearPlaceholder = "Select year",

  // Warehouse
  warehouseFilter,
  onWarehouseChange,
  warehouseOptions,
  warehousePlaceholder = "Select warehouse",

  // Shift
  shiftFilter,
  onShiftChange,
  shiftOptions,
  shiftPlaceholder = "Select shift",

  // Expense Category
  expenseCategoryFilter,
  onExpenseCategoryChange,
  expenseCategoryOptions,
  expenseCategoryPlaceholder = "Select category",

  // Reset
  onReset,
}: FiltersProps) {
  const { userProfile } = useAuthStore();

  // Conditional rendering checks
  const shouldShowSearch = searchTerm !== undefined && onSearchChange;
  const shouldShowDate = onDateChange;
  const shouldShowItem =
    itemFilter !== undefined && onItemChange && itemOptions;
  const shouldShowMonth =
    monthFilter !== undefined && onMonthChange && monthOptions;
  const shouldShowYear =
    yearFilter !== undefined && onYearChange && yearOptions;
  const shouldShowWarehouse =
    warehouseFilter !== undefined &&
    onWarehouseChange &&
    warehouseOptions &&
    userProfile?.role === "SUPER ADMIN";
  const shouldShowShift =
    shiftFilter !== undefined && onShiftChange && shiftOptions;
  const shouldShowExpenseCategory =
    expenseCategoryFilter !== undefined &&
    onExpenseCategoryChange &&
    expenseCategoryOptions;

  return (
    <div className="mb-5 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
      {onReset && (
        <Button className="uppercase" onClick={onReset}>
          Reset All Filters
        </Button>
      )}

      {shouldShowDate && (
        <DatePicker
          className="w-56"
          onChange={onDateChange}
          value={dateFilter}
          format="YYYY-MM-DD"
        />
      )}

      {shouldShowSearch && (
        <Input
          className="w-56"
          value={searchTerm}
          onChange={onSearchChange}
          placeholder={searchPlaceholder}
          allowClear
        />
      )}

      {shouldShowItem && (
        <Select
          className="w-56"
          options={itemOptions}
          onChange={(value) => onItemChange(value || null)}
          value={itemFilter || undefined}
          placeholder={itemPlaceholder}
          showSearch
          optionFilterProp="label"
          allowClear
        />
      )}

      {shouldShowMonth && (
        <Select
          className="w-56"
          options={monthOptions}
          onChange={(value) => onMonthChange(value || null)}
          value={monthFilter || undefined}
          placeholder={monthPlaceholder}
          showSearch
          optionFilterProp="label"
          allowClear
        />
      )}

      {shouldShowYear && (
        <Select
          className="w-56"
          options={yearOptions}
          onChange={(value) => onYearChange(value || null)}
          value={yearFilter || undefined}
          placeholder={yearPlaceholder}
          showSearch
          optionFilterProp="label"
          allowClear
        />
      )}

      {shouldShowWarehouse && (
        <Select
          className="w-56"
          options={warehouseOptions}
          onChange={(value) => onWarehouseChange(value || null)}
          value={warehouseFilter || undefined}
          placeholder={warehousePlaceholder}
          showSearch
          optionFilterProp="label"
          allowClear
        />
      )}

      {shouldShowShift && (
        <Select
          className="w-56"
          options={shiftOptions}
          onChange={(value) => onShiftChange(value || null)}
          value={shiftFilter || undefined}
          placeholder={shiftPlaceholder}
          showSearch
          optionFilterProp="label"
          allowClear
        />
      )}

      {shouldShowExpenseCategory && (
        <Select
          className="w-56"
          options={expenseCategoryOptions}
          onChange={(value) => onExpenseCategoryChange(value || null)}
          value={expenseCategoryFilter || undefined}
          placeholder={expenseCategoryPlaceholder}
          showSearch
          optionFilterProp="label"
          allowClear
        />
      )}
    </div>
  );
}
