"use client";
import { useMemo, useState } from "react";
import { useStore } from "@/store/app-store";
import { useI18n } from "@/lib/i18n";
import type { Staff } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ManageOperatorsModule() {
  const { staff, addStaff, updateStaff, plazas, users } = useStore();
  const { t } = useI18n();
  const [editing, setEditing] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ email: "", password: "", role: "LANE_OPERATOR" as Staff["designation"], plazaId: "", status: "ACTIVE" as "ACTIVE" | "ON_LEAVE" | "INACTIVE" });

  const plazaNames = useMemo(() => {
    const map: Record<string, string> = {};
    plazas.forEach((p) => { map[p.id] = p.name; });
    return map;
  }, [plazas]);

const handleSave = () => {
    if (!form.email) return;
    const autoName = form.email.split("@")[0].replace(/[._-]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
    if (editing) {
      updateStaff(editing, { name: autoName, designation: form.role, plazaId: form.plazaId || undefined, status: form.status });
    } else {
      addStaff({ name: autoName, designation: form.role, plazaId: form.plazaId || undefined, email: form.email, password: form.password });
    }
    setShowForm(false);
    setEditing(null);
    setForm({ email: "", password: "", role: "LANE_OPERATOR", plazaId: "", status: "ACTIVE" });
  };

const startEdit = (s: typeof staff[0]) => {
    const user = users.find(u => u.id === s.userId || u.name === s.name);
    setForm({ email: user?.email ?? "", password: "", role: s.designation, plazaId: s.plazaId || "", status: s.status });
    setEditing(s.id);
    setShowForm(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">{t("operators.title")}</h2>
        <Button onClick={() => { setShowForm(true); setEditing(null); setForm({ email: "", password: "", role: "LANE_OPERATOR", plazaId: "", status: "ACTIVE" }); }}>{t("operators.add")}</Button>
      </div>

      {showForm && (
        <Card className="p-5 dark:bg-zinc-900 dark:border-zinc-800">
          <h3 className="font-semibold mb-4">{editing ? t("common.edit") : t("operators.add")}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
<div>
              <label className="text-sm font-medium">{t("operators.role")}</label>
              <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value as Staff["designation"] })} className="w-full px-3 py-2 border rounded-lg text-sm mt-1 dark:bg-zinc-800 dark:border-zinc-700 dark:text-white">
                <option value="LANE_OPERATOR">Lane Operator</option>
                <option value="PLAZA_MANAGER">Plaza Manager</option>
                <option value="FINANCE_OFFICER">Finance Officer</option>
                <option value="ENFORCEMENT">Enforcement</option>
                <option value="SUPPORT">Support</option>
                <option value="AUDITOR">Auditor</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">{t("login.email")}</label>
              <Input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="operator@omantoll.om" className="mt-1 dark:bg-zinc-800 dark:border-zinc-700" />
            </div>
            <div>
              <label className="text-sm font-medium">{t("login.password")}</label>
              <Input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="••••••••" className="mt-1 dark:bg-zinc-800 dark:border-zinc-700" />
            </div>
            <div>
              <label className="text-sm font-medium">{t("operators.plaza")}</label>
              <select value={form.plazaId} onChange={(e) => setForm({ ...form, plazaId: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm mt-1 dark:bg-zinc-800 dark:border-zinc-700 dark:text-white">
                <option value="">None</option>
                {plazas.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">{t("operators.status")}</label>
              <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as "ACTIVE" | "INACTIVE" | "ON_LEAVE" })} className="w-full px-3 py-2 border rounded-lg text-sm mt-1 dark:bg-zinc-800 dark:border-zinc-700 dark:text-white">
                <option value="ACTIVE">{t("operators.active")}</option>
                <option value="INACTIVE">{t("operators.inactive")}</option>
                <option value="ON_LEAVE">{t("operators.suspended")}</option>
              </select>
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <Button onClick={handleSave}>{t("operators.save")}</Button>
            <Button variant="outline" onClick={() => { setShowForm(false); setEditing(null); }} className="dark:border-zinc-700">{t("operators.cancel")}</Button>
          </div>
        </Card>
      )}

      <Card className="dark:bg-zinc-900 dark:border-zinc-800">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-muted-foreground border-b dark:border-zinc-800">
                <th className="p-3 font-medium">{t("operators.name")}</th>
                <th className="p-3 font-medium">{t("operators.badgeId")}</th>
                <th className="p-3 font-medium">{t("operators.role")}</th>
                <th className="p-3 font-medium">{t("operators.plaza")}</th>
                <th className="p-3 font-medium">{t("operators.status")}</th>
                <th className="p-3 font-medium">{t("operators.edit")}</th>
              </tr>
            </thead>
            <tbody>
              {staff.map((s) => (
                <tr key={s.id} className="border-b last:border-0 dark:border-zinc-800 hover:bg-teal/5 transition-colors duration-200">
                  <td className="p-3 font-medium">{s.name}</td>
                  <td className="p-3 font-mono text-xs">{s.employeeId}</td>
                  <td className="p-3">{s.designation}</td>
                  <td className="p-3">{plazaNames[s.plazaId || ""] || "—"}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${s.status === "ACTIVE" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : s.status === "ON_LEAVE" ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"}`}>
                      {s.status === "ACTIVE" ? t("operators.active") : s.status === "ON_LEAVE" ? t("operators.suspended") : t("operators.inactive")}
                    </span>
                  </td>
                  <td className="p-3"><Button variant="ghost" size="sm" onClick={() => startEdit(s)}>{t("operators.edit")}</Button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

