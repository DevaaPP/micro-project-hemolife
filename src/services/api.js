/**
 * HemoLife API Service
 * ─────────────────────────────────────────────────────────────────
 * Replace BASE_URL with your real backend when ready.
 * All methods return a Promise and use fetch under the hood.
 * Swap to Axios by replacing `apiFetch` with `axios.get / .post / .put / .delete`.
 */

const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:4000/api";

/**
 * Generic fetch wrapper with JSON handling and error surfacing.
 */
async function apiFetch(path, options = {}) {
  const response = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json", ...options.headers },
    ...options,
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(err.message ?? "API request failed");
  }

  return response.json();
}

// ─── DONORS ──────────────────────────────────────────────────────

/** Fetch paginated donor list. */
export const getDonors = ({ page = 1, limit = 20, search = "", blood = "", status = "" } = {}) =>
  apiFetch(`/donors?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}&blood=${blood}&status=${status}`);

/** Fetch single donor by ID. */
export const getDonor = (id) => apiFetch(`/donors/${id}`);

/** Register a new donor. */
export const createDonor = (payload) =>
  apiFetch("/donors", { method: "POST", body: JSON.stringify(payload) });

/** Update donor record. */
export const updateDonor = (id, payload) =>
  apiFetch(`/donors/${id}`, { method: "PUT", body: JSON.stringify(payload) });

/** Delete donor. */
export const deleteDonor = (id) => apiFetch(`/donors/${id}`, { method: "DELETE" });

// ─── CAMPAIGNS ───────────────────────────────────────────────────

/** Fetch all active campaigns. */
export const getCampaigns = () => apiFetch("/campaigns");

/** Register donor for a campaign. */
export const registerForCampaign = (campaignId, donorId) =>
  apiFetch(`/campaigns/${campaignId}/register`, { method: "POST", body: JSON.stringify({ donorId }) });

// ─── DASHBOARD ───────────────────────────────────────────────────

/** Fetch summary metrics (total donations, eligible count, etc.). */
export const getDashboardMetrics = () => apiFetch("/dashboard/metrics");

/** Fetch recent donation activity feed. */
export const getRecentActivity = (limit = 10) =>
  apiFetch(`/dashboard/activity?limit=${limit}`);

/** Fetch blood inventory levels. */
export const getBloodInventory = () => apiFetch("/dashboard/inventory");

// ─── PROFILE ─────────────────────────────────────────────────────

/** Fetch logged-in user profile. */
export const getProfile = () => apiFetch("/profile");

/** Update profile. */
export const updateProfile = (payload) =>
  apiFetch("/profile", { method: "PUT", body: JSON.stringify(payload) });

/** Fetch donation history for logged-in user. */
export const getDonationHistory = () => apiFetch("/profile/history");
