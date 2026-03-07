import { useState } from "react";
import { ORDER_STATUS } from "../utils/constants";
import { parseItems } from "../utils/helpers";
import { PageLoader, ErrorBanner, LocationIcon } from "../components/ui/index";
import { PageHeader } from "../components/layout/PageHeader";

const MESSAGES = {
  success: {
    en: { title: "✓ Delivery Confirmed!", body: "Order marked as delivered.", sub: "The customer's order has been successfully delivered." },
    fr: { title: "✓ Livraison Confirmée!", body: "Commande marquée comme livrée.", sub: "La commande a été livrée avec succès." },
    rw: { title: "✓ Doherejwe Neza!", body: "Itegeko ryabonetse. Murakoze!", sub: "Ibicuruzwa bya client biratanzwe neza." },
  },
  fail: {
    en: { title: "✗ Invalid Code", body: "This code doesn't match any active delivery.", sub: "Please verify the code with the customer." },
    fr: { title: "✗ Code Invalide", body: "Ce code ne correspond à aucune livraison.", sub: "Veuillez vérifier le code avec le client." },
    rw: { title: "✗ Kodi Si Yo", body: "Kodi ntifite itegeko ryakurikiraho.", sub: "Reba kodi na client." },
  },
};

export function DeliveryPage({ orders, loading, error, onRefetch, onValidateDelivery }) {
  const [code, setCode] = useState("");
  const [result, setResult] = useState(null);
  const [verifying, setVerifying] = useState(false);
  const [lang, setLang] = useState("en");

  if (loading) return <PageLoader />;
  if (error) return <ErrorBanner message={error} onRetry={onRefetch} />;

  // Show all orders for rider (not just picked)
  const outOrders = orders;
  const deliveredToday = orders.filter((o) => o.status === ORDER_STATUS.DELIVERED).length;

  console.log('All orders:', orders);
  console.log('Orders for rider:', outOrders);

  const handleKey = (k) => {
    if (typeof k === "number" && code.length < 6) setCode((c) => c + k);
  };
  const handleDel = () => setCode((c) => c.slice(0, -1));

  const handleVerify = async () => {
    if (code.length < 6) return;
    // Normalize both codes for comparison
    const normalizedInput = code.trim().replace(/\s+/g, '');
    
    console.log('=== DELIVERY CODE VERIFICATION ===');
    console.log('Input code:', normalizedInput);
    console.log('All orders:', orders);
    console.log('Order codes:', orders.map(o => ({
      id: o.id,
      code: o.delivery_code,
      status: o.status,
      customer: o.customer_name
    })));
    
    const order = orders.find((o) => {
      const orderCode = String(o.delivery_code || '').trim().replace(/\s+/g, '');
      console.log(`Comparing "${orderCode}" === "${normalizedInput}":`, orderCode === normalizedInput);
      return orderCode === normalizedInput;
    });
    
    if (!order) {
      console.error('No matching order found!');
      setResult({ type: "fail" });
      return;
    }
    setVerifying(true);
    try {
      await onValidateDelivery(order.id, code);
      setResult({ type: "success", orderId: order.id });
      setCode("");
    } catch (err) {
      console.error('Validation error:', err);
      setResult({ type: "fail" });
    } finally {
      setVerifying(false);
    }
  };

  const reset = () => { setCode(""); setResult(null); };

  const msg = result ? MESSAGES[result.type][lang] : null;

  return (
    <div>
      <PageHeader
        title="Rider Delivery Confirmation"
        subtitle="Enter the delivery code provided by the customer"
      />

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-orange-50 rounded-2xl p-4 border border-orange-200">
          <p className="text-[10px] font-bold uppercase tracking-widest font-sans text-secondary-400 mb-1">Active Deliveries</p>
          <p className="text-3xl font-extrabold font-heading text-orange-600">{outOrders.length}</p>
        </div>
        <div className="bg-green-50 rounded-2xl p-4 border border-green-200">
          <p className="text-[10px] font-bold uppercase tracking-widest font-sans text-secondary-400 mb-1">Delivered Today</p>
          <p className="text-3xl font-extrabold font-heading text-green-600">{deliveredToday}</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 items-start">
        {/* Phone mockup */}
        <div className="flex flex-col items-center">
          <div className="w-72 rounded-[2rem] p-2 bg-primary-900 shadow-[0_20px_60px_rgba(23,37,84,0.35)]">
            <div className="rounded-[1.5rem] overflow-hidden bg-[#0F1E3E]">
              {/* Status bar */}
              <div className="bg-[#0A1528] px-5 py-2 flex justify-between items-center">
                <span className="text-primary-400 text-[10px] font-bold font-sans">MTN RW</span>
                <span className="text-secondary-400 text-[10px] font-sans">●●●○  📶  🔋</span>
              </div>

              {/* USSD display */}
              <div className="p-5 min-h-[280px]">
                <div className="bg-primary-800 rounded-xl p-4 mb-4">
                  <p className="text-primary-400 text-[9px] font-bold font-sans uppercase tracking-widest mb-0.5">RunMate Delivery</p>
                  <p className="text-primary-300 text-[11px] font-sans mb-3">*123# — Confirm Delivery</p>

                  {!result ? (
                    <>
                      <p className="text-primary-200 text-xs font-sans mb-2">Enter 6-digit code:</p>
                      <div className="bg-primary-900 rounded-lg h-12 flex items-center justify-center">
                        {code ? (
                          <span className="text-white text-2xl font-extrabold font-heading tracking-[0.25em]">
                            {code}
                          </span>
                        ) : (
                          <span className="text-primary-700 text-xl font-heading tracking-[0.25em]">
                            _ _ _ _ _ _
                          </span>
                        )}
                      </div>
                    </>
                  ) : (
                    <div className={`rounded-lg p-3 text-center ${result.type === "success" ? "bg-green-900" : "bg-red-900"}`}>
                      <p className={`text-sm font-extrabold font-heading mb-1 ${result.type === "success" ? "text-green-300" : "text-red-300"}`}>
                        {msg.title}
                      </p>
                      <p className="text-white text-xs font-sans mb-1">{msg.body}</p>
                      <p className={`text-[11px] font-sans ${result.type === "success" ? "text-green-400" : "text-red-400"}`}>{msg.sub}</p>
                    </div>
                  )}
                </div>

                {/* Keypad */}
                {!result ? (
                  <div className="grid grid-cols-3 gap-2">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, "*", 0, "#"].map((k) => (
                      <button
                        key={k}
                        onClick={() => typeof k === "number" && handleKey(k)}
                        className={`rounded-lg py-3 text-lg font-extrabold font-heading transition-all active:scale-95
                          ${typeof k === "number"
                            ? "bg-primary-800 text-white hover:bg-primary-700"
                            : "bg-primary-900 text-primary-700 cursor-default"
                          }`}
                      >
                        {k}
                      </button>
                    ))}
                  </div>
                ) : (
                  <button
                    onClick={reset}
                    className="w-full bg-primary-700 hover:bg-primary-600 text-white rounded-lg py-3 text-sm font-bold font-sans transition-colors"
                  >
                    New Verification
                  </button>
                )}
              </div>

              {/* Action strip */}
              {!result && (
                <div className="px-4 pb-5 flex gap-2">
                  <button
                    onClick={handleDel}
                    className="flex-1 bg-primary-800 hover:bg-primary-700 text-secondary-400 rounded-xl py-2.5 text-xs font-bold font-sans transition-colors"
                  >
                    ← DEL
                  </button>
                  <button
                    onClick={handleVerify}
                    disabled={code.length < 6 || verifying}
                    className={`flex-[2] rounded-xl py-2.5 text-sm font-extrabold font-sans transition-all
                      ${code.length >= 6
                        ? "bg-success text-white hover:bg-green-600 shadow-[0_4px_12px_rgba(34,197,94,0.35)]"
                        : "bg-primary-800 text-primary-600 cursor-not-allowed"
                      }`}
                  >
                    {verifying ? "Checking…" : "CONFIRM ✓"}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Language switcher */}
          <div className="flex gap-2 mt-5">
            {["en", "fr", "rw"].map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className={`px-4 py-1.5 rounded-xl text-xs font-bold font-sans border-2 transition-all ${lang === l ? "border-primary-400 bg-primary-50 text-primary-700" : "border-secondary-200 bg-white text-secondary-400 hover:border-secondary-300"}`}
              >
                {l === "en" ? "English" : l === "fr" ? "Français" : "Kinyarwanda"}
              </button>
            ))}
          </div>
        </div>

        {/* Active deliveries panel */}
        <div>
          <div className="bg-white rounded-2xl shadow-card border border-secondary-100 overflow-hidden">
            <div className="px-5 py-4 border-b border-secondary-100">
              <p className="text-[11px] font-bold text-secondary-400 uppercase tracking-widest font-sans">
                My Active Deliveries ({outOrders.length})
              </p>
            </div>
            {outOrders.length === 0 ? (
              <div className="p-10 text-center">
                <div className="w-16 h-16 rounded-2xl bg-green-50 flex items-center justify-center mx-auto mb-3 text-3xl">
                  ✅
                </div>
                <p className="font-bold text-primary-900 font-sans mb-1">All deliveries completed!</p>
                <p className="text-sm text-secondary-300 font-sans">No active deliveries right now.</p>
              </div>
            ) : (
              <div className="divide-y divide-secondary-50">
                {outOrders.map((order) => {
                  const items = parseItems(order.items_json);
                  return (
                  <div key={order.id} className="px-5 py-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-extrabold text-primary-600 font-sans">{order.id}</span>
                        </div>
                        <p className="font-bold text-primary-900 font-sans text-base mb-2">{order.customer_name}</p>
                        
                        {/* Items list */}
                        <div className="bg-secondary-50 rounded-lg p-3 mb-2">
                          <p className="text-[10px] font-bold text-secondary-400 uppercase tracking-widest font-sans mb-2">Items to Deliver</p>
                          {items.map((item, i) => (
                            <div key={i} className="flex items-center justify-between py-1">
                              <span className="text-sm text-primary-900 font-sans">{item.name}</span>
                              <span className="text-xs font-bold text-secondary-400 font-sans">×{item.qty}</span>
                            </div>
                          ))}
                        </div>

                        <div className="flex items-center gap-1 text-xs text-secondary-400 font-sans mb-1">
                          <LocationIcon size={11} />
                          {order.location}
                        </div>
                        <p className="text-xs text-secondary-400 font-sans">{order.payment_method}</p>
                      </div>
                      <div className="text-right ml-4">
                        <p className="text-[9px] text-secondary-300 font-sans uppercase tracking-wider mb-1">Code</p>
                        <button
                          onClick={() => { setCode(order.delivery_code); setResult(null); }}
                          className="text-3xl font-extrabold text-primary-900 font-heading tracking-[0.2em] hover:text-primary-600 transition-colors"
                        >
                          {order.delivery_code}
                        </button>
                        <p className="text-[10px] text-accent-500 font-bold font-sans mt-1">
                          Tap to use →
                        </p>
                      </div>
                    </div>
                  </div>
                );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
