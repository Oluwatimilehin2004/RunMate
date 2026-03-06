import { useState, useCallback } from "react";

// ─── Role definitions ─────────────────────────────────────────────────────────
export const ROLES = {
  VENDOR:     "vendor",
  RUNNER:     "runner",
  DISPATCHER: "dispatcher",
  RIDER:      "rider",
  ADMIN:      "admin",
};

/**
 * Pages each role is allowed to access.
 * Keys match the page IDs used in Sidebar & DashboardShell.
 * The FIRST entry in each array is that role's default/home page —
 * this is where they land after login AND where they're redirected
 * if they somehow hit a forbidden page.
 *
 * Confirmed access matrix:
 *   vendor      → Dashboard, Vendor Portal, Kanban
 *   runner      → Runner, Dispatch
 *   dispatcher  → Dispatch, Kanban
 *   rider       → Delivery only
 *   admin       → Everything
 */
export const ROLE_PAGES = {
  [ROLES.VENDOR]:     ["overview", "vendor", "kanban"],
  [ROLES.RUNNER]:     ["runner", "dispatcher", "dispatcher", "kanban"],
  [ROLES.RIDER]:      ["delivery"],
//   [ROLES.ADMIN]:      ["overview", "vendor", "runner", "dispatcher", "delivery", "kanban"],
};

/** Human-readable label + accent color per role, used in the TopBar pill */
export const ROLE_META = {
  [ROLES.VENDOR]:     { label: "Vendor",     emoji: "🏪", color: "bg-primary-50 text-primary-700 border-primary-200" },
  [ROLES.RUNNER]:     { label: "Runner",     emoji: "🏃", color: "bg-amber-50 text-amber-700 border-amber-200" },
  [ROLES.RIDER]:      { label: "Rider",      emoji: "🚴", color: "bg-green-50 text-green-700 border-green-200" },
//   [ROLES.ADMIN]:      { label: "Admin",      emoji: "⚙️", color: "bg-secondary-100 text-secondary-500 border-secondary-200" },
};

// ─── Storage helpers ──────────────────────────────────────────────────────────
export function saveSession({ token, user }) {
  if (token) localStorage.setItem("faas_token", token);
  if (user)  localStorage.setItem("faas_user", JSON.stringify(user));
}

export function clearSession() {
  localStorage.removeItem("faas_token");
  localStorage.removeItem("faas_user");
}

function loadUser() {
  try {
    const raw = localStorage.getItem("faas_user");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

// ─── Hook ─────────────────────────────────────────────────────────────────────
export function useAuth() {
  const [user, setUser] = useState(loadUser);

  const role = user?.role || null;

  /** Pages this user can visit */
  const allowedPages = role ? (ROLE_PAGES[role] ?? []) : [];

  /** Default landing page after login */
  const defaultPage = allowedPages[0] ?? "overview";

  /** True if this user can visit a given page id */
  const canAccess = useCallback(
    (pageId) => allowedPages.includes(pageId),
    [allowedPages]
  );

  const login = useCallback((token, userData) => {
    saveSession({ token, user: userData });
    setUser(userData);
  }, []);

  const logout = useCallback(() => {
    clearSession();
    setUser(null);
  }, []);

  return {
    user,
    role,
    allowedPages,
    defaultPage,
    canAccess,
    isAuthenticated: !!user && !!localStorage.getItem("faas_token"),
    login,
    logout,
  };
}
