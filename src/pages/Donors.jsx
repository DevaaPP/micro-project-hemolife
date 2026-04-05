import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getDonors, deleteDonor } from "../services/donorService";

const STATUS_STYLE = {
  eligible:  { bg:"#dcfce7", color:"#166534", label:"Eligible" },
  temporary: { bg:"#fef3c7", color:"#92400e", label:"Temporary" },
  permanent: { bg:"#fee2e2", color:"#991b1b", label:"Ineligible" },
};

export default function Donors() {
  const navigate       = useNavigate();
  const { user }       = useAuth();
  const [donors, setDonors]     = useState([]);
  const [search, setSearch]     = useState("");
  const [bloodF, setBloodF]     = useState("");
  const [statusF, setStatusF]   = useState("");
  const [deleteId, setDeleteId] = useState(null);   /* confirm dialog */

  /* Load from localStorage every time page renders */
  useEffect(() => { setDonors(getDonors()); }, []);

  const filtered = donors.filter((d) => {
    const q   = search.toLowerCase();
    const mS  = !q   || d.name.toLowerCase().includes(q) || d.blood.toLowerCase().includes(q) || d.location.toLowerCase().includes(q) || d.email.toLowerCase().includes(q);
    const mB  = !bloodF  || d.blood === bloodF;
    const mSt = !statusF || d.status === statusF;
    return mS && mB && mSt;
  });

  const handleDelete = (id) => {
    deleteDonor(id);
    setDonors(getDonors());
    setDeleteId(null);
  };

  return (
    <div className="min-h-screen pt-[100px] pb-16 px-[5%]"
      style={{ background: "#f9fafb", fontFamily: "Poppins, sans-serif" }}>

      {/* ── Page header ── */}
      <div className="bg-white rounded-3xl p-7 mb-6 border border-gray-100 flex items-center justify-between flex-wrap gap-4"
        style={{ boxShadow: "0 1px 4px rgba(0,0,0,.05)" }}>
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-[1.6rem] font-extrabold text-gray-900">Donor Registry</h1>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-red-50 text-red-600">
              {filtered.length} donors
            </span>
          </div>
          <p className="text-sm text-gray-400">
            {user ? "Manage and track all registered blood donors" : "Browse our registered blood donors"}
          </p>
        </div>

        {/* Only logged-in users can add donors */}
        {user ? (
          <button onClick={() => navigate("/donors/add")}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl text-white text-sm font-bold border-none cursor-pointer transition-all hover:-translate-y-0.5 font-[inherit]"
            style={{ background: "linear-gradient(135deg,#f43f5e,#be123c)", boxShadow: "0 6px 20px rgba(193,21,42,.28)" }}>
            + Register New Donor
          </button>
        ) : (
          /* Not logged in — prompt to login */
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500">Want to donate?</span>
            <button onClick={() => navigate("/login")}
              className="px-6 py-3 rounded-2xl text-white text-sm font-bold border-none cursor-pointer font-[inherit]"
              style={{ background: "linear-gradient(135deg,#f43f5e,#be123c)", boxShadow: "0 6px 20px rgba(193,21,42,.28)" }}>
              Login to Register →
            </button>
          </div>
        )}
      </div>

      {/* ── Guest banner — visible only when not logged in ── */}
      {!user && (
        <div className="mb-6 p-4 rounded-2xl flex items-center gap-4 flex-wrap"
          style={{ background: "linear-gradient(135deg,#fff1f2,#ffe4e6)", border: "1.5px solid #fecdd3" }}>
          <span className="text-2xl">🔒</span>
          <div className="flex-1">
            <p className="text-sm font-bold text-red-800">You're browsing as a guest</p>
            <p className="text-xs text-red-600 mt-0.5">
              You can view the donor list but donor contact details are hidden. Log in to register as a donor or access full information.
            </p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => navigate("/login")}
              className="px-4 py-2 rounded-xl text-sm font-bold border-none cursor-pointer font-[inherit]"
              style={{ background: "#e11d48", color: "white" }}>
              Sign In
            </button>
            <button onClick={() => navigate("/register")}
              className="px-4 py-2 rounded-xl text-sm font-semibold border border-red-300 bg-white text-red-700 cursor-pointer font-[inherit]">
              Register
            </button>
          </div>
        </div>
      )}

      {/* ── Search & filters ── */}
      <div className="flex gap-3.5 mb-6 flex-wrap">
        <div className="flex-1 min-w-[200px] relative">
          <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" width="16" height="16"
            viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, blood type, location…"
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-2xl text-sm text-gray-800 bg-white outline-none transition-all font-[inherit]"
            style={{ fontFamily: "Poppins, sans-serif" }}
            onFocus={(e) => e.target.style.borderColor="#e11d48"}
            onBlur={(e)  => e.target.style.borderColor="#e5e7eb"} />
        </div>
        <select value={bloodF} onChange={(e) => setBloodF(e.target.value)}
          className="px-4 py-3 border border-gray-200 rounded-2xl text-sm text-gray-700 bg-white outline-none cursor-pointer font-[inherit]">
          <option value="">All Blood Types</option>
          {["A+","A-","B+","B-","O+","O-","AB+","AB-"].map((t) => <option key={t}>{t}</option>)}
        </select>
        <select value={statusF} onChange={(e) => setStatusF(e.target.value)}
          className="px-4 py-3 border border-gray-200 rounded-2xl text-sm text-gray-700 bg-white outline-none cursor-pointer font-[inherit]">
          <option value="">All Status</option>
          <option value="eligible">Eligible</option>
          <option value="temporary">Temporary</option>
          <option value="permanent">Ineligible</option>
        </select>
      </div>

      {/* ── Table ── */}
      <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden"
        style={{ boxShadow: "0 1px 4px rgba(0,0,0,.05)" }}>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead className="bg-gray-50">
              <tr>
                {["Donor","Blood","Age","Location",
                  user ? "Phone" : "Phone",        /* hidden for guests */
                  "Last Donated","Donations","Status",
                  user ? "Actions" : ""].filter(Boolean).map((h) => (
                  <th key={h} className="px-5 py-3.5 text-left text-xs font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-16 text-center text-gray-400 text-sm">
                    No donors found matching your search.
                  </td>
                </tr>
              )}

              {filtered.map((d) => {
                const st = STATUS_STYLE[d.status] || STATUS_STYLE.eligible;
                return (
                  <tr key={d.id} className="border-b border-gray-50 last:border-none hover:bg-red-50/30 transition-colors">
                    {/* Name */}
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-xs flex-shrink-0"
                          style={{ background: d.bg }}>{d.initials}</div>
                        <div>
                          <div className="text-sm font-semibold text-gray-900">{d.name}</div>
                          {/* Email only shown to logged-in users */}
                          {user
                            ? <div className="text-xs text-gray-400">{d.email}</div>
                            : <div className="text-xs text-gray-300 select-none">🔒 Login to view</div>
                          }
                        </div>
                      </div>
                    </td>

                    {/* Blood */}
                    <td className="px-5 py-3.5">
                      <span className="px-2.5 py-1 rounded-full text-xs font-extrabold bg-red-100 text-red-700">{d.blood}</span>
                    </td>

                    {/* Age */}
                    <td className="px-5 py-3.5 text-sm text-gray-600">{d.age}</td>

                    {/* Location */}
                    <td className="px-5 py-3.5 text-sm text-gray-600">📍 {d.location}</td>

                    {/* Phone — blurred for guests */}
                    <td className="px-5 py-3.5 text-sm">
                      {user
                        ? <span className="text-gray-600">{d.phone}</span>
                        : <span className="text-xs text-gray-300 bg-gray-100 px-2 py-1 rounded-lg select-none cursor-pointer"
                            onClick={() => navigate("/login")}
                            title="Login to view">
                            🔒 Hidden
                          </span>
                      }
                    </td>

                    {/* Last donated */}
                    <td className="px-5 py-3.5 text-sm text-gray-600">{d.lastDonated}</td>

                    {/* Count */}
                    <td className="px-5 py-3.5 text-sm font-semibold text-gray-800">{d.count}</td>

                    {/* Status */}
                    <td className="px-5 py-3.5">
                      <span className="px-2.5 py-1 rounded-full text-xs font-bold"
                        style={{ background: st.bg, color: st.color }}>{st.label}</span>
                    </td>

                    {/* Actions — logged-in only */}
                    {user && (
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2">
                          <button onClick={() => navigate("/profile")}
                            className="px-3 py-1.5 rounded-xl text-white text-xs font-bold border-none cursor-pointer font-[inherit] transition-all hover:scale-105"
                            style={{ background: "linear-gradient(135deg,#f43f5e,#be123c)", boxShadow: "0 3px 10px rgba(193,21,42,.28)" }}>
                            View
                          </button>
                          {/* Admin can delete */}
                          {user.role === "admin" && (
                            <button onClick={() => setDeleteId(d.id)}
                              className="px-3 py-1.5 rounded-xl text-red-600 text-xs font-bold border border-red-200 bg-red-50 cursor-pointer font-[inherit] hover:bg-red-100 transition-all">
                              Delete
                            </button>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-4 text-sm text-gray-400 px-1">
        Showing {filtered.length} of {donors.length} donors
        {!user && " · Log in to see full details and register as a donor"}
      </div>

      {/* ── Delete confirm dialog ── */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4"
          style={{ background: "rgba(0,0,0,.45)" }}>
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center"
            style={{ boxShadow: "0 24px 64px rgba(0,0,0,.25)" }}>
            <div className="text-4xl mb-4">⚠️</div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Delete this donor?</h3>
            <p className="text-sm text-gray-400 mb-6">This action cannot be undone. The donor record will be permanently removed.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)}
                className="flex-1 py-3 rounded-2xl text-gray-600 text-sm font-semibold border border-gray-200 bg-white cursor-pointer font-[inherit] hover:bg-gray-50 transition-all">
                Cancel
              </button>
              <button onClick={() => handleDelete(deleteId)}
                className="flex-1 py-3 rounded-2xl text-white text-sm font-bold border-none cursor-pointer font-[inherit]"
                style={{ background: "linear-gradient(135deg,#f43f5e,#be123c)" }}>
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
