// Order status values — must match DB enum
export const ORDER_STATUS = {
  NEW: "NEW",
  PICKING: "PICKING",
  READY: "READY",
  OUT_FOR_DELIVERY: "OUT_FOR_DELIVERY",
  DELIVERED: "DELIVERED",
};

export const STATUS_WORKFLOW = [
  ORDER_STATUS.NEW,
  ORDER_STATUS.PICKING,
  ORDER_STATUS.READY,
  ORDER_STATUS.OUT_FOR_DELIVERY,
  ORDER_STATUS.DELIVERED,
];

export const STATUS_CONFIG = {
  NEW: {
    label: "New",
    color: "text-primary-600",
    bg: "bg-primary-50",
    border: "border-primary-200",
    dot: "bg-primary-500",
    badge: "bg-primary-50 text-primary-600 border border-primary-200",
    hex: "#3B82F6",
  },
  PICKING: {
    label: "Picking",
    color: "text-warning",
    bg: "bg-amber-50",
    border: "border-amber-200",
    dot: "bg-warning",
    badge: "bg-amber-50 text-amber-600 border border-amber-200",
    hex: "#F59E0B",
  },
  READY: {
    label: "Ready",
    color: "text-violet-600",
    bg: "bg-violet-50",
    border: "border-violet-200",
    dot: "bg-violet-500",
    badge: "bg-violet-50 text-violet-600 border border-violet-200",
    hex: "#8B5CF6",
  },
  OUT_FOR_DELIVERY: {
    label: "Out for Delivery",
    color: "text-accent-500",
    bg: "bg-orange-50",
    border: "border-orange-200",
    dot: "bg-accent-500",
    badge: "bg-orange-50 text-orange-600 border border-orange-200",
    hex: "#F97316",
  },
  DELIVERED: {
    label: "Delivered",
    color: "text-success",
    bg: "bg-green-50",
    border: "border-green-200",
    dot: "bg-success",
    badge: "bg-green-50 text-green-600 border border-green-200",
    hex: "#22C55E",
  },
};

export const PAYMENT_METHODS = ["Mobile Money", "Cash on Delivery", "Bank Transfer"];

export const RIDER_TYPES = {
  MOTORCYCLE: "Motorcycle",
  BICYCLE: "Bicycle",
  ON_FOOT: "On Foot",
};

export const RIDER_TYPE_EMOJI = {
  Motorcycle: "🏍️",
  Bicycle: "🚲",
  "On Foot": "🚶",
};

// DB field names — single source of truth
export const DB = {
  // orders table
  ORDER_ID: "id",
  CUSTOMER_NAME: "customer_name",
  ITEMS_JSON: "items_json",
  LOCATION: "location",
  PAYMENT_METHOD: "payment_method",
  STATUS: "status",
  DELIVERY_CODE: "delivery_code",
  ASSIGNED_RUNNER: "assigned_runner",
  ASSIGNED_RIDER: "assigned_rider",
  CREATED_AT: "created_at",
  // riders table
  RIDER_ID: "id",
  RIDER_NAME: "name",
  RIDER_TYPE: "type",
  ASSIGNED_ORDERS: "assigned_orders",
};
