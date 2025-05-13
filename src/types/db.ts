import { Database } from "./supabase";

export type vehicleStatus = Database["public"]["Enums"]["vehicle_status"];
export type SalesType = Database["public"]["Enums"]["sales_type"];
export type EmploymentStatus = Database["public"]["Enums"]["employment_status"];
export type ExpenseCategories =
  Database["public"]["Enums"]["expense_categories"];
export type UserRole = Database["public"]["Enums"]["user_role"];
export type PaymentMode = Database["public"]["Enums"]["payment_mode"];
export type States = Database["public"]["Enums"]["state_type"];
export type Request_status = Database["public"]["Enums"]["request_status"];
export type InventoryItemType =
  Database["public"]["Enums"]["inventory_item_type"];
export type UserProfile = Database["public"]["Tables"]["profiles"]["Row"];
export type UpdateUserProfile =
  Database["public"]["Tables"]["profiles"]["Update"];
export type Warehouses = Database["public"]["Tables"]["warehouses"]["Row"];
export type Enrollment = Database["public"]["Tables"]["user_enrollment"]["Row"];
export type InsertEnrollment =
  Database["public"]["Tables"]["user_enrollment"]["Insert"];
export type PaymentAccounts =
  Database["public"]["Tables"]["payment_accounts"]["Row"];
export type InsertPaymentAccounts =
  Database["public"]["Tables"]["payment_accounts"]["Insert"];
export type UpdatePaymentAccounts =
  Database["public"]["Tables"]["payment_accounts"]["Update"];
export type Expenses = Database["public"]["Tables"]["expenses"]["Row"];
export type InsertExpenses = Database["public"]["Tables"]["expenses"]["Insert"];
export type UpdateExpenses = Database["public"]["Tables"]["expenses"]["Update"];
export type Employees = Database["public"]["Tables"]["employees"]["Row"];
export type Payrolls = Database["public"]["Tables"]["payrolls"]["Row"];
export type UpdatePayrolls = Database["public"]["Tables"]["payrolls"]["Update"];
export type FinancialReportLedger =
  Database["public"]["Views"]["monthly_ledger"]["Row"];
export type EmployeePayroll =
  Database["public"]["Tables"]["employee_payroll"]["Row"];
export type UpdateEmployeePayroll =
  Database["public"]["Tables"]["employee_payroll"]["Update"];
export interface EmployeePayrollAndEmployee extends EmployeePayroll {
  employee: Employees;
}
export interface RequestItemJoined extends RequestItem {
  item_info: InventoryItems;
}
export interface PayrollsAndEmployees extends Payrolls {
  employeePayrolls: EmployeePayrollAndEmployee[];
}
export type InsertPayrolls = Database["public"]["Tables"]["payrolls"]["Insert"];
export type UpdateEmployees =
  Database["public"]["Tables"]["employees"]["Update"];
export type UpdateProfile = Database["public"]["Tables"]["profiles"]["Update"];
export type InsertEmployees =
  Database["public"]["Tables"]["employees"]["Insert"];
export type InventoryTransfer =
  Database["public"]["Tables"]["inventory_transfers"]["Row"];
export type InventoryTransferInsert =
  Database["public"]["Tables"]["inventory_transfers"]["Insert"];
export type Vehicles = Database["public"]["Tables"]["vehicles"]["Row"];
export type VehicleItems = Database["public"]["Tables"]["vehicle_items"]["Row"];
export type Requests = Database["public"]["Tables"]["requests"]["Row"];
export type Departments = Database["public"]["Tables"]["departments"]["Row"];
export type Positions = Database["public"]["Tables"]["positions"]["Row"];
export type InsertPositions =
  Database["public"]["Tables"]["positions"]["Insert"];
export type InsertDepartments =
  Database["public"]["Tables"]["departments"]["Insert"];
export type ProductSubmission =
  Database["public"]["Tables"]["product_submission"]["Row"];
export type UpdateSubmission =
  Database["public"]["Tables"]["product_submission"]["Update"];
export type Productions =
  Database["public"]["Tables"]["production_runs"]["Row"];
export type UpdateRequests = Database["public"]["Tables"]["requests"]["Update"];
export type RequestItem = Database["public"]["Tables"]["request_items"]["Row"];
export type ProductionRawMaterials =
  Database["public"]["Tables"]["production_raw_materials"]["Row"];
