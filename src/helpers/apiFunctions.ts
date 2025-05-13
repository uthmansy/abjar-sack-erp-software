import { supabase } from "../lib/supabase";
import { ApiFilterOptions } from "../types/api";
import {
  DailyProductionSummary,
  Departments,
  EmployeePayrollJoined,
  Employees,
  Enrollment,
  Expenses,
  ExternalStocksAndPurchases,
  FinancialReportLedger,
  FinishedProductsJoint,
  InsertDepartments,
  InsertEmployees,
  InsertEnrollment,
  InsertExpenses,
  InsertFinishedProducts,
  InsertPaymentAccounts,
  InsertPayrolls,
  InventoryItems,
  InventoryTransfer,
  InventoryTransferInsert,
  InventoryTransferWithStocks,
  PaymentAccounts,
  PayrollsAndEmployees,
  Positions,
  ProductSubmissionWithDetails,
  ProductionWithItems,
  PurchaseItemsJoined,
  PurchasePaymentsJoined,
  Purchases,
  PurchasesAndPayments,
  RequestWithItems,
  Sales,
  SalesAndPayments,
  SalesItemsJoined,
  SalesPayments,
  SalesPaymentsJoined,
  StockIn,
  StockInWithDetails,
  Stocks,
  StocksJoined,
  StocksWithDetails,
  SubItemsWithDetails,
  UpdateEmployeePayroll,
  UpdateEmployees,
  UpdateExpenses,
  UpdateInventoryItems,
  UpdatePayrolls,
  UpdateProfile,
  UpdateRequests,
  UpdateSubmission,
  UpdateUserProfile,
  UserProfile,
  Vehicles,
  VehiclesAndDestination,
  Warehouses,
  vehicleStatus,
} from "../types/db";
import {
  AddFinishedProducts,
  AddMultiProductsSubmission,
  AddProductionRunsMultiProduct,
  AddProductionSubmission,
  CreateItemCollection,
  CreateProduction,
  CreateRequest,
  UpdateExpenseInput,
  UpdatePurchaseInput,
  UpdatePurchaseItem,
  UpdateSaleInput,
  UpdateSaleItem,
} from "../types/forms";
import { CreatePayrollBonus, PayrollBonus } from "../zodSchemas/payrollBonuses";
import { CreateDispatch } from "../zodSchemas/dispatch";
import { CreatePurchase } from "../zodSchemas/purchases";
import { ReceiveVehicles } from "../zodSchemas/receive";
import { CreateSaleType } from "../zodSchemas/sales";
import { CreateDeduction, Deduction } from "../zodSchemas/payrollDeductions";
import { getDateRange } from "./functions";
import { UpdateFinishedProductsType } from "../zodSchemas/finishedProducts";
import { ItemInflowType } from "../hooks/useItemRequestInflow";
import { UpdateRequestType } from "../zodSchemas/requests";

export const getAllWarehouses = async (
  pageNumber: number = 1
): Promise<Warehouses[]> => {
  const { data, error } = await supabase
    .from("warehouses")
    .select("*")
    .range((pageNumber - 1) * 50, pageNumber * 50 - 1)
    .order("created_at", { ascending: false });

  if (error) throw error.message;

  return data;
};

export const getAllStockPurchases = async ({
  pageParam,
  dateFilter,
  debouncedSearchTerm,
  itemFilter,
  monthFilter,
  yearFilter,
}: ApiFilterOptions): Promise<PurchasesAndPayments[]> => {
  const dateRange =
    monthFilter !== undefined && yearFilter !== undefined
      ? getDateRange(monthFilter, yearFilter)
      : null;
  let query = supabase
    .from("stock_purchases")
    .select(
      "*, payments:purchase_order_payments (*), items:purchase_items!inner(*, item_info:item(*))"
    )
    .range((pageParam - 1) * 50, pageParam * 50 - 1)
    .order("created_at", { ascending: false });

  if (dateFilter) query = query.eq("date", dateFilter);
  if (dateRange && !dateFilter)
    query = query.gte("date", dateRange.start).lte("date", dateRange.end);
  if (itemFilter) query = query.eq("items.item", itemFilter);
  if (debouncedSearchTerm)
    query = query.ilike("order_number", `%${debouncedSearchTerm}%`);

  const { data, error } = await query;

  if (error) throw error.message;

  return data;
};
export const getPayables = async ({
  pageParam,
}: ApiFilterOptions): Promise<PurchasesAndPayments[]> => {
  let query = supabase
    .from("stock_purchases")
    .select(
      "*, payments:purchase_order_payments (*), items:purchase_items!inner(*)"
    )
    .neq("balance", 0)
    .range((pageParam - 1) * 50, pageParam * 50 - 1)
    .order("created_at", { ascending: false });

  const { data, error } = await query;

  if (error) throw error.message;

  return data;
};
export const getCsvPayables = async (): Promise<PurchasesAndPayments[]> => {
  let query = supabase
    .from("stock_purchases")
    .select(
      "*, payments:purchase_order_payments (*), items:purchase_items!inner(*)"
    )
    .neq("balance", 0)
    .order("created_at", { ascending: false });

  const { data, error } = await query;

  if (error) throw error.message;

  return data;
};

export const getDepartments = async (
  pageNumber: number = 1
): Promise<Departments[]> => {
  const { data, error } = await supabase
    .from("departments")
    .select("*")
    .range((pageNumber - 1) * 50, pageNumber * 50 - 1)
    .order("created_at", { ascending: false });

  if (error) throw error.message;

  return data;
};

export const getEnrollments = async (
  pageNumber: number = 1
): Promise<Enrollment[]> => {
  const { data, error } = await supabase
    .from("user_enrollment")
    .select("*")
    .range((pageNumber - 1) * 50, pageNumber * 50 - 1)
    .order("created_at", { ascending: false });

  if (error) throw error.message;

  return data;
};

export const getExpenses = async ({
  pageParam,
  dateFilter,
  debouncedSearchTerm,
  expenseCategoryFilter,
  warehouseFilter,
}: ApiFilterOptions): Promise<Expenses[]> => {
  let query = supabase.from("expenses").select("*");

  if (dateFilter) query = query.eq("date", dateFilter);
  if (expenseCategoryFilter)
    query = query.eq("category", expenseCategoryFilter);
  if (debouncedSearchTerm)
    query = query.ilike("description", `%${debouncedSearchTerm}%`);
  if (warehouseFilter) {
    query = query.eq("warehouse", warehouseFilter);
  }

  // Apply ordering and pagination after filtering
  query = query
    .range((pageParam - 1) * 50, pageParam * 50 - 1)
    .order("created_at", { ascending: false });

  const { data, error } = await query;

  if (error) throw error.message;

  return data;
};
export const getSalesPayments = async (
  pageNumber: number = 1
): Promise<SalesPaymentsJoined[]> => {
  let query = supabase.from("sales_payments").select("*, sale:order_number(*)");

  // Apply ordering and pagination after filtering
  query = query
    .range((pageNumber - 1) * 50, pageNumber * 50 - 1)
    .order("created_at", { ascending: false });

  const { data, error } = await query;

  if (error) throw error.message;

  return data;
};
export const getSalesPaymentsCsv = async (): Promise<SalesPaymentsJoined[]> => {
  let query = supabase.from("sales_payments").select("*, sale:order_number(*)");

  query = query.order("created_at", { ascending: false });

  const { data, error } = await query;
  if (error) throw error.message;
  return data;
};

