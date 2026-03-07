import { useState, useEffect, useCallback } from "react";
import * as api from "../services/api";

// ─── Role definitions ─────────────────────────────────────────────────────────
export const ROLES = {
  VENDOR: "vendor",
  RUNNER: "runner",
  DISPATCHER: "dispatcher",
  RIDER: "rider",
  ADMIN: "admin",
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
  vendor: ["dashboard", "vendor", "kanban"],
  runner: ["runner", "dispatcher", "kanban"],
  rider: ["delivery"],
  dispatcher: ["dispatcher", "kanban"],
  admin: ["dashboard", "vendor", "runner", "dispatcher", "delivery", "kanban"],
};

/** Human-readable label + accent color per role, used in the TopBar pill */
export const ROLE_META = {
  vendor: { label: "Vendor", emoji: "🏪", color: "bg-primary-50 text-primary-700 border-primary-200" },
  runner: { label: "Runner", emoji: "🏃", color: "bg-amber-50 text-amber-700 border-amber-200" },
  rider: { label: "Rider", emoji: "🚴", color: "bg-green-50 text-green-700 border-green-200" },
  admin: { label: "Admin", emoji: "⚙️", color: "bg-secondary-100 text-secondary-500 border-secondary-200" },
  dispatcher: { label: "Dispatch", emoji: "📡", color: "bg-violet-50 text-violet-700 border-violet-200" },
};
// ─── Storage helpers ──────────────────────────────────────────────────────────
export function saveSession({ token, user }) {
  if (token) localStorage.setItem("runmate_token", token);
  if (user) localStorage.setItem("runmate_user", JSON.stringify(user));
}

export function clearSession() {
  localStorage.removeItem("runmate_token");
  localStorage.removeItem("runmate_user");
}

function loadUser() {
  try {
    const raw = localStorage.getItem("runmate_user");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

// ─── Hook ─────────────────────────────────────────────────────────────────────
export function useAuth() {
  const [user, setUser] = useState(loadUser);

  useEffect(() => {
    const token = localStorage.getItem("runmate_token");
    if (token && !user) {
      api.getCurrentUser()
        .then(data => {
          const freshUser = data?.user || data;
          setUser(freshUser);
          localStorage.setItem("runmate_user", JSON.stringify(freshUser));
        })
        .catch(err => {
          console.error("Auth error:", err.message);
          localStorage.removeItem("runmate_token");
          localStorage.removeItem("runmate_user");
          setUser(null);
        });
    }
  }, [user]);

  // Handle both singular "role" and plural "roles" (which can be a string or array)
  const getPrimaryRole = (u) => {
    if (!u) return null;
    const target = u.user || u;
    let r = target.roles || target.role;
    if (Array.isArray(r)) r = r[0];
    if (typeof r !== "string") return null;

    // Normalize: remove ROLE_ prefix if any, and lowercase
    return r.replace(/^ROLE_/i, "").toLowerCase();
  };

  const role = getPrimaryRole(user);

  /** Pages this user can visit */
  const allowedPages = role ? (ROLE_PAGES[role] ?? []) : [];

  /** Default landing page after login */
  const defaultPage = allowedPages[0] || "dashboard";

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
    isAuthenticated: !!user && !!localStorage.getItem("runmate_token"),
    login,
    logout,
  };
}
