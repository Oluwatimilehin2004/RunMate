// Order status values — must match DB enum
export const ORDER_STATUS = {
  PENDING: "pending",
  ACCEPTED: "accepted",
  PICKED: "picked",
  DELIVERED: "delivered",
  CANCELLED: "cancelled",
};

export const STATUS_WORKFLOW = [
  ORDER_STATUS.PENDING,
  ORDER_STATUS.ACCEPTED,
  ORDER_STATUS.PICKED,
  ORDER_STATUS.DELIVERED,
];

export const STATUS_CONFIG = {
  [ORDER_STATUS.PENDING]: {
    label: "Pending",
    color: "text-primary-600",
    bg: "bg-primary-50",
    border: "border-primary-200",
    dot: "bg-primary-500",
    badge: "bg-primary-50 text-primary-600 border border-primary-200",
    hex: "#3B82F6",
  },
  [ORDER_STATUS.ACCEPTED]: {
    label: "Accepted",
    color: "text-warning",
    bg: "bg-amber-50",
    border: "border-amber-200",
    dot: "bg-warning",
    badge: "bg-amber-50 text-amber-600 border border-amber-200",
    hex: "#F59E0B",
  },
  [ORDER_STATUS.PICKED]: {
    label: "Picked",
    color: "text-violet-600",
    bg: "bg-violet-50",
    border: "border-violet-200",
    dot: "bg-violet-500",
    badge: "bg-violet-50 text-violet-600 border border-violet-200",
    hex: "#8B5CF6",
  },
  [ORDER_STATUS.DELIVERED]: {
    label: "Delivered",
    color: "text-success",
    bg: "bg-green-50",
    border: "border-green-200",
    dot: "bg-success",
    badge: "bg-green-50 text-green-600 border border-green-200",
    hex: "#22C55E",
  },
  [ORDER_STATUS.CANCELLED]: {
    label: "Cancelled",
    color: "text-danger",
    bg: "bg-red-50",
    border: "border-red-200",
    dot: "bg-danger",
    badge: "bg-red-50 text-red-600 border border-red-200",
    hex: "#EF4444",
  },
};

export const PAYMENT_METHODS = ["cash", "transfer", "card"];

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