export const getPurchasePayments = async (
  pageNumber: number = 1
): Promise<PurchasePaymentsJoined[]> => {
  let query = supabase
    .from("purchase_order_payments")
    .select("*, purchase:order_number(*)");

  // Apply ordering and pagination after filtering
  query = query
    .range((pageNumber - 1) * 50, pageNumber * 50 - 1)
    .order("created_at", { ascending: false });

  const { data, error } = await query;

  if (error) throw error.message;

  return data;
};

export const getPayrolls = async (
  pageNumber: number = 1
): Promise<PayrollsAndEmployees[]> => {
  const { data, error } = await supabase
    .from("payrolls")
    .select("*, employeePayrolls:employee_payroll(*, employee:employee_id(*))")
    .range((pageNumber - 1) * 50, pageNumber * 50 - 1)
    .order("created_at", { ascending: false });

  if (error) throw error.message;
  return data;
};
export const getPayrollEmployees = async ({
  payrollId,
  // pageNumber = 1,
  debouncedSearchTerm,
}: {
  payrollId: string;
  pageNumber: number;
  debouncedSearchTerm: string;
}): Promise<EmployeePayrollJoined[]> => {
  let query = supabase
    .from("employee_payroll")
    .select("*, employee:employee_id!inner(*)")
    .eq("payroll_id", payrollId)
    .order("first_name", {
      referencedTable: "employee",
      ascending: false,
    });
  // .range((pageNumber - 1) * 50, pageNumber * 50 - 1);

  if (debouncedSearchTerm) {
    // Split search term into individual words (e.g. "musa isa" → ["musa", "isa"])
    const searchTerms = debouncedSearchTerm.trim().split(/\s+/);

    // Create OR conditions for each term in both first/last names
    const orConditions = searchTerms.flatMap((term) => [
      `first_name.ilike.%${term}%`,
      `last_name.ilike.%${term}%`,
    ]);

    query = query.or(orConditions.join(","), {
      foreignTable: "employee", // Apply to joined employee table
    });
  }
  // query = query.ilike("employee.first_name", `%${debouncedSearchTerm}%`);

  const { data, error } = await query;

  if (error) throw error.message;
  if (debouncedSearchTerm) return data;
  return data.sort((a, b) => {
    const firstNameComparison = a.employee.first_name.localeCompare(
      b.employee.first_name
    );
    if (firstNameComparison !== 0) return firstNameComparison;
    return a.employee.last_name.localeCompare(b.employee.last_name);
  });
};
export const getPayrollEmployeesAll = async ({
  payrollId,
}: {
  payrollId: string;
}): Promise<EmployeePayrollJoined[]> => {
  let query = supabase
    .from("employee_payroll")
    .select("*, employee:employee_id!inner(*)")
    .eq("payroll_id", payrollId)
    .order("id", { ascending: false });

  const { data, error } = await query;

  if (error) throw error.message;
  return data;
};

export const getPositions = async (
  pageNumber: number = 1
): Promise<Positions[]> => {
  const { data, error } = await supabase
    .from("positions")
    .select("*")
    .range((pageNumber - 1) * 50, pageNumber * 50 - 1)
    .order("created_at", { ascending: false });

  if (error) throw error.message;

  return data;
};

export const getAllSales = async (
  {
    pageParam,
    dateFilter,
    debouncedSearchTerm,
    itemFilter,
    warehouseFilter,
    monthFilter,
    yearFilter,
  }: ApiFilterOptions,
  receivables?: boolean
): Promise<SalesAndPayments[]> => {
  const dateRange =
    monthFilter !== undefined && yearFilter !== undefined
      ? getDateRange(monthFilter, yearFilter)
      : null;
  let query = supabase
    .from("sales")
    .select("*, payments:sales_payments (*), items:sales_items!inner(*)")
    .range((pageParam - 1) * 50, pageParam * 50 - 1)
    .order("created_at", { ascending: false });

  if (dateFilter) query = query.eq("date", dateFilter);
  if (dateRange && !dateFilter)
    query = query.gte("date", dateRange.start).lte("date", dateRange.end);
  if (itemFilter) query = query.eq("items.item_purchased", itemFilter);
  if (debouncedSearchTerm)
    query = query.ilike("customer_name", `%${debouncedSearchTerm}%`);
  if (warehouseFilter) {
    query = query.eq("warehouse", warehouseFilter);
  }

  if (receivables) {
    query = query.neq("payment_balance", 0);
  }

  const { data, error } = await query;

  if (error) {
    console.error(error);
    throw error.message;
  }

  return data;
};
export const getAssetValuations = async ({
  pageParam,
  warehouseFilter,
}: ApiFilterOptions): Promise<StocksJoined[]> => {
  let query = supabase
    .from("stocks")
    .select("*, item_info:item(*)")
    .range((pageParam - 1) * 50, pageParam * 50 - 1)
    .order("created_at", { ascending: false });

  if (warehouseFilter) {
    query = query.eq("warehouse", warehouseFilter);
  }

  const { data, error } = await query;

  if (error) {
    console.error(error);
    throw error.message;
  }

  return data;
};
export const getAllStocks = async (): Promise<StocksJoined[]> => {
  let query = supabase
    .from("stocks")
    .select("*, item_info:item(*)")
    .order("created_at", { ascending: false });
  const { data, error } = await query;
  if (error) {
    console.error(error);
    throw error.message;
  }

  return data;
};
export const getCsvReceivables = async (): Promise<SalesAndPayments[]> => {
  let query = supabase
    .from("sales")
    .select("*, payments:sales_payments (*), items:sales_items!inner(*)")
    .neq("payment_balance", 0)
    .order("created_at", { ascending: false });

  const { data, error } = await query;

  if (error) {
    console.error(error);
    throw error.message;
  }

  return data;
};

