import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const HISTORY = [
  { icon:"🩸", title:"Whole Blood Donation", meta:"Red Cross Silchar · April 1, 2026",    badge:"O-" },
  { icon:"🩸", title:"Whole Blood Donation", meta:"Silchar Medical · January 8, 2026",    badge:"O-" },
  { icon:"💊", title:"Platelet Donation",    meta:"Cachar Cancer · Oct 15, 2025",         badge:"O-" },
  { icon:"🩸", title:"Whole Blood Donation", meta:"Community Drive · July 22, 2025",      badge:"O-" },
  { icon:"🧬", title:"Plasma Donation",      meta:"Assam Univ Center · April 10, 2025",  badge:"O-" },
];

export default function Profile() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const initials = user?.name
    ? user.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()
    : "?";

  const handleLogout = () => { logout(); navigate("/login"); };

  return (
    <div className="min-h-screen pt-[100px] pb-16 px-[5%]" style={{ background: "#f9fafb", fontFamily: "Poppins, sans-serif" }}>

      {/* Hero banner */}
      <div className="rounded-[28px] p-10 md:p-12 mb-7 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg,#be123c,#881337)" }}>
        <div className="absolute w-[280px] h-[280px] rounded-full -right-16 -bottom-16"
          style={{ border: "56px solid rgba(255,255,255,.07)" }} />

        <div className="flex items-end gap-6 mb-6 relative z-10 flex-wrap">
          <div className="w-24 h-24 rounded-full flex items-center justify-center text-[1.8rem] font-extrabold flex-shrink-0"
            style={{ background: "linear-gradient(135deg,#ff8a95,white)", border: "4px solid rgba(255,255,255,.3)", color: "#be123c" }}>
            {initials}
          </div>
          <div>
            <h1 className="text-[1.8rem] font-extrabold text-white">{user?.name || "Donor"}</h1>
            <p className="text-white/70 text-sm mt-1">
              🩸 {user?.role === "admin" ? "Administrator" : "Active Donor"} · Since {user?.joinedDate || "2024"}
            </p>
          </div>
        </div>

        <div className="flex gap-2.5 flex-wrap relative z-10">
          {[
            user?.bloodType && `💉 ${user.bloodType}`,
            user?.role === "admin" ? "🔑 Admin" : "❤️ Donor",
            user?.location && `📍 ${user.location}`,
            "✅ Verified",
          ].filter(Boolean).map((b) => (
            <div key={b} className="text-white text-xs font-medium px-3.5 py-1.5 rounded-full"
              style={{ background: "rgba(255,255,255,.15)", border: "1px solid rgba(255,255,255,.2)", backdropFilter: "blur(8px)" }}>
              {b}
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-6">
        {/* Info card */}
        <div className="bg-white rounded-[22px] p-7 border border-gray-100" style={{ boxShadow: "0 1px 4px rgba(0,0,0,.05)" }}>
          <h2 className="text-base font-bold text-gray-900 mb-5">Account Details</h2>
          {[
            ["Full Name",   user?.name     || "—"],
            ["Email",       user?.email    || "—"],
            ["Phone",       user?.phone    || "—"],
            ["Blood Type",  user?.bloodType|| "—"],
            ["Location",    user?.location || "—"],
            ["Role",        user?.role     || "—"],
            ["Member Since",user?.joinedDate || "—"],
          ].map(([label, value]) => (
            <div key={label} className="flex flex-col gap-1 py-3 border-b border-gray-50 last:border-none">
              <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{label}</span>
              {label === "Blood Type" && value !== "—" ? (
                <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-full bg-red-100 text-red-700 w-fit">{value}</span>
              ) : label === "Role" ? (
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full w-fit capitalize"
                  style={{ background: value === "admin" ? "#fee2e2" : "#f0fdf4", color: value === "admin" ? "#991b1b" : "#166534" }}>
                  {value}
                </span>
              ) : (
                <span className="text-sm font-medium text-gray-800">{value}</span>
              )}
            </div>
          ))}

          <div className="flex flex-col gap-3 mt-6">
            <button onClick={() => navigate("/donors/add")}
              className="w-full py-3 rounded-2xl text-white text-sm font-bold border-none cursor-pointer transition-all hover:-translate-y-0.5 font-[inherit]"
              style={{ background: "linear-gradient(135deg,#f43f5e,#be123c)", boxShadow: "0 6px 20px rgba(193,21,42,.28)" }}>
              🩸 Schedule Donation
            </button>
            <button onClick={handleLogout}
              className="w-full py-3 rounded-2xl text-red-600 text-sm font-semibold border border-red-200 bg-red-50 cursor-pointer hover:bg-red-100 transition-all font-[inherit]">
              🚪 Sign Out
            </button>
          </div>
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-6">
          {/* Stats */}
          <div className="bg-white rounded-[22px] p-7 border border-gray-100 grid grid-cols-3 gap-4"
            style={{ boxShadow: "0 1px 4px rgba(0,0,0,.05)" }}>
            {[
              { num: user?.donations ?? 0, label: "Total Donations", bg: "#fff1f2", numColor: "#be123c", subColor: "#fb7185" },
              { num: (user?.donations ?? 0) * 3, label: "Lives Impacted",  bg: "#f0fdf4", numColor: "#166534", subColor: "#4ade80" },
              { num: "A+",  label: "Current Status",  bg: "#eff6ff", numColor: "#1d4ed8", subColor: "#60a5fa" },
            ].map((s) => (
              <div key={s.label} className="text-center py-4 rounded-2xl" style={{ background: s.bg }}>
                <div className="text-[1.8rem] font-extrabold leading-none" style={{ color: s.numColor }}>{s.num}</div>
                <div className="text-xs font-medium mt-1.5" style={{ color: s.subColor }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Donation history */}
          <div className="bg-white rounded-[22px] p-7 border border-gray-100"
            style={{ boxShadow: "0 1px 4px rgba(0,0,0,.05)" }}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-base font-bold text-gray-900">Donation History</h2>
              <span className="text-xs text-red-500 font-medium">5 records</span>
            </div>
            {HISTORY.map((h, i) => (
              <div key={i} className="flex items-center gap-4 py-3.5 border-b border-gray-50 last:border-none">
                <div className="w-10 h-10 rounded-2xl bg-red-50 flex items-center justify-center text-lg flex-shrink-0">{h.icon}</div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-800">{h.title}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{h.meta}</p>
                </div>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-red-50 text-red-600">{h.badge}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
