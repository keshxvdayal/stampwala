"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

async function call(url: string, method: string, data: unknown) { const r = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) }); return r.json(); }

export function AddOutlet() {
  const router = useRouter(); const [name, setName] = useState(""); const [city, setCity] = useState(""); const [err, setErr] = useState("");
  return (
    <form className="mt-4 flex flex-wrap items-end gap-3" onSubmit={async (e) => { e.preventDefault(); const j = await call("/api/outlets", "POST", { name, city }); if (j.ok) { setName(""); setCity(""); setErr(""); router.refresh(); } else setErr(j.error); }}>
      <div><label className="label !mt-0" htmlFor="on">Outlet name</label><input id="on" className="input !w-48" required value={name} onChange={(e) => setName(e.target.value)} /></div>
      <div><label className="label !mt-0" htmlFor="oc">City</label><input id="oc" className="input !w-40" value={city} onChange={(e) => setCity(e.target.value)} /></div>
      <button className="btn btn-dark btn-sm">Add outlet</button>
      {err && <p className="w-full text-sm font-medium text-tomato" role="alert">{err}</p>}
    </form>
  );
}

export function AddStaff({ outlets }: { outlets: { id: number; name: string }[] }) {
  const router = useRouter(); const [f, setF] = useState({ name: "", pin: "", outlet: outlets[0]?.id ?? 0, role: "cashier" }); const [err, setErr] = useState("");
  return (
    <form className="mt-4 flex flex-wrap items-end gap-3" onSubmit={async (e) => { e.preventDefault(); const j = await call("/api/staff", "POST", f); if (j.ok) { setF({ ...f, name: "", pin: "" }); setErr(""); router.refresh(); } else setErr(j.error); }}>
      <div><label className="label !mt-0" htmlFor="sn">Name</label><input id="sn" className="input !w-40" required value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} /></div>
      <div><label className="label !mt-0" htmlFor="sp">PIN (4–6 digits)</label><input id="sp" className="input !w-36 font-mono" inputMode="numeric" required maxLength={6} value={f.pin} onChange={(e) => setF({ ...f, pin: e.target.value.replace(/\D/g, "") })} /></div>
      <div><label className="label !mt-0" htmlFor="so">Outlet</label><select id="so" className="input !w-44" value={f.outlet} onChange={(e) => setF({ ...f, outlet: +e.target.value })}>{outlets.map((o) => <option key={o.id} value={o.id}>{o.name}</option>)}</select></div>
      <div><label className="label !mt-0" htmlFor="sr">Role</label><select id="sr" className="input !w-36" value={f.role} onChange={(e) => setF({ ...f, role: e.target.value })}><option value="cashier">Cashier</option><option value="manager">Manager</option></select></div>
      <button className="btn btn-dark btn-sm">Add staff</button>
      {err && <p className="w-full text-sm font-medium text-tomato" role="alert">{err}</p>}
    </form>
  );
}

export function RemoveStaff({ id }: { id: number }) {
  const router = useRouter();
  return <button className="text-sm font-semibold text-tomato hover:underline" onClick={async () => { if (confirm("Deactivate this staff member? Their PIN will stop working.")) { await call("/api/staff", "DELETE", { id }); router.refresh(); } }}>Deactivate</button>;
}