export const getSalesCsvData = async (): Promise<Sales[]> => {
  let query = supabase
    .from("sales")
    .select("*")
    .order("created_at", { ascending: false });

  const { data, error } = await query;

  if (error) {
    console.error(error);
    throw error.message;
  }
  return data;
};
export const getSaleByOrderNumber = async (
  orderNumber: string
): Promise<Sales> => {
  let query = supabase
    .from("sales")
    .select("*")
    .eq("order_number", orderNumber)
    .single();

  const { data, error } = await query;

  if (error) {
    console.error(error);
    throw error.message;
  }
  return data;
};
export const getPurchaseByOrderNumber = async (
  orderNumber: string
): Promise<Purchases> => {
  let query = supabase
    .from("stock_purchases")
    .select("*")
    .eq("order_number", orderNumber)
    .single();

  const { data, error } = await query;

  if (error) {
    console.error(error);
    throw error.message;
  }
  return data;
};
export const getAllEmployeesData = async (): Promise<Employees[]> => {
  let query = supabase.from("employees").select("*").order("first_name", {
    ascending: true,
  });

  const { data, error } = await query;

  if (error) {
    console.error(error);
    throw error.message;
  }
  return data;
};
export const getInventoryItemsData = async (): Promise<InventoryItems[]> => {
  let query = supabase
    .from("inventory_items")
    .select("*")
    .order("created_at", { ascending: false });

  const { data, error } = await query;

  if (error) {
    console.error(error);
    throw error.message;
  }
  return data;
};
export const getInventoryTransfersData = async (): Promise<
  InventoryTransfer[]
> => {
  let query = supabase
    .from("inventory_transfers")
    .select("*")
    .order("created_at", { ascending: false });

  const { data, error } = await query;

  if (error) {
    console.error(error);
    throw error.message;
  }
  return data;
};
export const getTable = async <T>(
  tableName: string,
  selection?: string
): Promise<T[]> => {
  let query = supabase
    .from(tableName)
    .select(selection || "*")
    .order("created_at", { ascending: false });

  const { data, error } = await query;

  if (error) {
    console.error(error);
    throw new Error(error.message);
  }

  return data as T[];
};

export const getTotalSalesReceivables = async (): Promise<number> => {
  const { data, error } = await supabase.rpc("get_total_sales_payment_balance");

  if (error) throw error.message;

  return data;
};
export const getTotalPurchasesPayables = async (): Promise<number> => {
  const { data, error } = await supabase.rpc(
    "get_total_purchases_payment_balance"
  );

  if (error) throw error.message;

  return data;
};

export const getUsers = async (
  pageNumber: number = 1
): Promise<UserProfile[]> => {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .range((pageNumber - 1) * 50, pageNumber * 50 - 1)
    .order("created_at", { ascending: false });

  if (error) throw error.message;

  return data;
};

export const getUncompletedSales = async (
  pageNumber: number = 1
): Promise<Sales[]> => {
  const { data, error } = await supabase
    .from("sales")
    .select("*")
    .gt("balance", 0)
    .range((pageNumber - 1) * 50, pageNumber * 50 - 1)
    .order("created_at", { ascending: false });

  if (error) throw error.message;

  return data;
};

export const getAllUncompletedSales = async (): Promise<SalesAndPayments[]> => {
  const { data, error } = await supabase
    .from("sales")
    .select(
      "*, payments:sales_payments (*), items:sales_items(*, purchase_item_info:purchase_item(*, purchase_info:purchase_id(*)))"
    )
    .eq("is_completed", false)
    .order("created_at", { ascending: false });

  if (error) throw error.message;

  return data;
};

export const getAllInternalStocks = async (): Promise<Stocks[]> => {
  const { data, error } = await supabase
    .from("stocks")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error.message;

  return data;
};

export const getVehicles = async (
  status: vehicleStatus = "dispatched",
  {
    pageParam,
    dateFilter,
    debouncedSearchTerm,
    monthFilter,
    warehouseFilter,
    yearFilter,
    itemFilter,
  }: Omit<ApiFilterOptions, "pageParam"> & {
    pageParam?: number;
  }
): Promise<VehiclesAndDestination[]> => {
  const dateRange =
    monthFilter !== undefined && yearFilter !== undefined
      ? getDateRange(monthFilter, yearFilter)
      : null;
  let query = supabase
    .from("vehicles")
    .select(
      "*, destination_info:destination(*),items:vehicle_items!inner(*, destination_info:destination(*), item_info:item(*), purchase_info:purchase_item( purchase_info:purchase_id(order_number)),sale_info:sale_item(*)), receive_officer_info:received_by (*), dispatch_officer_info:dispatched_by (*)"
    )
    .eq("status", status);

  // Check the value of status and adjust the join type accordingly
  if (status === "delivered") {
    query = query.eq("status", status);
  }

  if (dateFilter) query = query.eq("date_dispatched", dateFilter);
  if (dateRange && !dateFilter)
    query = query
      .gte("date_dispatched", dateRange.start)
      .lte("date_dispatched", dateRange.end);

  // Apply item filter if it's not 'all'
  if (itemFilter) {
    query = query.eq("items.item", itemFilter);
  }

  if (warehouseFilter) {
    let { data: warehouse, error: warehouseError } = await supabase
      .from("warehouses")
      .select("id")
      .eq("name", warehouseFilter)
      .single();
    if (warehouseError) throw warehouseError.message;
    query = query.eq("destination", warehouse?.id);
  }

  // Apply destination filter using inner join if it's not 'all'
  // if (destination !== "all") {
  //   query = query.eq("destination_info.name", destination);
  // }

  // Apply origin filter using inner join if it's not 'all'
  // if (origin !== "all") {
  //   query = query.eq("origin_state", origin);
  // }

  // Apply search filter to vehicle_number if search term is provided
  if (debouncedSearchTerm) {
    // query = query.textSearch(`vehicle_number`, search);
    query = query.ilike("vehicle_number", `%${debouncedSearchTerm}%`);
  }

  if (pageParam) {
    query = query.range((pageParam - 1) * 50, pageParam * 50 - 1);
  }

  // Apply ordering and pagination after filtering
  query = query.order("created_at", { ascending: false });

  const { data, error } = await query;

  if (error) throw error.message;
  return data;
};

export const getVehicleByWaybill = async (
  waybillNumber: string
): Promise<VehiclesAndDestination | undefined> => {
  let query = supabase
    .from("vehicles")
    .select(
      "*, destination_info:destination(*),items:vehicle_items(*, destination_info:destination(*), item_info:item(*), purchase_info:purchase_item( purchase_info:purchase_id(order_number)),sale_info:sale_item(*)), receive_officer_info:received_by (*), dispatch_officer_info:dispatched_by (*)"
    )
    .eq("waybill_number", waybillNumber)
    .single();

  const { data, error } = await query;

  if (error) throw error.message;
  return data;
};
export const getVehicleById = async (
  vehicleId: string
): Promise<VehiclesAndDestination> => {
  let query = supabase
    .from("vehicles")
    .select(
      "*, destination_info:destination(*),items:vehicle_items(*, destination_info:destination(*), item_info:item(*), purchase_info:purchase_item( purchase_info:purchase_id(order_number)),sale_info:sale_item(*)), receive_officer_info:received_by (*), dispatch_officer_info:dispatched_by (*)"
    )
    .eq("id", vehicleId)
    .single();

  const { data, error } = await query;

  if (error) throw error.message;
  console.log(data);
  return data;
};

