"use client";
import { useMemo, useState } from "react";
import { useStore } from "@/store/app-store";
import { useI18n } from "@/lib/i18n";
import { GlobalTollLogo } from "@/components/brand/logo";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Printer, Trash2, Download, Search } from "lucide-react";

const PAGE_SIZE = 15;

export default function ReceiptsLogModule() {
  const { transactions, plazas, deleteTransaction } = useStore();
  const { t } = useI18n();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [plazaFilter, setPlazaFilter] = useState("ALL");
  const [paymentFilter, setPaymentFilter] = useState("ALL");
  const [page, setPage] = useState(1);
  const [reprintTx, setReprintTx] = useState<typeof transactions[0] | null>(null);

  const plazaNames = useMemo(() => {
    const map: Record<string, string> = {};
    plazas.forEach((p) => { map[p.id] = p.name; });
    return map;
  }, [plazas]);

  const filtered = useMemo(() => {
    return transactions.filter((tx) => {
      const plate = tx.plateCaptured || "";
      if (search && !plate.toLowerCase().includes(search.toLowerCase()) && !tx.id.toLowerCase().includes(search.toLowerCase())) return false;
      if (statusFilter !== "ALL" && tx.status !== statusFilter) return false;
      if (plazaFilter !== "ALL" && tx.plazaId !== plazaFilter) return false;
      if (paymentFilter !== "ALL" && tx.paymentMethod !== paymentFilter) return false;
      return true;
    });
  }, [transactions, search, statusFilter, plazaFilter, paymentFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const exportCSV = () => {
    const headers = ["Receipt #", "Date", "Plate", "Vehicle", "Plaza", "Amount (OMR)", "Payment", "Status"];
    const rows = filtered.map((tx) => [tx.id, tx.capturedAt.slice(0, 10), tx.plateCaptured || "", tx.vehicleClassCode || "", plazaNames[tx.plazaId || ""] || "", tx.totalAmount.toFixed(3), tx.paymentMethod, tx.status]);
    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `receipts-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDelete = (id: string) => {
    if (confirm("Delete this receipt?")) {
      deleteTransaction(id);
    }
  };

  const handleReprint = (tx: typeof transactions[0]) => {
    setReprintTx(tx);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">
        <Input placeholder={t("receiptLog.search")} value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} className="max-w-sm dark:bg-zinc-900 dark:border-zinc-700" />
        <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }} className="px-3 py-2 border rounded-lg text-sm dark:bg-zinc-900 dark:border-zinc-700 dark:text-white">
          <option value="ALL">{t("receiptLog.allStatus")}</option>
          <option value="SUCCESS">Success</option>
          <option value="PENDING">Pending</option>
          <option value="FAILED">Failed</option>
        </select>
        <select value={plazaFilter} onChange={(e) => { setPlazaFilter(e.target.value); setPage(1); }} className="px-3 py-2 border rounded-lg text-sm dark:bg-zinc-900 dark:border-zinc-700 dark:text-white">
          <option value="ALL">{t("receiptLog.allPlazas")}</option>
          {plazas.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
        <select value={paymentFilter} onChange={(e) => { setPaymentFilter(e.target.value); setPage(1); }} className="px-3 py-2 border rounded-lg text-sm dark:bg-zinc-900 dark:border-zinc-700 dark:text-white">
          <option value="ALL">{t("receiptLog.allPayment")}</option>
          <option value="CASH">Cash</option>
          <option value="WALLET">Wallet</option>
          <option value="CARD">Card</option>
          <option value="UPI">UPI</option>
        </select>
        <Button onClick={exportCSV} variant="outline" size="sm" className="dark:border-zinc-700 gap-1.5"><Download className="h-3.5 w-3.5" /> {t("receiptLog.exportCSV")}</Button>
      </div>

      {/* Reprint Modal — matching operator receipt style */}
      {reprintTx && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md relative">
            <button onClick={() => setReprintTx(null)} className="absolute -top-2 -right-2 z-10 h-8 w-8 rounded-full bg-white shadow-lg grid place-items-center hover:bg-gray-100">
              <X className="h-4 w-4" />
            </button>
            <Card className="p-0 border border-border relative overflow-hidden bg-white">
              {/* PAID Stamp */}
              <div className="absolute top-6 right-6 z-10">
                <svg width="85" height="85" viewBox="0 0 85 85" className="opacity-80">
                  <circle cx="42.5" cy="42.5" r="38" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeDasharray="4 2" />
                  <circle cx="42.5" cy="42.5" r="32" fill="none" stroke="#16a34a" strokeWidth="1.5" />
                  <text x="42.5" y="38" textAnchor="middle" fill="#16a34a" fontSize="8" fontWeight="bold" fontFamily="Arial">APPROVED</text>
                  <text x="42.5" y="50" textAnchor="middle" fill="#16a34a" fontSize="10" fontWeight="900" fontFamily="Arial">PAID</text>
                </svg>
              </div>

              {/* Header */}
              <div className="text-center py-5 px-4 border-b border-gray-200">
                <div className="flex justify-center mb-2">
                  <GlobalTollLogo size={44} variant="dark" />
                </div>
                <div className="text-[11px] text-gray-700 leading-relaxed">
                  <div className="font-semibold">هيئة الطرق السريعة والمركبات</div>
                  <div>Royal Oman Police — Transport &amp; Licensing</div>
                  <div className="text-[10px] text-gray-500 mt-0.5">Muscat, Sultanate of Oman</div>
                </div>
              </div>

              {/* Title */}
              <div className="text-center py-3 border-b border-gray-200">
                <div className="text-[11px] text-gray-500">(Payment Receipt)</div>
                <div className="text-sm font-bold text-gray-800">فاتورة ضريبة / Tax Invoice</div>
              </div>

              {/* TRN + Date */}
              <div className="px-5 py-4 border-b border-gray-200 space-y-2 text-[11px]">
                <div className="flex justify-between">
                  <span className="text-gray-500">TRN:</span>
                  <span className="font-mono font-bold text-gray-800">{reprintTx.id.slice(-8).toUpperCase()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">التاريخ / Date:</span>
                  <span className="font-mono text-gray-800">{reprintTx.capturedAt.slice(0, 10)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">الوقت / Time:</span>
                  <span className="font-mono text-gray-800">{reprintTx.capturedAt.slice(11, 16)}</span>
                </div>
              </div>

              {/* Vehicle + Toll Details */}
              <div className="px-5 py-4 border-b border-gray-200 text-[11px]">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-500">رقم اللوحة / Vehicle Plate:</span>
                  <span className="font-mono font-bold text-gray-800">{reprintTx.plateCaptured || "—"}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-500">نوع المركبة / Vehicle Class:</span>
                  <span className="font-mono text-gray-800">{(reprintTx.vehicleClassCode || "—").replace("_", " ")}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-500">المحطة / Plaza:</span>
                  <span className="text-gray-800">{plazaNames[reprintTx.plazaId || ""] || "—"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">طريقة الدفع / Payment:</span>
                  <span className="text-gray-800">{reprintTx.paymentMethod}</span>
                </div>
              </div>

              {/* Amount Breakdown */}
              <div className="px-5 py-4 border-b border-gray-200 text-[11px]">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-500">مبلغ الرسوم / Base Toll:</span>
                  <span className="font-mono text-gray-800">OMR {reprintTx.amount.toFixed(3)}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-500">ضريبة القيمة المضافة / VAT (5%):</span>
                  <span className="font-mono text-gray-800">OMR {reprintTx.taxAmount.toFixed(3)}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-500">الرسوم الإدارية / Admin Fee:</span>
                  <span className="font-mono text-gray-800">OMR 0.500</span>
                </div>
                <div className="border-t border-gray-300 mt-2 pt-2 flex justify-between">
                  <span className="font-bold text-gray-800">المبلغ الإجمالي / Total Amount:</span>
                  <span className="font-mono font-bold text-sm text-gray-900">OMR {(reprintTx.totalAmount + 0.5).toFixed(3)}</span>
                </div>
              </div>

              {/* Amount in words */}
              <div className="px-5 py-3 border-b border-gray-200 text-[10px] text-gray-500">
                <span className="font-semibold">المبلغ بالحروف / Amount in Words:</span>
                <span className="text-gray-700"> {Math.floor(reprintTx.totalAmount + 0.5)} OMR and {Math.round(((reprintTx.totalAmount + 0.5) - Math.floor(reprintTx.totalAmount + 0.5)) * 1000)} Baiza</span>
              </div>

              {/* QR Code */}
              <div className="px-5 py-4 flex justify-center">
                <div className="p-2 bg-white border border-gray-300 rounded-lg">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(`${typeof window !== "undefined" ? window.location.origin : ""}/receipt?trn=${reprintTx.id.slice(-8).toUpperCase()}&date=${reprintTx.capturedAt.slice(0, 10)}&time=${reprintTx.capturedAt.slice(11, 16)}&plate=${encodeURIComponent(reprintTx.plateCaptured || "—")}&vehicle=${encodeURIComponent((reprintTx.vehicleClassCode || "—").replace("_", " "))}&plaza=${encodeURIComponent(plazaNames[reprintTx.plazaId || ""] || "—")}&lane=L1&operator=Operator&base=${encodeURIComponent(reprintTx.amount.toFixed(3))}&vat=${encodeURIComponent(reprintTx.taxAmount.toFixed(3))}&fee=0.500&total=${encodeURIComponent((reprintTx.totalAmount + 0.5).toFixed(3))}&status=PAID`)}&bgcolor=ffffff&color=000000`}
                    alt="QR Code"
                    className="w-[120px] h-[120px]"
                    width={120}
                    height={120}
                  />
                </div>
              </div>
              <div className="text-center text-[9px] text-gray-400 pb-2">امسح الرمز لعرض الإيصال — Scan to view receipt</div>

              {/* Footer */}
              <div className="px-5 py-3 text-center text-[9px] text-gray-400 border-t border-gray-200">
                <div>نظام توصيل للطرق السريعة — Global Toll Management System</div>
                <div className="mt-0.5">هذا الإيصال صادر عن نظام الهيئة الرسمي — This is an official receipt</div>
              </div>
            </Card>

            {/* Actions */}
            <div className="flex gap-3 mt-4">
              <Button variant="outline" className="flex-1 h-10 rounded-xl gap-1.5" onClick={() => window.print()}><Printer className="h-4 w-4" /> Print</Button>
              <Button className="flex-1 h-10 rounded-xl text-white" onClick={() => setReprintTx(null)} style={{ background: "linear-gradient(135deg, #2E8B8B 0%, #1F6868 100%)" }}>Close</Button>
            </div>
          </div>
        </div>
      )}

      <Card className="dark:bg-zinc-900 dark:border-zinc-800">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-muted-foreground border-b dark:border-zinc-800">
                <th className="p-3 font-medium">{t("receiptLog.receiptNo")}</th>
                <th className="p-3 font-medium">{t("receiptLog.date")}</th>
                <th className="p-3 font-medium">{t("receiptLog.plate")}</th>
                <th className="p-3 font-medium">{t("receiptLog.vehicleClass")}</th>
                <th className="p-3 font-medium">{t("receiptLog.plaza")}</th>
                <th className="p-3 font-medium">{t("receiptLog.amount")}</th>
                <th className="p-3 font-medium">{t("receiptLog.payment")}</th>
                <th className="p-3 font-medium">{t("receiptLog.status")}</th>
                <th className="p-3 font-medium">Reprint</th>
                <th className="p-3 font-medium">{t("stations.delete")}</th>
              </tr>
            </thead>
            <tbody>
              {paged.map((tx) => (
                <tr key={tx.id} className="border-b last:border-0 dark:border-zinc-800 hover:bg-teal/5 transition-colors duration-200">
                  <td className="p-3 font-mono text-xs">{tx.id.slice(-8)}</td>
                  <td className="p-3 text-xs">{tx.capturedAt.replace("T", " ").slice(0, 16)}</td>
                  <td className="p-3">{tx.plateCaptured || "—"}</td>
                  <td className="p-3">{tx.vehicleClassCode || "—"}</td>
                  <td className="p-3">{plazaNames[tx.plazaId || ""] || "—"}</td>
                  <td className="p-3 font-semibold">OMR {tx.totalAmount.toFixed(3)}</td>
                  <td className="p-3">{tx.paymentMethod}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${tx.status === "SUCCESS" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : tx.status === "PENDING" ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400" : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"}`}>
                      {tx.status}
                    </span>
                  </td>
                  <td className="p-3"><Button variant="ghost" size="sm" onClick={() => handleReprint(tx)} className="gap-1.5"><Printer className="h-3.5 w-3.5" /></Button></td>
                  <td className="p-3"><Button variant="ghost" size="sm" onClick={() => handleDelete(tx.id)} className="text-red-600 hover:text-red-700"><Trash2 className="h-4 w-4" /></Button></td>
                </tr>
              ))}
              {paged.length === 0 && (
                <tr><td colSpan={10} className="p-8 text-center text-muted-foreground">{t("common.noResults")}</td></tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between p-3 border-t dark:border-zinc-800 text-sm text-muted-foreground">
          <span>{t("receiptLog.showing")} {paged.length} {t("receiptLog.of")} {filtered.length} {t("receiptLog.receipts")}</span>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(page - 1)} className="dark:border-zinc-700">{t("common.prev")}</Button>
            <span className="px-3 py-1">{t("common.page")} {page} {t("common.of")} {totalPages}</span>
            <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage(page + 1)} className="dark:border-zinc-700">{t("common.next")}</Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
