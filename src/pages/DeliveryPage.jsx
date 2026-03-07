import { useState } from "react";
import { ORDER_STATUS } from "../utils/constants";
import { PageLoader, ErrorBanner } from "../components/ui/index";
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
  const [result, setResult] = useState(null); // { type: "success"|"fail", orderId? }
  const [verifying, setVerifying] = useState(false);
  const [lang, setLang] = useState("en");

  if (loading) return <PageLoader />;
  if (error) return <ErrorBanner message={error} onRetry={onRefetch} />;

  const outOrders = orders.filter((o) => o.status === ORDER_STATUS.PICKED);

  const handleKey = (k) => {
    if (typeof k === "number" && code.length < 4) setCode((c) => c + k);
  };
  const handleDel = () => setCode((c) => c.slice(0, -1));

  const handleVerify = async () => {
    if (code.length < 4) return;
    // Find the order matching this delivery_code that's PICKED
    const order = outOrders.find((o) => o.delivery_code === code);
    if (!order) {
      setResult({ type: "fail" });
      return;
    }
    setVerifying(true);
    try {
      // POST /orders/:id/validate-delivery → body: { delivery_code }
      const res = await onValidateDelivery(order.id, code);
      setResult({ type: res.success ? "success" : "fail", orderId: order.id });
    } catch {
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
        title="Delivery Confirmation"
        subtitle="USSD-style code verification for riders"
      />

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
                      <p className="text-primary-200 text-xs font-sans mb-2">Enter delivery code:</p>
                      <div className="bg-primary-900 rounded-lg h-12 flex items-center justify-center">
                        {code ? (
                          <span className="text-white text-3xl font-extrabold font-heading tracking-[0.3em]">
                            {code}
                          </span>
                        ) : (
                          <span className="text-primary-700 text-2xl font-heading tracking-[0.3em]">
                            _ _ _ _
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
                    disabled={code.length < 4 || verifying}
                    className={`flex-[2] rounded-xl py-2.5 text-sm font-extrabold font-sans transition-all
                      ${code.length >= 4
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
                Orders Out for Delivery ({outOrders.length})
              </p>
            </div>
            {outOrders.length === 0 ? (
              <div className="p-10 text-center">
                <p className="text-sm text-secondary-300 font-sans">No active deliveries right now.</p>
              </div>
            ) : (
              <div className="divide-y divide-secondary-50">
                {outOrders.map((order) => (
                  <button
                    key={order.id}
                    onClick={() => { setCode(order.delivery_code); setResult(null); }}
                    className="w-full px-5 py-4 text-left hover:bg-amber-50 transition-colors group"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-xs font-extrabold text-primary-600 font-sans">{order.id}</span>
                        </div>
                        <p className="font-bold text-primary-900 font-sans text-sm">{order.customer_name}</p>
                        <p className="text-xs text-secondary-400 font-sans mt-0.5">{order.assigned_rider || "Rider not assigned"}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[9px] text-secondary-300 font-sans uppercase tracking-wider mb-0.5">Code</p>
                        <p className="text-2xl font-extrabold text-primary-900 font-heading tracking-[0.2em]">
                          {order.delivery_code}
                        </p>
                        <p className="text-[10px] text-accent-500 font-bold font-sans mt-0.5 group-hover:underline">
                          Tap to auto-fill →
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