export const getAllRequests = async ({
  pageParam,
  dateFilter,
  warehouseFilter,
  shiftFilter,
  itemFilter,
}: ApiFilterOptions): Promise<RequestWithItems[]> => {
  let q = supabase
    .from("requests")
    .select("*, request_items!inner(*, item_info:item(*))")
    .range((pageParam - 1) * 50, pageParam * 50 - 1)
    .order("created_at", { ascending: false });

  if (dateFilter) q = q.eq("date_requested", dateFilter);
  if (shiftFilter) q = q.eq("shift", shiftFilter);
  if (itemFilter) q = q.eq("request_items.item", itemFilter);
  if (warehouseFilter) {
    q = q.eq("warehouse", warehouseFilter);
  }
  const { data, error } = await q;

  if (error) throw error.message;

  return data;
};
export const getItemProductionInflow = async ({
  pageParam,
  dateFilter,
  itemFilter,
  monthFilter,
  yearFilter,
  warehouseFilter,
}: ApiFilterOptions): Promise<ItemInflowType[]> => {
  const dateRange =
    monthFilter !== undefined && yearFilter !== undefined
      ? getDateRange(monthFilter, yearFilter)
      : null;
  let q = supabase.rpc("get_item_production_receipt_summary", {
    start_date: dateRange?.start,
    end_date: dateRange?.end,
    warehouse_filter: warehouseFilter,
    specific_date: dateFilter,
    item_filter: itemFilter,
    result_limit: 50,
    result_offset: (pageParam - 1) * 50,
  });

  const { data, error } = await q;

  if (error) throw error.message;

  return data;
};
//alternate item filter that returns all items
// export const getAllRequests = async ({
//   pageParam,
//   dateFilter,
//   warehouseFilter,
//   shiftFilter,
//   itemFilter,
// }: ApiFilterOptions): Promise<RequestWithItems[]> => {
//   let q = supabase
//     .from("requests")
//     .select("*, request_items(*)") // Changed to left join
//     .range((pageParam - 1) * 50, pageParam * 50 - 1)
//     .order("created_at", { ascending: false });

//   // Apply filters
//   if (dateFilter) q = q.eq("date_requested", dateFilter);
//   if (shiftFilter) q = q.eq("shift", shiftFilter);
//   if (warehouseFilter) q = q.eq("warehouse", warehouseFilter);

//   // Handle itemFilter separately to fetch all items for matching requests
//   if (itemFilter) {
//     // Get request IDs that have the item
//     const { data: requestIdsData, error: itemError } = await supabase
//       .from("request_items")
//       .select("request_id")
//       .eq("item", itemFilter);

//     if (itemError) throw itemError.message;

//     const requestIds = requestIdsData.map((row) => row.request_id);
//     q = q.in("id", requestIds); // Filter requests to those IDs
//   }

//   const { data, error } = await q;

//   if (error) throw error.message;
//   return data;
// };

export const getEmployeeDeductions = async ({
  pageParam = 1,
  payrollId,
}: {
  pageParam: number;
  payrollId: string;
}): Promise<Deduction[]> => {
  console.log(payrollId);
  let q = supabase
    .from("payroll_deductions")
    .select("*")
    .eq("employee_payroll_id", payrollId)
    .range((pageParam - 1) * 50, pageParam * 50 - 1)
    .order("created_at", { ascending: false });

  const { data, error } = await q;

  if (error) throw error.message;

  return data;
};
export const getEmployeeBonuses = async ({
  pageParam = 1,
  payrollId,
}: {
  pageParam: number;
  payrollId: string;
}): Promise<PayrollBonus[]> => {
  console.log(payrollId);
  let q = supabase
    .from("payroll_bonuses")
    .select("*")
    .eq("employee_payroll_id", payrollId)
    .range((pageParam - 1) * 50, pageParam * 50 - 1)
    .order("created_at", { ascending: false });

  const { data, error } = await q;

  if (error) throw error.message;

  return data;
};

export const getEmployees = async ({
  // pageParam,
  debouncedSearchTerm,
}: ApiFilterOptions): Promise<Employees[]> => {
  let q = supabase
    .from("employees")
    .select("*")
    // .range((pageParam - 1) * 50, pageParam * 50 - 1)
    .order("first_name", {
      ascending: true,
    });

  if (debouncedSearchTerm) {
    q = q.or(
      `first_name.ilike.%${debouncedSearchTerm}%,last_name.ilike.%${debouncedSearchTerm}%`
    );
  }
  const { data, error } = await q;

  if (error) throw error.message;

  return data;
};

export const getInventoryTransfers = async (
  pageNumber: number = 1
): Promise<InventoryTransferWithStocks[]> => {
  const { data, error } = await supabase
    .from("inventory_transfers")
    .select(
      "*, originStock:origin_stock_id (*), destinationStock:destination_stock_id (*, warehouse_info:warehouse(*)), createdBy:created_by (*)"
    )
    .range((pageNumber - 1) * 50, pageNumber * 50 - 1)
    .order("created_at", { ascending: false });

  if (error) throw error.message;

  return data;
};

export const getAllInventoryTransfers = async (): Promise<
  InventoryTransferWithStocks[]
> => {
  const { data, error } = await supabase
    .from("inventory_transfers")
    .select(
      "*, originStock:origin_stock_id (*), destinationStock:destination_stock_id (*, warehouse_info:warehouse(*)), createdBy:created_by (*)"
    )
    .order("created_at", { ascending: false });

  if (error) throw error.message;

  return data;
};

export const getUncompletedInventoryTransfers = async (): Promise<
  InventoryTransferWithStocks[]
> => {
  const { data, error } = await supabase
    .from("inventory_transfers")
    .select(
      "*, originStock:origin_stock_id (*), destinationStock:destination_stock_id (*, warehouse_info:warehouse(*)), createdBy:created_by (*)"
    )
    .gt("balance", 0)
    .order("created_at", { ascending: false });

  if (error) throw error.message;

  return data;
};

export const getAllProductSubmissions = async ({
  pageParam,
  dateFilter,
  itemFilter,
  warehouseFilter,
  shiftFilter,
}: ApiFilterOptions): Promise<ProductSubmissionWithDetails[]> => {
  let q = supabase
    .from("product_submission")
    .select("*, product_info:product(*)")
    .range((pageParam - 1) * 50, pageParam * 50 - 1)
    .order("created_at", { ascending: false });
  if (dateFilter) q = q.eq("date_submitted", dateFilter);
  if (itemFilter) q = q.eq("product", itemFilter);
  if (shiftFilter) q = q.eq("shift", shiftFilter);
  if (warehouseFilter) {
    q = q.eq("warehouse", warehouseFilter);
  }
  const { data, error } = await q;

  if (error) throw error.message;

  return data;
};

