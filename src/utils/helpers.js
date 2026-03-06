/**
 * Parse items_json from DB — stored as JSON string or already an array.
 * DB column: items_json  (e.g. '[{"name":"Rice 2kg","qty":2}]')
 */
export function parseItems(items_json) {
  if (!items_json) return [];
  if (Array.isArray(items_json)) return items_json;
  try {
    return JSON.parse(items_json);
  } catch {
    return [];
  }
}

/** Stringify items array for POST body */
export function stringifyItems(items) {
  return JSON.stringify(items.filter((i) => i.name?.trim()));
}

/** Human-readable relative time */
export function timeAgo(isoString) {
  if (!isoString) return "—";
  const diff = Date.now() - new Date(isoString).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ${m % 60}m ago`;
  return `${Math.floor(h / 24)}d ago`;
}

/** Format date nicely */
export function formatDate(isoString) {
  if (!isoString) return "";
  return new Date(isoString).toLocaleDateString("en-RW", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/** Derive display label for first part of location string */
export function shortLocation(location) {
  if (!location) return "—";
  return location.split(",")[0].trim();
}