export type UpdateVehicles = Database["public"]["Tables"]["vehicles"]["Update"];
export interface StockDestination extends Stocks {
  warehouse_info: Warehouses;
}
export interface VehicleItemsJoined extends VehicleItems {
  destination_info: Warehouses;
  item_info: InventoryItems;
  purchase_info: PurchaseItemsJoined;
  Sale_info: SalesItemsJoined;
}
export interface VehiclesAndDestination extends Vehicles {
  destination_info?: Warehouses;
  dispatch_officer_info: UserProfile;
  receive_officer_info?: UserProfile;
  items: VehicleItemsJoined[];
}
export interface RequestWithItems extends Requests {
  request_items: RequestItemJoined[];
}
export interface ProductionRawMaterialsJoined extends ProductionRawMaterials {
  item_info: InventoryItems;
}
export interface ProductionWithItems extends Productions {
  production_raw_materials: ProductionRawMaterials[];
  product_info: InventoryItems;
}
export interface EmployeePayrollJoined extends EmployeePayroll {
  employee: Employees;
}
export type Purchases = Database["public"]["Tables"]["stock_purchases"]["Row"];
export type FinishedProducts =
  Database["public"]["Tables"]["finished_products"]["Row"];
export type InsertFinishedProducts =
  Database["public"]["Tables"]["finished_products"]["Insert"];
export type UpdateFinishedProducts =
  Database["public"]["Tables"]["finished_products"]["Update"];
export type Sales = Database["public"]["Tables"]["sales"]["Row"];
export type SalesPayments =
  Database["public"]["Tables"]["sales_payments"]["Row"];
export type PurchasePayments =
  Database["public"]["Tables"]["purchase_order_payments"]["Row"];
export type InventoryItems =
  Database["public"]["Tables"]["inventory_items"]["Row"];
export type SubItems = Database["public"]["Tables"]["sub_items"]["Row"];
export type StockIn = Database["public"]["Tables"]["stock_in"]["Row"];
export type Stocks = Database["public"]["Tables"]["stocks"]["Row"];
export type PurchaseItems =
  Database["public"]["Tables"]["purchase_items"]["Row"];
export type ExternalStocks =
  Database["public"]["Tables"]["external_stocks"]["Row"];
export interface ExternalStocksAndPurchases extends ExternalStocks {
  stock_purchases: Purchases;
  purchase_item: { item: InventoryItems };
}
export interface ProductSubmissionWithDetails extends ProductSubmission {
  product_info: InventoryItems;
}
export interface StocksJoined extends Stocks {
  item_info: InventoryItems;
}
export interface StocksWithWarehouse extends Stocks {
  warehouse_info: Warehouses;
}
export interface InventoryTransferWithStocks extends InventoryTransfer {
  originStock: Stocks;
  destinationStock: StocksWithWarehouse;
  createdBy: UserProfile;
}
export interface FinishedProductsJoint extends FinishedProducts {
  staff: UserProfile;
  product_info: InventoryItems;
}

export interface FinishedProductsTableSummary extends FinishedProductsJoint {
  pieces?: number | null;
  bales?: number | null;
  metre?: number | null;
}

export interface StocksWithSoldBalance extends ExternalStocksAndPurchases {
  totalSoldBalance: number;
}

export interface PurchaseItemsJoined extends PurchaseItems {
  item_info: InventoryItems;
  purchase_info: Purchases;
}
export interface PurchasesAndPayments extends Purchases {
  payments: PurchasePayments[];
  items: PurchaseItemsJoined[];
}

export type SalesItems = Database["public"]["Tables"]["sales_items"]["Row"];

export interface SalesItemsJoined extends SalesItems {
  item_info: InventoryItems;
  purchase_item_info?: PurchaseItemsJoined;
}
export interface SalesAndPayments extends Sales {
  payments: SalesPayments[];
  items: SalesItemsJoined[];
}
export interface SalesPaymentsJoined extends SalesPayments {
  sale: Sales;
}

export interface StocksWithDetails extends Stocks {
  item_info: InventoryItems;
}
export interface PurchasePaymentsJoined extends PurchasePayments {
  purchase: Purchases;
}
export interface StockInWithDetails extends StockIn {
  stocked_by_info: UserProfile;
  item_info: InventoryItems;
}

export interface SubItemsWithDetails extends SubItems {
  item_info: InventoryItems;
}

export type UpdateInventoryItems =
  Database["public"]["Tables"]["inventory_items"]["Update"];
export type Shifts = Database["public"]["Enums"]["shifts"];
export type DispatchTypes =
  Database["public"]["Enums"]["vehicle_dispatch_type"];

export type DailyProductionSummary = {
  product_info: {
    id: string;
    name: string;
    unit: string;
    length: number | null;
  };
  shift: Shifts;
  total_quantity_produced: number;
  pieces?: number | null;
  bales?: number | null;
};