export const getAllProductions = async ({
  pageParam,
  dateFilter,
  itemFilter,
  warehouseFilter,
  shiftFilter,
  monthFilter,
  yearFilter,
}: ApiFilterOptions): Promise<ProductionWithItems[]> => {
  const dateRange =
    monthFilter !== undefined && yearFilter !== undefined
      ? getDateRange(monthFilter, yearFilter)
      : null;
  let q = supabase
    .from("production_runs")
    .select("*, production_raw_materials (*), product_info:product(*)")
    .range((pageParam - 1) * 50, pageParam * 50 - 1)
    .order("created_at", { ascending: false });

  if (dateFilter) q = q.eq("date", dateFilter);
  if (dateRange && !dateFilter)
    q = q.gte("date", dateRange.start).lte("date", dateRange.end);
  if (itemFilter) q = q.eq("product", itemFilter);
  if (shiftFilter) q = q.eq("shift", shiftFilter);
  if (warehouseFilter) {
    q = q.eq("warehouse", warehouseFilter);
  }
  const { data, error } = await q;

  if (error) throw error.message;

  return data;
};

export const getAllFinishedProducts = async ({
  pageParam,
  dateFilter,
  itemFilter,
  warehouseFilter,
  shiftFilter,
}: ApiFilterOptions): Promise<FinishedProductsJoint[]> => {
  let q = supabase
    .from("finished_products")
    .select("*, staff:added_by(*)")
    .range((pageParam - 1) * 50, pageParam * 50 - 1)
    .order("created_at", { ascending: false });
  if (dateFilter) q = q.eq("date", dateFilter);
  if (itemFilter) q = q.eq("product", itemFilter);
  if (shiftFilter) q = q.eq("shift", shiftFilter);
  if (warehouseFilter) {
    q = q.eq("warehouse", warehouseFilter);
  }
  const { data, error } = await q;

  if (error) throw error.message;

  return data;
};

export const getAllPurchasePayments = async (
  pageNumber: number = 1,
  orderNumber: string // Assuming orderNumber is of type string
): Promise<PurchasePaymentsJoined[]> => {
  const { data, error } = await supabase
    .from("purchase_order_payments")
    .select("*, purchase:order_number(*)")
    .eq("order_number", orderNumber) // Filter by order_number
    .range((pageNumber - 1) * 50, pageNumber * 50 - 1)
    .order("created_at", { ascending: false });

  if (error) throw error.message;

  return data;
};

export const getAllSalesPayments = async (
  pageNumber: number = 1,
  orderNumber: string // Assuming orderNumber is of type string
): Promise<SalesPaymentsJoined[]> => {
  const { data, error } = await supabase
    .from("sales_payments")
    .select("*, sale:order_number(*)")
    .eq("order_number", orderNumber) // Filter by order_number
    .range((pageNumber - 1) * 50, pageNumber * 50 - 1)
    .order("created_at", { ascending: false });

  if (error) throw error.message;

  return data;
};
export const getAllSaleItems = async (
  pageNumber: number = 1,
  saleId: string // Assuming orderNumber is of type string
): Promise<SalesItemsJoined[]> => {
  const { data, error } = await supabase
    .from("sales_items")
    .select("*")
    .eq("sale_id", saleId) // Filter by order_number
    .range((pageNumber - 1) * 50, pageNumber * 50 - 1)
    .order("created_at", { ascending: false });

  if (error) throw error.message;

  return data;
};
export const getAllPurchaseItems = async (
  pageNumber: number = 1,
  purchaseId: string // Assuming orderNumber is of type string
): Promise<PurchaseItemsJoined[]> => {
  const { data, error } = await supabase
    .from("purchase_items")
    .select("*, item_info:item(*), purchase_info:purchase_id(*)")
    .eq("purchase_id", purchaseId) // Filter by order_number
    .range((pageNumber - 1) * 50, pageNumber * 50 - 1)
    .order("created_at", { ascending: false });

  if (error) throw error.message;

  return data;
};

export const getAllInventoryItems = async (
  pageNumber: number = 1,
  searchByName: string | null = null,
  searchByType: string | null = null
): Promise<InventoryItems[]> => {
  let q = supabase
    .from("inventory_items")
    .select("*")
    .range((pageNumber - 1) * 50, pageNumber * 50 - 1)
    .order("created_at", { ascending: false });
  if (searchByType) q = q.eq("type", searchByType);
  if (searchByName) q = q.ilike("name", `%${searchByName}%`);
  const { data, error } = await q;

  if (error) throw error.message;

  return data;
};
export const getSubItems = async (
  pageNumber: number = 1,
  parentItem: string
): Promise<SubItemsWithDetails[]> => {
  const { data, error } = await supabase
    .from("sub_items")
    .select("*, item_info:item(*)")
    .eq("parent_item", parentItem)
    .range((pageNumber - 1) * 50, pageNumber * 50 - 1)
    .order("created_at", { ascending: false });

  if (error) throw error.message;

  return data;
};

export const getAllStockIns = async ({
  pageParam,
  dateFilter,
  warehouseFilter,
}: ApiFilterOptions): Promise<StockInWithDetails[]> => {
  let q = supabase
    .from("stock_in")
    .select("*, stocked_by_info:stocked_by(*), item_info:item(*)")
    .range((pageParam - 1) * 50, pageParam * 50 - 1)
    .order("created_at", { ascending: false });

  if (dateFilter) q = q.eq("date", dateFilter);
  if (warehouseFilter) {
    q = q.eq("warehouse", warehouseFilter);
  }
  const { data, error } = await q;

  if (error) throw error.message;

  return data;
};

export const getInventoryItems = async (): Promise<InventoryItems[]> => {
  const { data, error } = await supabase
    .from("inventory_items")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error.message;

  return data;
};

export const getWarehouses = async (): Promise<Warehouses[]> => {
  const { data, error } = await supabase
    .from("warehouses")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error.message;

  return data;
};
export const getPurchaseItems = async (): Promise<PurchaseItemsJoined[]> => {
  const { data, error } = await supabase
    .from("purchase_items")
    .select("*, item_info:item(*), purchase_info:purchase_id(*)")
    .gt("balance", 0)
    .order("created_at", { ascending: false });

  if (error) throw error.message;

  return data;
};

export const getAllDepartments = async (): Promise<Departments[]> => {
  const { data, error } = await supabase
    .from("departments")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error.message;

  return data;
};

export const getAllPositions = async (): Promise<Positions[]> => {
  const { data, error } = await supabase
    .from("positions")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error.message;

  return data;
};

export const getWarehousesNames = async (): Promise<{ name: string }[]> => {
  const { data, error } = await supabase
    .from("warehouses")
    .select("name")
    .order("created_at", { ascending: false });

  if (error) throw error.message;

  return data;
};

