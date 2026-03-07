import { useState, useEffect } from "react";
import { useAuth } from "./hooks/useAuth";
import { useOrders } from "./hooks/useOrders";
import { useRiders } from "./hooks/useRiders";
import { LandingPage } from "./pages/LandingPage";
import { AuthPage } from "./pages/AuthPage";
import { Sidebar } from "./components/layout/Sidebar";
import { TopBar } from "./components/layout/TopBar";
import { DashboardPage } from "./pages/DashboardPage";
import { VendorPage } from "./pages/VendorPage";
import { RunnerPage } from "./pages/RunnerPage";
import { DispatcherPage } from "./pages/DispatcherPage";
import { DeliveryPage } from "./pages/DeliveryPage";
import { KanbanPage } from "./pages/KanbanPage";
import { ORDER_STATUS } from "./utils/constants";
import { ROLE_META as AUTH_ROLE_META } from "./hooks/useAuth";

// ─── Dashboard shell ──────────────────────────────────────────────────────────
function DashboardShell({ auth }) {
  const { user, allowedPages, defaultPage, canAccess, logout } = auth;
  const [page, setPage] = useState(defaultPage);

  const orders = useOrders(user);
  const ridersData = useRiders();

  // Silent redirect: if current page is not allowed, snap to defaultPage
  useEffect(() => {
    if (!canAccess(page)) {
      setPage(defaultPage);
    }
  }, [page, canAccess, defaultPage]);

  const newOrderCount = orders.orders.filter(
    (o) => o.status === ORDER_STATUS.PENDING
  ).length;

  const sharedProps = {
    orders: orders.orders,
    loading: orders.loading,
    error: orders.error,
    onRefetch: orders.refetch,
  };

  // While effect hasn't fired yet, safeguard the render
  const safePage = canAccess(page) ? page : defaultPage;

  const navigate = (id) => {
    if (canAccess(id)) setPage(id);
    // Silently ignore clicks on pages the role can't access
  };

  return (
    <div className="flex h-screen overflow-hidden bg-secondary-50 font-sans">
      <Sidebar
        currentPage={safePage}
        onNavigate={navigate}
        allowedPages={allowedPages}
        newOrderCount={newOrderCount}
      />
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <TopBar
          newOrderCount={newOrderCount}
          user={user}
          userMeta={AUTH_ROLE_META[auth.role]}
          onLogout={logout}
        />
        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-[1200px] mx-auto animate-fadeUp" key={safePage}>
            {safePage === "dashboard" && <DashboardPage {...sharedProps} />}
            {safePage === "vendor" && <VendorPage {...sharedProps} onCreateOrder={orders.createOrder} onDeleteOrder={orders.deleteOrder} />}
            {safePage === "runner" && <RunnerPage {...sharedProps} onAccept={orders.acceptOrder} onPicked={orders.markPicked} onDelivered={orders.markDelivered} />}
            {safePage === "dispatcher" && <DispatcherPage {...sharedProps} riders={ridersData.riders} />}
            {safePage === "delivery" && <DeliveryPage {...sharedProps} onValidateDelivery={orders.validateDelivery} />}
            {safePage === "kanban" && <KanbanPage {...sharedProps} />}
          </div>
        </main>
      </div>
    </div>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────
export default function App() {
  const auth = useAuth();
  const [screen, setScreen] = useState(
    auth.isAuthenticated ? "dashboard" : "landing"
  );

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [screen]);

  const handleLogin = (token, userData) => {
    auth.login(token, userData);
    setScreen("dashboard");
  };

  const handleLogout = () => {
    auth.logout();
    setScreen("landing");
  };

  const authWithLogout = { ...auth, logout: handleLogout };

  if (screen === "landing") return <LandingPage onNavigate={setScreen} />;
  if (screen === "login") return <AuthPage mode="login" onNavigate={setScreen} onLogin={handleLogin} />;
  if (screen === "signup") return <AuthPage mode="signup" onNavigate={setScreen} onLogin={handleLogin} />;
  if (screen === "dashboard") return <DashboardShell auth={authWithLogout} />;

  return null;
}
