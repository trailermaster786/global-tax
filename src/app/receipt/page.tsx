"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { GlobalTollLogo } from "@/components/brand/logo";

function ReceiptContent() {
  const searchParams = useSearchParams();

  const trn = searchParams.get("trn") || "—";
  const date = searchParams.get("date") || "—";
  const time = searchParams.get("time") || "—";
  const plate = searchParams.get("plate") || "—";
  const vehicle = searchParams.get("vehicle") || "—";
  const plaza = searchParams.get("plaza") || "—";
  const lane = searchParams.get("lane") || "—";
  const operator = searchParams.get("operator") || "—";
  const baseToll = searchParams.get("base") || "0.000";
  const vat = searchParams.get("vat") || "0.000";
  const fee = searchParams.get("fee") || "0.500";
  const total = searchParams.get("total") || "0.000";
  const status = searchParams.get("status") || "PAID";

  const baseNum = parseFloat(baseToll) || 0;
  const vatNum = parseFloat(vat) || 0;
  const feeNum = parseFloat(fee) || 0;
  const totalNum = parseFloat(total) || 0;
  const whole = Math.floor(totalNum);
  const frac = Math.round((totalNum - whole) * 1000);

  return (
    <div className="min-h-screen bg-canvas grid place-items-center p-4 relative overflow-hidden">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-emerald-100 rounded-full blur-3xl opacity-40" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-teal/10 rounded-full blur-3xl opacity-40" />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Success banner */}
        <div className="text-center mb-6">
          <div className="h-20 w-20 mx-auto rounded-full bg-emerald-100 grid place-items-center mb-4">
            <svg className="h-10 w-10 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-navy">Payment Successful</h1>
          <p className="text-sm text-muted-foreground mt-1">Your toll payment has been processed</p>
        </div>

        {/* Receipt Card */}
        <div className="p-0 border border-border relative overflow-hidden bg-white rounded-xl shadow-lg">
          {/* PAID Stamp */}
          <div className="absolute top-6 right-6 z-10">
            <svg width="85" height="85" viewBox="0 0 85 85" className="opacity-80">
              <circle cx="42.5" cy="42.5" r="38" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeDasharray="4 2" />
              <circle cx="42.5" cy="42.5" r="32" fill="none" stroke="#16a34a" strokeWidth="1.5" />
              <text x="42.5" y="38" textAnchor="middle" fill="#16a34a" fontSize="8" fontWeight="bold" fontFamily="Arial">
                APPROVED
              </text>
              <text x="42.5" y="50" textAnchor="middle" fill="#16a34a" fontSize="10" fontWeight="900" fontFamily="Arial">
                {status}
              </text>
            </svg>
          </div>

          {/* Header — Logo + Company */}
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
              <span className="font-mono font-bold text-gray-800">{trn}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">التاريخ / Date:</span>
              <span className="font-mono text-gray-800">{date}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">الوقت / Time:</span>
              <span className="font-mono text-gray-800">{time}</span>
            </div>
          </div>

          {/* Vehicle + Toll Details */}
          <div className="px-5 py-4 border-b border-gray-200 text-[11px]">
            <div className="flex justify-between mb-2">
              <span className="text-gray-500">رقم اللوحة / Vehicle Plate:</span>
              <span className="font-mono font-bold text-gray-800">{plate}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-500">نوع المركبة / Vehicle Class:</span>
              <span className="font-mono text-gray-800">{vehicle}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-500">المحطة / Plaza:</span>
              <span className="text-gray-800">{plaza}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-500">الحارة / Lane:</span>
              <span className="font-mono text-gray-800">{lane}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">المشغل / Operator:</span>
              <span className="text-gray-800">{operator}</span>
            </div>
          </div>

          {/* Amount Breakdown */}
          <div className="px-5 py-4 border-b border-gray-200 text-[11px]">
            <div className="flex justify-between mb-2">
              <span className="text-gray-500">مبلغ الرسوم / Base Toll:</span>
              <span className="font-mono text-gray-800">OMR {baseToll}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-500">ضريبة القيمة المضافة / VAT (5%):</span>
              <span className="font-mono text-gray-800">OMR {vat}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-500">الرسوم الإدارية / Admin Fee:</span>
              <span className="font-mono text-gray-800">OMR {fee}</span>
            </div>
            <div className="border-t border-gray-300 mt-2 pt-2 flex justify-between">
              <span className="font-bold text-gray-800">المبلغ الإجمالي / Total Amount:</span>
              <span className="font-mono font-bold text-sm text-gray-900">OMR {total}</span>
            </div>
          </div>

          {/* Amount in words */}
          <div className="px-5 py-3 border-b border-gray-200 text-[10px] text-gray-500">
            <span className="font-semibold">المبلغ بالحروف / Amount in Words:</span>
            <span className="text-gray-700"> {whole} OMR and {frac} Baiza</span>
          </div>

          {/* QR Code */}
          <div className="px-5 py-4 flex justify-center">
            <div className="p-2 bg-white border border-gray-300 rounded-lg">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(typeof window !== "undefined" ? window.location.href : "")}&bgcolor=ffffff&color=000000`}
                alt="QR Code - Scan to view receipt"
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
        </div>
      </div>
    </div>
  );
}

export default function ReceiptPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading receipt...</div>}>
      <ReceiptContent />
    </Suspense>
  );
}