export const getItemsNames = async (
  searchByName: string | null = null
): Promise<{ name: string }[]> => {
  let q = supabase
    .from("inventory_items")
    .select("name")
    .order("created_at", { ascending: false });
  if (searchByName) q = q.ilike("name", `%${searchByName}%`);
  const { data, error } = await q;

  if (error) throw error.message;

  return data;
};

export const getItemRecord = async (
  warehouse: string,
  item: string
): Promise<StocksWithDetails> => {
  const { data, error } = await supabase
    .from("stocks")
    .select("*, item_info:item(*)")
    .eq("warehouse", warehouse)
    .eq("item", item)
    .single();

  if (error) throw error.message;

  return data;
};

export const getStockRecord = async (
  warehouse: string | null | undefined
): Promise<StocksWithDetails[]> => {
  let query = supabase.from("stocks").select("*, item_info:item(*)");

  if (warehouse) query = query.eq("warehouse", warehouse);

  const { data, error } = await query;

  if (error) throw error.message;

  return data;
};

export const getAllPaymentAccounts = async (): Promise<PaymentAccounts[]> => {
  let query = supabase
    .from("payment_accounts")
    .select("*")
    .order("created_at", { ascending: false });
  const { data, error } = await query;

  if (error) throw error.message;
  return data;
};

export const verifyEmail = async (
  email: string
): Promise<Enrollment | null> => {
  const { data, error } = await supabase
    .from("user_enrollment")
    .select("*", { count: "exact" }) // Fetch count to check for multiple rows
    .eq("email", email);

  if (error) {
    throw new Error(error.message); // Rethrow any other errors
  }

  if (data.length === 0) {
    return null; // No records found
  }

  if (data.length > 1) {
    // Handle the case where multiple records are found
    throw new Error("Multiple records found for email");
    // Optionally: You can return null or throw an error depending on your needs
  }

  return data[0]; // Return the single record found
};

export const getItemExternalRecord = async (
  item: string
): Promise<ExternalStocksAndPurchases[]> => {
  const { data, error } = await supabase
    .from("external_stocks")
    .select("*, purchase_item:order_number(item(*)), stock_purchases!inner(*)")
    .eq("stock_purchases.item", item);

  if (error) throw error.message;
  return data;
};

export const getDestinationStockId = async (
  item: string,
  warehouse: string
): Promise<string> => {
  const { data, error } = await supabase
    .from("stocks")
    .select("id")
    .eq("item", item)
    .eq("warehouse", warehouse)
    .single();

  if (error) throw error.message;

  return data.id;
};

export const getExternalStocks = async (): Promise<
  ExternalStocksAndPurchases[]
> => {
  const { data, error } = await supabase
    .from("external_stocks")
    .select("*, stock_purchases!inner(*)")
    .gt("balance", 0);

  if (error) throw error.message;

  return data;
};

export const getAllExternalStocks = async (): Promise<
  ExternalStocksAndPurchases[]
> => {
  const { data, error } = await supabase
    .from("external_stocks")
    .select("*, stock_purchases!inner(*)");

  if (error) throw error.message;

  return data;
};

export const addWarehouse = async (payload: Warehouses): Promise<void> => {
  const { error } = await supabase.from("warehouses").insert([payload]);

  if (error) throw new Error(error.message);
};

export const addDepartment = async (
  payload: InsertDepartments
): Promise<void> => {
  const { error } = await supabase.from("departments").insert([payload]);

  if (error) throw new Error(error.message);
};

export const addPaymentAccount = async (
  payload: InsertPaymentAccounts
): Promise<void> => {
  const { error } = await supabase.from("payment_accounts").insert([payload]);

  if (error) throw new Error(error.message);
};

export const addEnrollment = async (
  payload: InsertEnrollment
): Promise<void> => {
  const { error } = await supabase.from("user_enrollment").insert([payload]);

  if (error) throw new Error(error.message);
};

export const addExpense = async (payload: InsertExpenses): Promise<void> => {
  const { error } = await supabase.from("expenses").insert([payload]);

  if (error) throw new Error(error.message);
};
export const addPayrollDeduction = async (
  payload: CreateDeduction
): Promise<void> => {
  const { error } = await supabase.from("payroll_deductions").insert([payload]);

  if (error) throw new Error(error.message);
};

export const addPayrollBonus = async (
  payload: CreatePayrollBonus
): Promise<void> => {
  const { error } = await supabase.from("payroll_bonuses").insert([payload]);

  if (error) throw new Error(error.message);
};

export const addPayroll = async (payload: InsertPayrolls): Promise<void> => {
  const { error } = await supabase.from("payrolls").insert([payload]);

  if (error) throw new Error(error.message);
};

export const addPosition = async (payload: InsertPosition): Promise<void> => {
  const { error } = await supabase.from("positions").insert([payload]);

  if (error) throw new Error(error.message);
};

export const addEmployee = async (payload: InsertEmployees): Promise<void> => {
  const { error } = await supabase.from("employees").insert([payload]);

  if (error) throw new Error(error.message);
};

export const addNewVehicle = async (
  payload: Vehicles
): Promise<VehiclesAndDestination> => {
  const { data, error } = await supabase
    .from("vehicles")
    .insert([payload])
    .select(
      "*, destination_info:destination(*),items:vehicle_items(*, destination_info:destination(*), item_info:item(*), purchase_info:purchase_item( purchase_info:purchase_id(order_number)),sale_info:sale_item(*)), receive_officer_info:received_by (*), dispatch_officer_info:dispatched_by (*)"
    )
    .single();

  if (error) {
    throw new Error(error.message);
  }

  if (data) {
    return data;
  } else {
    throw new Error("Failed to retrieve the newly added vehicle.");
  }
};

export const addInventoryItem = async (
  payload: InventoryItems
): Promise<void> => {
  const { error } = await supabase.from("inventory_items").insert([payload]);

  if (error) throw new Error(error.message);
};

export const stockIn = async (payload: StockIn): Promise<void> => {
  const { error } = await supabase.from("stock_in").insert([payload]);

  if (error) throw new Error(error.message);
};

export const addPurchase = async (payload: CreatePurchase): Promise<void> => {
  const { error } = await supabase.rpc("create_purchase", payload);
  if (error) console.error(error);
  if (error) throw new Error(error.message);
};
export const createDispatch = async (
  payload: CreateDispatch
): Promise<string> => {
  const { error, data } = await supabase.rpc("create_dispatch", payload);
  if (error) console.error(error);
  if (error) throw new Error(error.message);
  return data;
};

export const addSale = async (payload: CreateSaleType): Promise<void> => {
  const { error } = await supabase.rpc("create_sale", payload);
  if (error) console.error(error);
  if (error) throw new Error(error.message);
};

