// src/lib/utils.js
export function buildQuery({ profileid, search, currentPage }) {
  const params = new URLSearchParams();
  if (profileid) params.append("ownerId", profileid);
  if (search) params.append("search", search);
  if (currentPage) params.append("currentPage", currentPage);

  return `?${params.toString()}`;
}