export const receiveVehicle = async (
  payload: ReceiveVehicles
): Promise<void> => {
  const { error } = await supabase.rpc("receive_vehicle", {
    vehicle_id: payload.id,
    received_by_text: payload.received_by,
    paid_on_receive_num: payload.paid_on_receive,
    date_received_date: payload.date_received,
    items_json: payload.items,
  });
  if (error) console.error(error);
  if (error) throw new Error(error.message);
};

export const updateEmployee = async (
  payload: UpdateEmployees
): Promise<void> => {
  const { error } = await supabase
    .from("employees")
    .update(payload)
    .eq("id", payload.id);
  if (error) console.error(error);
  if (error) throw new Error(error.message);
};
export const updateProfile = async (payload: UpdateProfile): Promise<void> => {
  const { error } = await supabase
    .from("profiles")
    .update(payload)
    .eq("id", payload.id);
  if (error) console.error(error);
  if (error) throw new Error(error.message);
};

export const updatePurchase = async (
  payload: UpdatePurchaseInput
): Promise<void> => {
  const { error } = await supabase
    .from("stock_purchases")
    .update(payload)
    .eq("id", payload.id);
  if (error) console.error(error);
  if (error) throw new Error(error.message);
};
export const updateSale = async (payload: UpdateSaleInput): Promise<void> => {
  const { error } = await supabase
    .from("sales")
    .update(payload)
    .eq("id", payload.id);
  if (error) console.error(error);
  if (error) throw new Error(error.message);
};
export const updateRequest = async (
  payload: UpdateRequestType
): Promise<void> => {
  const { error } = await supabase
    .from("requests")
    .update(payload)
    .eq("id", payload.id);
  if (error) console.error(error);
  if (error) throw new Error(error.message);
};
export const updateFinishedProduct = async (
  payload: UpdateFinishedProductsType
): Promise<void> => {
  const { error } = await supabase
    .from("finished_products")
    .update(payload)
    .eq("id", payload.id);
  if (error) console.error(error);
  if (error) throw new Error(error.message);
};
export const updateSaleItem = async (
  payload: UpdateSaleItem
): Promise<void> => {
  const { error } = await supabase
    .from("sales_items")
    .update(payload)
    .eq("id", payload.id);
  if (error) console.error(error);
  if (error) throw new Error(error.message);
};
export const updatePurchaseItem = async (
  payload: UpdatePurchaseItem
): Promise<void> => {
  const { error } = await supabase
    .from("purchase_items")
    .update(payload)
    .eq("id", payload.id);
  if (error) console.error(error);
  if (error) throw new Error(error.message);
};
export const updateExpense = async (
  payload: UpdateExpenseInput
): Promise<void> => {
  const { error } = await supabase
    .from("expenses")
    .update(payload)
    .eq("id", payload.id);
  if (error) console.error(error);
  if (error) throw new Error(error.message);
};
export const updateUser = async (payload: UpdateUserProfile): Promise<void> => {
  const { error } = await supabase
    .from("profiles")
    .update(payload)
    .eq("id", payload.id);
  if (error) console.error(error);
  if (error) throw new Error(error.message);
};

export const updateEmployeePayroll = async (
  payload: UpdateEmployeePayroll
): Promise<void> => {
  const { error } = await supabase
    .from("employee_payroll")
    .update(payload)
    .eq("id", payload.id);
  if (error) console.error(error);
  if (error) throw new Error(error.message);
};

export const approveRequest = async (
  payload: UpdateRequests
): Promise<void> => {
  const { error } = await supabase
    .from("requests")
    .update(payload)
    .eq("id", payload.id);
  if (error) console.error(error);
  if (error) throw new Error(error.message);
};

export const restrictUser = async (
  payload: UpdateUserProfile
): Promise<void> => {
  const { error } = await supabase
    .from("profiles")
    .update(payload)
    .eq("id", payload.id);
  if (error) console.error(error);
  if (error) throw new Error(error.message);
};

export const approveExpense = async (
  payload: UpdateExpenses
): Promise<void> => {
  const { error } = await supabase
    .from("expenses")
    .update(payload)
    .eq("id", payload.id);
  if (error) console.error(error);
  if (error) throw new Error(error.message);
};

export const payPayroll = async (payload: UpdatePayrolls): Promise<void> => {
  const { error } = await supabase
    .from("payrolls")
    .update(payload)
    .eq("id", payload.id);
  if (error) console.error(error);
  if (error) throw new Error(error.message);
};

export const approveSubmission = async (
  payload: UpdateSubmission
): Promise<void> => {
  const { error } = await supabase
    .from("product_submission")
    .update(payload)
    .eq("id", payload.id);
  if (error) console.error(error);
  if (error) throw new Error(error.message);
};

export const rejectRequest = async (payload: UpdateRequests): Promise<void> => {
  const { error } = await supabase
    .from("requests")
    .update(payload)
    .eq("id", payload.id);
  if (error) console.error(error);
  if (error) throw new Error(error.message);
};

export const rejectSubmission = async (
  payload: UpdateSubmission
): Promise<void> => {
  const { error } = await supabase
    .from("product_submission")
    .update(payload)
    .eq("id", payload.id);
  if (error) console.error(error);
  if (error) throw new Error(error.message);
};

export const deleteRequest = async (requestId: string): Promise<void> => {
  const { error } = await supabase
    .from("requests")
    .delete()
    .eq("id", requestId);

  if (error) {
    console.error("Failed to delete request:", error);
    throw new Error(error.message);
  }
};

export const deletePayroll = async (payrollId: string): Promise<void> => {
  const { error } = await supabase
    .from("payrolls")
    .delete()
    .eq("id", payrollId);

  if (error) {
    console.error("Failed to delete payroll:", error);
    throw new Error(error.message);
  }
};

export const deleteExpense = async (expenseId: string): Promise<void> => {
  const { error } = await supabase
    .from("expenses")
    .delete()
    .eq("id", expenseId);

  if (error) {
    console.error("Failed to delete payroll:", error);
    throw new Error(error.message);
  }
};

export const deleteSale = async (saleId: string): Promise<void> => {
  const { error } = await supabase.from("sales").delete().eq("id", saleId);

  if (error) {
    console.error("Failed to delete Sale:", error);
    throw new Error(error.message);
  }
};
export const deletePurchase = async (purchaseId: string): Promise<void> => {
  const { error } = await supabase
    .from("stock_purchases")
    .delete()
    .eq("id", purchaseId);

  if (error) {
    console.error("Failed to delete Purchase:", error);
    throw new Error(error.message);
  }
};
export const deleteItem = async (itemId: string): Promise<void> => {
  const { error } = await supabase
    .from("inventory_items")
    .delete()
    .eq("id", itemId);

  if (error) {
    console.error("Failed to delete Item:", error);
    throw new Error(error.message);
  }
};
export const deleteSalePayment = async (paymentId: string): Promise<void> => {
  const { error } = await supabase
    .from("sales_payments")
    .delete()
    .eq("id", paymentId);

  if (error) {
    console.error("Failed to delete Sale Payment:", error);
    throw new Error(error.message);
  }
};
export const deleteSaleItem = async (itemId: string): Promise<void> => {
  const { error } = await supabase
    .from("sales_items")
    .delete()
    .eq("id", itemId);

  if (error) {
    console.error("Failed to delete Sale Item:", error);
    throw new Error(error.message);
  }
};
export const deletePurchaseItem = async (itemId: string): Promise<void> => {
  const { error } = await supabase
    .from("purchase_items")
    .delete()
    .eq("id", itemId);

  if (error) {
    console.error("Failed to delete Purchase Item:", error);
    throw new Error(error.message);
  }
};
export const deleteDeduction = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from("payroll_deductions")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Failed to delete Deduction Payment:", error);
    throw new Error(error.message);
  }
};
export const deleteBonus = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from("payroll_bonuses")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Failed to delete Bonus Payment:", error);
    throw new Error(error.message);
  }
};
export const deletePurchasePayment = async (
  paymentId: string
): Promise<void> => {
  const { error } = await supabase
    .from("purchase_order_payments")
    .delete()
    .eq("id", paymentId);

  if (error) {
    console.error("Failed to delete Purchase Payment:", error);
    throw new Error(error.message);
  }
};

export const deleteProduction = async (productionId: string): Promise<void> => {
  const { error } = await supabase
    .from("production_runs")
    .delete()
    .eq("id", productionId);

  if (error) {
    console.error("Failed to delete production:", error);
    throw new Error(error.message);
  }
};

export const deleteFinishedProduct = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from("finished_products")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Failed to delete:", error);
    throw new Error(error.message);
  }
};

export const deleteSubmission = async (submissionId: string): Promise<void> => {
  const { error } = await supabase
    .from("product_submission")
    .delete()
    .eq("id", submissionId);

  if (error) {
    console.error("Failed to delete submission:", error);
    throw new Error(error.message);
  }
};

export const addPurchasePayment = async (payload: Purchases): Promise<void> => {
  const { error } = await supabase
    .from("purchase_order_payments")
    .insert([payload]);
  if (error) console.error(error);
  if (error) throw new Error(error.message);
};

export const addFinishedProduct = async (
  payload: InsertFinishedProducts
): Promise<void> => {
  const { error } = await supabase.from("finished_products").insert([payload]);
  if (error) console.error(error);
  if (error) throw new Error(error.message);
};
export const addFinishedProducts = async (
  payload: AddFinishedProducts
): Promise<void> => {
  const { error } = await supabase.rpc("add_finished_products", payload);
  if (error) console.error(error);
  if (error) throw new Error(error.message);
};

export const addSalesPayment = async (
  payload: SalesPayments
): Promise<void> => {
  const { error } = await supabase.from("sales_payments").insert([payload]);
  if (error) console.error(error);
  if (error) throw new Error(error.message);
};

export const createRequest = async (payload: CreateRequest): Promise<void> => {
  const { error } = await supabase.rpc("create_request", {
    request_data: payload,
  });

  if (error) console.error(error);
  if (error) throw new Error(error.message);
};

export const addInventoryTransfer = async (
  payload: InventoryTransferInsert
): Promise<void> => {
  const { error } = await supabase
    .from("inventory_transfers")
    .insert([payload]);
  if (error) console.error(error);
  if (error) throw new Error(error.message);
};

export const createProduction = async (
  payload: CreateProduction
): Promise<void> => {
  const { error } = await supabase.rpc("create_production", {
    production_data: payload,
  });

  if (error) console.error(error);
  if (error) throw new Error(error.message);
};

export const createMultiProduction = async (
  payload: AddProductionRunsMultiProduct
): Promise<void> => {
  const { error } = await supabase.rpc(
    "add_multi_product_production_records",
    payload
  );

  if (error) console.error(error);
  if (error) throw new Error(error.message);
};

export const createItemCollection = async (
  payload: CreateItemCollection
): Promise<void> => {
  const { error } = await supabase.rpc("create_inventory_item_collection", {
    item_data: payload,
  });

  if (error) console.error(error);
  if (error) throw new Error(error.message);
};

export const addProductSubmission = async (
  payload: AddProductionSubmission
): Promise<void> => {
  const { error } = await supabase.from("product_submission").insert([payload]);
  if (error) console.error(error);
  if (error) throw new Error(error.message);
};

export const addProductSubmissions = async (
  payload: AddMultiProductsSubmission
): Promise<void> => {
  const { error } = await supabase.rpc("add_product_submissions", payload);
  if (error) console.error(error);
  if (error) throw new Error(error.message);
};

export const getMonthlyFinancialReprots = async (): Promise<
  FinancialReportLedger[]
> => {
  const { data, error } = await supabase.from("monthly_ledger").select("*");

  if (error) {
    console.error(error);
    throw new Error("Error fetching financial report");
  }

  return data; // Type assertion to FinancialReport array
};

export const updateInventoryItem = async (
  payload: UpdateInventoryItems
): Promise<void> => {
  const { error } = await supabase
    .from("inventory_items")
    .update(payload)
    .eq("id", payload.id);
  if (error) console.error(error);
  if (error) throw new Error(error.message);
};

export const uploadImage = async (
  fileData: any,
  folder: string
): Promise<{ filePath: string; publicUrl: string }> => {
  const filePath = `${folder}/${fileData.uid}-${fileData.name}`;

  const { data, error } = await supabase.storage
    .from("images")
    .upload(filePath, fileData);

  if (error)
    throw new Error(`Error uploading file ${fileData.name}: ${error.message}`);
  const {
    data: { publicUrl },
  } = supabase.storage
    .from("images") // The bucket name
    .getPublicUrl(data.path);
  if (!publicUrl) throw new Error(`Failed to ertreive image URL`);
  return { filePath: data.path, publicUrl };
};

export async function getDailyProductionSummary(
  date?: string | null,
  warehouse?: string | null | undefined
): Promise<DailyProductionSummary[]> {
  const { data, error } = await supabase.rpc("get_daily_production_summary", {
    p_date: date || null,
    p_warehouse: warehouse || null,
  });

  if (error) {
    console.error("Error fetching production summary:", error);
    throw error;
  }

  return data || [];
}

export async function getDailyFinishedProducts(
  date?: string | null,
  warehouse?: string | null | undefined
): Promise<FinishedProductsJoint[]> {
  if (!date) {
    console.error("Error fetching finished Products: date must be selected");
    throw new Error("Error fetching finished Products: date must be selected");
  }
  let query = supabase
    .from("finished_products")
    .select("*, staff:added_by(*), product_info:product(*)");

  if (date) {
    query = query.eq("date", date);
  }

  if (warehouse) {
    query = query.eq("warehouse", warehouse);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching finished Products:", error);
    throw error;
  }

  return data || [];
}
